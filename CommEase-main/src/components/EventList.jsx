import React, { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { eventService } from '../api/services';

const EventList = () => {
    const { data: events, loading, error, execute: fetchEvents } = useApi(eventService.getEvents);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    if (loading) {
        return <div>Loading events...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="event-list">
            <h2>Events</h2>
            {events?.data?.map((event) => (
                <div key={event.id} className="event-card">
                    <h3>{event.event_title}</h3>
                    <p>{event.description}</p>
                    <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>Status: {event.status}</p>
                    <p>Location: {event.barangay}</p>
                </div>
            ))}
        </div>
    );
};

export default EventList; 