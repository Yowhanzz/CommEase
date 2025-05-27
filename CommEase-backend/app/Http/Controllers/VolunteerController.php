<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Notification;
use App\Models\Suggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;


class VolunteerController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('role:volunteer');
    }

    public function registerForEvent(Request $request, Event $event)
    {
        if ($event->status !== 'upcoming') {
            return response()->json(['message' => 'Cannot register for this event'], 422);
        }

        if (!in_array($request->user()->program, $event->programs)) {
            return response()->json(['message' => 'This event is not available for your program'], 422);
        }

        if ($event->volunteers()->where('volunteer_id', $request->user()->id)->exists()) {
            return response()->json(['message' => 'Already registered for this event'], 422);
        }

        $event->volunteers()->attach($request->user()->id);

        Notification::create([
            'user_id' => $event->organizer_id,
            'event_id' => $event->id,
            'type' => 'volunteer_registered',
            'message' => "New volunteer registered: {$request->user()->full_name}",
        ]);

        return response()->json(['message' => 'Successfully registered for event']);
    }

    public function unregisterFromEvent(Request $request, Event $event)
    {
        if ($event->status !== 'upcoming') {
            return response()->json(['message' => 'Cannot unregister from this event'], 422);
        }

        $event->volunteers()->detach($request->user()->id);

        Notification::create([
            'user_id' => $event->organizer_id,
            'event_id' => $event->id,
            'type' => 'volunteer_unregistered',
            'message' => "Volunteer unregistered: {$request->user()->full_name}",
        ]);

        return response()->json(['message' => 'Successfully unregistered from event']);
    }

    public function submitThingsBrought(Request $request, Event $event)
    {
        $validator = Validator::make($request->all(), [
            'thingsBrought' => ['required', 'array'],
            'thingsBrought.*' => ['required', 'string', 'in:' . implode(',', $event->things_needed)],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $event->volunteers()->updateExistingPivot($request->user()->id, [
            'things_brought' => $request->thingsBrought
        ]);

        Notification::create([
            'user_id' => $event->organizer_id,
            'event_id' => $event->id,
            'type' => 'things_brought_updated',
            'message' => "Volunteer updated things brought: {$request->user()->full_name}",
        ]);

        return response()->json(['message' => 'Successfully updated things brought']);
    }

    public function submitSuggestion(Request $request, Event $event)
    {
        $validator = Validator::make($request->all(), [
            'suggestion' => ['required', 'string', 'min:10'],
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $suggestion = Suggestion::create([
            'event_id' => $event->id,
            'volunteer_id' => $request->user()->id,
            'suggestion' => $request->suggestion,
        ]);

        Notification::create([
            'user_id' => $event->organizer_id,
            'event_id' => $event->id,
            'type' => 'new_suggestion',
            'message' => "New suggestion from: {$request->user()->full_name}",
        ]);

        return response()->json($suggestion, 201);
    }

    public function getEventHistory(Request $request)
    {
        $events = $request->user()
            ->volunteeredEvents()
            ->with(['organizer'])
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->event_title,
                    'date' => $event->date,
                    'status' => $event->status,
                    'organizer' => $event->organizer->full_name,
                    'time_in' => $event->pivot->time_in,
                    'time_out' => $event->pivot->time_out,
                    'things_brought' => $event->pivot->things_brought,
                ];
            });

        return response()->json($events);
    }
}
