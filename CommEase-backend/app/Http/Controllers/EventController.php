<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;

class EventController extends Controller
{
    public function __construct()
    {
        //
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $query = Event::query();

        // Search by title or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('event_title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->has('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }
        if ($request->has('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        // Filter by program
        if ($request->has('program')) {
            $query->whereJsonContains('programs', $request->program);
        }

        // Filter by barangay
        if ($request->has('barangay')) {
            $query->where('barangay', $request->barangay);
        }

        if ($user->role === 'organizer') {
            $query->where('organizer_id', $user->id);
        } else {
            // For volunteers, show all events that match their program
            $query->whereJsonContains('programs', $user->program);
        }

        $events = $query->with(['organizer', 'volunteers'])
            ->orderBy('date')
            ->paginate($request->get('per_page', 10));

        // Append formatted time attributes to each event
        $events->getCollection()->transform(function ($event) {
            $event->append([
                'start_time_formatted',
                'end_time_formatted',
                'started_at_formatted',
                'ended_at_formatted'
            ]);
            return $event;
        });

        return response()->json($events);
    }

    public function store(Request $request)
    {
        \Log::info('Create Event Request Data:', [
            'request_data' => $request->all(),
            'user' => $request->user(),
            'headers' => $request->headers->all()
        ]);

        $validator = Validator::make($request->all(), [
            'eventTitle' => ['required', 'string', 'max:255'],
            'barangay' => ['required', 'string'],
            'programs' => ['required', 'array'],
            'programs.*' => ['required', Rule::in(['BSIT', 'BSCS', 'BSEMC'])],
            'date' => ['required', 'date', 'after:today'],
            'startTime' => ['required', 'date_format:H:i'],
            'endTime' => ['required', 'date_format:H:i', 'after:startTime'],
            'objective' => ['required', 'string'],
            'description' => ['required', 'string'],
            'thingsNeeded' => ['required', 'array'],
            'thingsNeeded.*' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            \Log::error('Event Creation Validation Failed:', [
                'errors' => $validator->errors()->toArray()
            ]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            // Format the date and times
            $date = $request->date;
            $startTime = $request->startTime;
            $endTime = $request->endTime;

            $event = Event::create([
                'event_title' => $request->eventTitle,
                'barangay' => $request->barangay,
                'organizer_id' => $request->user()->id,
                'programs' => $request->programs,
                'date' => $date,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'objective' => $request->objective,
                'description' => $request->description,
                'things_needed' => $request->thingsNeeded,
            ]);

            \Log::info('Event Created Successfully:', [
                'event_id' => $event->id,
                'event_data' => $event->toArray()
            ]);

            // Notify eligible volunteers
            $eligibleVolunteers = User::whereIn('program', $request->programs)
                ->where('role', 'volunteer')
                ->get();

            foreach ($eligibleVolunteers as $volunteer) {
                Notification::create([
                    'user_id' => $volunteer->id,
                    'event_id' => $event->id,
                    'type' => 'new_event',
                    'message' => "New event available: {$event->event_title}",
                ]);
            }

            return response()->json($event, 201);
        } catch (\Exception $e) {
            \Log::error('Event Creation Failed:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Failed to create event', 'error' => $e->getMessage()], 500);
        }
    }

    public function show(Event $event)
    {
        $event->load(['organizer', 'volunteers']);
        $event->append([
            'start_time_formatted',
            'end_time_formatted',
            'started_at_formatted',
            'ended_at_formatted'
        ]);
        return response()->json($event);
    }

    public function update(Request $request, Event $event)
    {
        if ($event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($event->date->subDay()->isPast()) {
            return response()->json(['message' => 'Cannot update event less than 1 day away'], 422);
        }

        $validator = Validator::make($request->all(), [
            'eventTitle' => ['sometimes', 'required', 'string', 'max:255'],
            'barangay' => ['sometimes', 'required', 'string'],
            'programs' => ['sometimes', 'required', 'array'],
            'programs.*' => ['required', Rule::in(['BSIT', 'BSCS', 'BSEMC'])],
            'date' => ['sometimes', 'required', 'date', 'after:today'],
            'startTime' => ['sometimes', 'required', 'date_format:H:i'],
            'endTime' => ['sometimes', 'required', 'date_format:H:i', 'after:startTime'],
            'objective' => ['sometimes', 'required', 'string'],
            'description' => ['sometimes', 'required', 'string'],
            'thingsNeeded' => ['sometimes', 'required', 'array'],
            'thingsNeeded.*' => ['required', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Format the date and times
        $date = $request->date ?? $event->date;
        $startTime = $request->startTime ?? $event->start_time;
        $endTime = $request->endTime ?? $event->end_time;

        $event->update([
            'event_title' => $request->eventTitle ?? $event->event_title,
            'barangay' => $request->barangay ?? $event->barangay,
            'programs' => $request->programs ?? $event->programs,
            'date' => $date,
            'start_time' => $startTime,
            'end_time' => $endTime,
            'objective' => $request->objective ?? $event->objective,
            'description' => $request->description ?? $event->description,
            'things_needed' => $request->thingsNeeded ?? $event->things_needed,
        ]);

        // Notify registered volunteers
        foreach ($event->volunteers as $volunteer) {
            Notification::create([
                'user_id' => $volunteer->id,
                'event_id' => $event->id,
                'type' => 'event_updated',
                'message' => "Event updated: {$event->event_title}",
            ]);
        }

        return response()->json($event);
    }

    public function destroy(Request $request, Event $event)
    {
        if ($event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Notify registered volunteers
        foreach ($event->volunteers as $volunteer) {
            Notification::create([
                'user_id' => $volunteer->id,
                'event_id' => $event->id,
                'type' => 'event_cancelled',
                'message' => "Event cancelled: {$event->event_title}",
            ]);
        }

        $event->delete();

        return response()->json(['message' => 'Event deleted successfully']);
    }

    public function startEvent(Request $request, Event $event)
    {
        if ($event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($event->status !== 'upcoming') {
            return response()->json(['message' => 'Event can only be started when in upcoming status'], 422);
        }

        $event->update([
            'status' => 'ongoing',
            'started_at' => now()
        ]);

        // Notify registered volunteers
        foreach ($event->volunteers as $volunteer) {
            Notification::create([
                'user_id' => $volunteer->id,
                'event_id' => $event->id,
                'type' => 'event_started',
                'message' => "Event started: {$event->event_title}",
            ]);
        }

        return response()->json($event);
    }

    public function endEvent(Request $request, Event $event)
    {
        if ($event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($event->status !== 'ongoing') {
            return response()->json(['message' => 'Event can only be ended when in ongoing status'], 422);
        }

        $event->update([
            'status' => 'completed',
            'ended_at' => now()
        ]);

        // Notify registered volunteers
        foreach ($event->volunteers as $volunteer) {
            Notification::create([
                'user_id' => $volunteer->id,
                'event_id' => $event->id,
                'type' => 'event_ended',
                'message' => "Event ended: {$event->event_title}",
            ]);
        }

        return response()->json($event);
    }

    public function markAttendance(Request $request, Event $event)
    {
        if ($event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'volunteer_id' => ['required', 'exists:users,id'],
            'status' => ['required', 'in:present,absent'],
            'notes' => ['nullable', 'string']
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $event->volunteers()->updateExistingPivot($request->volunteer_id, [
            'attendance_status' => $request->status,
            'attendance_notes' => $request->notes,
            'attendance_marked_at' => now()
        ]);

        Notification::create([
            'user_id' => $request->volunteer_id,
            'event_id' => $event->id,
            'type' => 'attendance_marked',
            'message' => "Your attendance has been marked as {$request->status} for event: {$event->event_title}",
        ]);

        return response()->json(['message' => 'Attendance marked successfully']);
    }

    public function getAttendance(Request $request, Event $event)
    {
        if ($event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $attendance = $event->volunteers()
            ->select('users.id', 'users.full_name', 'users.email', 'event_volunteer.attendance_status', 'event_volunteer.attendance_notes', 'event_volunteer.attendance_marked_at')
            ->get();

        return response()->json($attendance);
    }

    public function getAnalytics(Event $event)
    {
        return response()->json([
            'duration' => $event->duration,
            'registered_count' => $event->registered_count,
            'attended_count' => $event->attended_count,
            'average_volunteer_time' => $event->average_volunteer_time,
            'things_brought' => $event->volunteers()
                ->whereNotNull('things_brought')
                ->pluck('things_brought')
                ->flatten()
                ->countBy(),
            'absentees' => $event->volunteers()
                ->whereNull('time_in')
                ->get()
                ->map(function ($volunteer) {
                    return [
                        'id' => $volunteer->id,
                        'name' => $volunteer->full_name,
                        'email' => $volunteer->email,
                    ];
                }),
        ]);
    }

    public function submitFeedback(Request $request, Event $event)
    {
        if (!$event->volunteers()->where('volunteer_id', $request->user()->id)->exists()) {
            return response()->json(['message' => 'You must be a registered volunteer to submit feedback'], 403);
        }

        if ($event->status !== 'completed') {
            return response()->json(['message' => 'Feedback can only be submitted for completed events'], 422);
        }

        $validator = Validator::make($request->all(), [
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'feedback' => ['required', 'string', 'min:10'],
            'improvements' => ['nullable', 'string'],
            'would_volunteer_again' => ['required', 'boolean']
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $feedback = $event->feedbacks()->create([
            'volunteer_id' => $request->user()->id,
            'rating' => $request->rating,
            'feedback' => $request->feedback,
            'improvements' => $request->improvements,
            'would_volunteer_again' => $request->would_volunteer_again
        ]);

        Notification::create([
            'user_id' => $event->organizer_id,
            'event_id' => $event->id,
            'type' => 'new_feedback',
            'message' => "New feedback received for event: {$event->event_title}",
        ]);

        return response()->json($feedback, 201);
    }

    public function getFeedback(Request $request, Event $event)
    {
        if ($event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $feedback = $event->feedbacks()
            ->with('volunteer:id,full_name')
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'average_rating' => $feedback->avg('rating'),
            'total_feedback' => $feedback->count(),
            'would_volunteer_again_percentage' => ($feedback->where('would_volunteer_again', true)->count() / $feedback->count()) * 100,
            'rating_distribution' => $feedback->groupBy('rating')
                ->map(fn($group) => $group->count())
                ->toArray()
        ];

        return response()->json([
            'feedback' => $feedback,
            'stats' => $stats
        ]);
    }

    public function register(Request $request, Event $event)
    {
        $user = $request->user();

        // Check if user is a volunteer
        if ($user->role !== 'volunteer') {
            return response()->json(['message' => 'Only volunteers can register for events'], 403);
        }

        // Check if event is still open for registration
        if ($event->status !== 'pending') {
            return response()->json(['message' => 'Event is no longer open for registration'], 422);
        }

        // Check if volunteer's program matches event requirements
        if (!in_array($user->program, $event->programs)) {
            return response()->json(['message' => 'Your program is not eligible for this event'], 403);
        }

        // Check if already registered
        if ($event->volunteers()->where('volunteer_id', $user->id)->exists()) {
            return response()->json(['message' => 'You are already registered for this event'], 422);
        }

        // Register volunteer
        $event->volunteers()->attach($user->id);

        // Notify organizer
        Notification::create([
            'user_id' => $event->organizer_id,
            'event_id' => $event->id,
            'type' => 'volunteer_registered',
            'message' => "New volunteer registered: {$user->full_name}",
        ]);

        return response()->json(['message' => 'Successfully registered for the event']);
    }

    public function submitThingsBrought(Request $request, Event $event)
    {
        $user = $request->user();

        // Check if user is registered for the event
        if (!$event->volunteers()->where('volunteer_id', $user->id)->exists()) {
            return response()->json(['message' => 'You must be registered for this event'], 403);
        }

        $validator = Validator::make($request->all(), [
            'things_brought' => ['required', 'array'],
            'things_brought.*' => ['required', 'string', 'max:255']
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update things brought
        $event->volunteers()->updateExistingPivot($user->id, [
            'things_brought' => $request->things_brought
        ]);

        // Notify organizer
        Notification::create([
            'user_id' => $event->organizer_id,
            'event_id' => $event->id,
            'type' => 'things_brought_updated',
            'message' => "Volunteer {$user->full_name} updated things they will bring",
        ]);

        return response()->json(['message' => 'Successfully updated things you will bring']);
    }

    public function submitSuggestion(Request $request, Event $event)
    {
        $user = $request->user();

        // Check if user is registered for the event
        if (!$event->volunteers()->where('volunteer_id', $user->id)->exists()) {
            return response()->json(['message' => 'You must be registered for this event'], 403);
        }

        $validator = Validator::make($request->all(), [
            'suggestion' => ['required', 'string', 'min:10', 'max:1000'],
            'category' => ['required', 'string', 'in:logistics,program,venue,other']
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create suggestion
        $suggestion = $event->suggestions()->create([
            'volunteer_id' => $user->id,
            'suggestion' => $request->suggestion,
            'category' => $request->category,
            'status' => 'pending'
        ]);

        // Notify organizer
        Notification::create([
            'user_id' => $event->organizer_id,
            'event_id' => $event->id,
            'type' => 'new_suggestion',
            'message' => "New suggestion from {$user->full_name}",
        ]);

        return response()->json($suggestion, 201);
    }
}
