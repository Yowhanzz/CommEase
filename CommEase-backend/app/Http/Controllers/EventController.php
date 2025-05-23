<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
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
            $query->whereHas('volunteers', function ($q) use ($user) {
                $q->where('volunteer_id', $user->id);
            });
        }

        $events = $query->with(['organizer', 'volunteers'])
            ->orderBy('date')
            ->paginate($request->get('per_page', 10));

        return response()->json($events);
    }

    public function store(Request $request)
    {
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
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $event = Event::create([
            'event_title' => $request->eventTitle,
            'barangay' => $request->barangay,
            'organizer_id' => $request->user()->id,
            'programs' => $request->programs,
            'date' => $request->date,
            'start_time' => $request->startTime,
            'end_time' => $request->endTime,
            'objective' => $request->objective,
            'description' => $request->description,
            'things_needed' => $request->thingsNeeded,
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
    }

    public function show(Event $event)
    {
        $event->load(['organizer', 'volunteers']);
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

        $event->update($request->all());

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
            return response()->json(['message' => 'Event must be in upcoming status to start'], 422);
        }

        $event->update([
            'status' => 'ongoing',
            'started_at' => now()
        ]);

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
            return response()->json(['message' => 'Event must be in ongoing status to end'], 422);
        }

        $event->update([
            'status' => 'completed',
            'ended_at' => now()
        ]);

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
}
