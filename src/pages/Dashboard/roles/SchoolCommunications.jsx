import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function SchoolCommunications() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', description: '' });

  useEffect(() => {
    loadCommunications();
  }, []);

  const loadCommunications = () => {
    const savedAnnouncements = JSON.parse(localStorage.getItem('schoolAnnouncements')) || [];
    const savedEvents = JSON.parse(localStorage.getItem('schoolEvents')) || [];
    setAnnouncements(savedAnnouncements);
    setEvents(savedEvents);
  };

  const postAnnouncement = () => {
    if (!newAnnouncement.trim()) return;

    const announcement = {
      id: Date.now().toString(),
      content: newAnnouncement,
      author: user.name,
      date: new Date().toLocaleDateString(),
      timestamp: new Date().toISOString()
    };

    const updated = [announcement, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('schoolAnnouncements', JSON.stringify(updated));
    setNewAnnouncement('');
  };

  const addEvent = () => {
    if (!newEvent.title.trim() || !newEvent.date) return;

    const event = {
      id: Date.now().toString(),
      ...newEvent,
      createdBy: user.name,
      createdAt: new Date().toISOString()
    };

    const updated = [...events, event];
    setEvents(updated);
    localStorage.setItem('schoolEvents', JSON.stringify(updated));
    setNewEvent({ title: '', date: '', description: '' });
  };

  const canManage = user.role === 'VP Admin' || user.role === 'Principal';

  return (
    <div className="space-y-6">
      {/* Post Announcement - VP Admin only */}
      {canManage && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Post School Announcement</h3>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newAnnouncement}
              onChange={(e) => setNewAnnouncement(e.target.value)}
              placeholder="Enter school announcement..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={postAnnouncement}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Post Announcement
            </button>
          </div>
        </div>
      )}

      {/* Add Event - VP Admin only */}
      {canManage && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Add School Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Event title"
              value={newEvent.title}
              onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newEvent.date}
              onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addEvent}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Event
            </button>
          </div>
          <input
            type="text"
            placeholder="Event description (optional)"
            value={newEvent.description}
            onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* Announcements */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">School Announcements</h2>
        </div>
        <div className="divide-y">
          {announcements.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No announcements yet.
            </div>
          ) : (
            announcements.map(announcement => (
              <div key={announcement.id} className="p-4">
                <p className="text-gray-800">{announcement.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Posted by {announcement.author} on {announcement.date}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Events Calendar */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">School Events Calendar</h2>
        </div>
        <div className="divide-y">
          {events.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No upcoming events.
            </div>
          ) : (
            events.map(event => (
              <div key={event.id} className="p-4">
                <h4 className="font-semibold text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Date: {new Date(event.date).toLocaleDateString()}
                </p>
                {event.description && (
                  <p className="text-gray-700 mt-2">{event.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Added by {event.createdBy}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
