import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function PrincipalMessages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = () => {
    const savedMessages = JSON.parse(localStorage.getItem('parentMessages')) || [];
    setMessages(savedMessages);
  };

  const markAsRead = (messageId) => {
    const updatedMessages = messages.map(msg =>
      msg.id === messageId ? { ...msg, read: true } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('parentMessages', JSON.stringify(updatedMessages));
  };

  const updateStatus = (messageId, status) => {
    const updatedMessages = messages.map(msg =>
      msg.id === messageId ? { ...msg, status, read: true } : msg
    );
    setMessages(updatedMessages);
    localStorage.setItem('parentMessages', JSON.stringify(updatedMessages));
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !msg.read;
    if (filter === 'pending') return msg.status === 'pending';
    return msg.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'complaint': return 'bg-red-100 text-red-800';
      case 'suggestion': return 'bg-purple-100 text-purple-800';
      case 'inquiry': return 'bg-blue-100 text-blue-800';
      case 'appreciation': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Parent Messages</h2>
            <p className="text-gray-600">Messages and complaints from students/parents</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Total Messages</div>
            <div className="text-2xl font-bold text-blue-600">{messages.length}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {['all', 'unread', 'pending', 'reviewed', 'resolved'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded text-sm font-medium ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {filteredMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No messages found.
            </div>
          ) : (
            filteredMessages.map(message => (
              <div key={message.id} className={`border rounded-lg p-4 ${!message.read ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{message.studentName}</h3>
                    <p className="text-sm text-gray-600">
                      Class: {message.studentClass} • {new Date(message.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getTypeColor(message.type)}`}>
                      {message.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusColor(message.status)}`}>
                      {message.status}
                    </span>
                    {!message.read && (
                      <span className="px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                        New
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{message.message}</p>

                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    {!message.read && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Mark as Read
                      </button>
                    )}
                    {message.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(message.id, 'reviewed')}
                          className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                        >
                          Under Review
                        </button>
                        <button
                          onClick={() => updateStatus(message.id, 'resolved')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Resolved
                        </button>
                      </>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(message.date).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {messages.filter(m => !m.read).length}
          </div>
          <div className="text-sm text-gray-600">Unread</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {messages.filter(m => m.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {messages.filter(m => m.status === 'resolved').length}
          </div>
          <div className="text-sm text-gray-600">Resolved</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {messages.filter(m => m.type === 'complaint').length}
          </div>
          <div className="text-sm text-gray-600">Complaints</div>
        </div>
      </div>
    </div>
  );
}
