// src/pages/Dashboard/roles/SchoolEvents.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function SchoolEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    type: 'academic',
    audience: 'all',
    priority: 'medium'
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    const savedEvents = JSON.parse(localStorage.getItem('schoolEvents')) || [];
    setEvents(savedEvents);
  };

  const addEvent = (e) => {
    e.preventDefault();
    
    const eventData = {
      id: `event-${Date.now()}`,
      ...newEvent,
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString(),
      status: 'upcoming'
    };

    const updatedEvents = [...events, eventData];
    setEvents(updatedEvents);
    localStorage.setItem('schoolEvents', JSON.stringify(updatedEvents));

    // Reset form
    setNewEvent({
      title: '',
      description: '',
      date: '',
      type: 'academic',
      audience: 'all',
      priority: 'medium'
    });
    setShowForm(false);
    
    alert('✅ Event added successfully!');
  };

  const deleteEvent = (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('schoolEvents', JSON.stringify(updatedEvents));
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'cultural': return 'bg-purple-100 text-purple-800';
      case 'holiday': return 'bg-yellow-100 text-yellow-800';
      case 'meeting': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-green-500';
      default: return 'border-l-4 border-gray-300';
    }
  };

  const getUpcomingEvents = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getPastEvents = () => {
    const today = new Date();
    return events
      .filter(event => new Date(event.date) < today)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">School Events Calendar</h2>
            <p className="text-gray-600">Manage and track school events, meetings, and activities</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {showForm ? '📋 View Events' : '➕ Add New Event'}
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{events.length}</div>
            <div className="text-sm text-blue-700">Total Events</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{upcomingEvents.length}</div>
            <div className="text-sm text-green-700">Upcoming</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">
              {events.filter(e => e.priority === 'high').length}
            </div>
            <div className="text-sm text-purple-700">High Priority</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">
              {events.filter(e => e.type === 'academic').length}
            </div>
            <div className="text-sm text-orange-700">Academic Events</div>
          </div>
        </div>
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Add New Event</h3>
          <form onSubmit={addEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Title *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full p-2 border rounded"
                  placeholder="Enter event title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Date *</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                className="w-full p-2 border rounded h-20"
                placeholder="Event description and details..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Event Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="academic">Academic</option>
                  <option value="sports">Sports</option>
                  <option value="cultural">Cultural</option>
                  <option value="holiday">Holiday</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Audience</label>
                <select
                  value={newEvent.audience}
                  onChange={(e) => setNewEvent({...newEvent, audience: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="all">All School</option>
                  <option value="staff">Staff Only</option>
                  <option value="students">Students Only</option>
                  <option value="parents">Parents</option>
                  <option value="specific">Specific Classes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={newEvent.priority}
                  onChange={(e) => setNewEvent({...newEvent, priority: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Upcoming Events ({upcomingEvents.length})</h3>
        </div>

        <div className="divide-y">
          {upcomingEvents.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No upcoming events scheduled.
            </div>
          ) : (
            upcomingEvents.map(event => (
              <div key={event.id} className={`p-6 ${getPriorityColor(event.priority)}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{event.title}</h4>
                    <div className="text-sm text-gray-600 mt-1">
                      {new Date(event.date).toLocaleDateString()} • 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className="ml-2 text-gray-500">For: {event.audience}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>

                {event.description && (
                  <p className="text-gray-700 mb-3">{event.description}</p>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Added by {event.createdByName}</span>
                  <span>Priority: {event.priority}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Past Events ({pastEvents.length})</h3>
          </div>

          <div className="divide-y">
            {pastEvents.slice(0, 5).map(event => (
              <div key={event.id} className="p-6 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-700">{event.title}</h4>
                    <div className="text-sm text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString()} • 
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
