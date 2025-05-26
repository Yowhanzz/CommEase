import React, { useEffect, useState } from 'react';
import { eventService } from '../api/services';
import ProgramAccessError from './ProgramAccessError';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventService.getEvents();
        setEvents(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <ProgramAccessError message={error} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Events</h2>
      {events.length === 0 ? (
        <p>No events available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{event.event_title}</h3>
              <p className="text-gray-600 mb-4">{event.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {event.programs.map((program, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded"
                  >
                    {program}
                  </span>
                ))}
              </div>
              <div className="text-sm text-gray-500">
                <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                <p>Time: {event.start_time} - {event.end_time}</p>
                <p>Location: {event.barangay}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList; 