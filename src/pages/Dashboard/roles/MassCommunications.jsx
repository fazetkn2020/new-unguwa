// src/pages/Dashboard/roles/MassCommunications.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function MassCommunications() {
  const { user } = useAuth();
  const [message, setMessage] = useState({
    title: '',
    content: '',
    audience: 'all', // all, students, parents, staff, specific_class
    priority: 'normal', // low, normal, high, urgent
    type: 'announcement', // announcement, reminder, emergency, update
    specificClass: ''
  });
  const [sentMessages, setSentMessages] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    loadSentMessages();
    loadClasses();
  }, []);

  const loadSentMessages = () => {
    const messages = JSON.parse(localStorage.getItem('massCommunications')) || [];
    setSentMessages(messages);
  };

  const loadClasses = () => {
    const classLists = JSON.parse(localStorage.getItem('classLists')) || {};
    setClasses(Object.keys(classLists));
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    setIsSending(true);

    if (!message.title.trim() || !message.content.trim()) {
      alert('Please fill in both title and content');
      setIsSending(false);
      return;
    }

    const messageData = {
      id: `msg-${Date.now()}`,
      ...message,
      sentBy: user.id,
      sentByName: user.name,
      sentAt: new Date().toISOString(),
      status: 'sent',
      readCount: 0,
      totalRecipients: calculateRecipients(message.audience, message.specificClass)
    };

    try {
      // Save to sent messages
      const updatedMessages = [messageData, ...sentMessages];
      setSentMessages(updatedMessages);
      localStorage.setItem('massCommunications', JSON.stringify(updatedMessages));

      // Send notifications to relevant users (simulated)
      await simulateMessageDelivery(messageData);

      // Reset form
      setMessage({
        title: '',
        content: '',
        audience: 'all',
        priority: 'normal',
        type: 'announcement',
        specificClass: ''
      });

      alert('✅ Message sent successfully!');
    } catch (error) {
      alert('Error sending message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const simulateMessageDelivery = async (messageData) => {
    // Simulate API call delay
    return new Promise(resolve => setTimeout(resolve, 1000));
  };

  const calculateRecipients = (audience, specificClass) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    switch (audience) {
      case 'all':
        return users.length;
      case 'students':
        return users.filter(u => u.role === 'Student').length;
      case 'parents':
        // Assuming parents are linked to students
        return users.filter(u => u.role === 'Student').length;
      case 'staff':
        return users.filter(u => 
          ['Subject Teacher', 'Form Master', 'Senior Master', 'Exam Officer', 'VP Academic', 'VP Admin', 'Principal'].includes(u.role)
        ).length;
      case 'specific_class':
        return users.filter(u => 
          u.role === 'Student' && u.assignedClasses?.includes(specificClass)
        ).length;
      default:
        return 0;
    }
  };

  const deleteMessage = (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    const updatedMessages = sentMessages.filter(msg => msg.id !== messageId);
    setSentMessages(updatedMessages);
    localStorage.setItem('massCommunications', JSON.stringify(updatedMessages));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'announcement': return '📢';
      case 'reminder': return '⏰';
      case 'emergency': return '🚨';
      case 'update': return '🔄';
      default: return '💬';
    }
  };

  const getAudienceText = (audience, specificClass) => {
    switch (audience) {
      case 'all': return 'All School';
      case 'students': return 'All Students';
      case 'parents': return 'All Parents';
      case 'staff': return 'All Staff';
      case 'specific_class': return `Class ${specificClass}`;
      default: return audience;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Mass Communications</h2>
        <p className="text-gray-600">Send announcements and messages to students, parents, and staff</p>
      </div>

      {/* Compose Message */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Compose New Message</h3>
        
        <form onSubmit={sendMessage} className="space-y-4">
          {/* Message Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Message Title *</label>
            <input
              type="text"
              value={message.title}
              onChange={(e) => setMessage({...message, title: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter message title..."
              required
            />
          </div>

          {/* Message Content */}
          <div>
            <label className="block text-sm font-medium mb-1">Message Content *</label>
            <textarea
              value={message.content}
              onChange={(e) => setMessage({...message, content: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
              placeholder="Type your message here..."
              required
            />
          </div>

          {/* Message Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Audience */}
            <div>
              <label className="block text-sm font-medium mb-1">Audience</label>
              <select
                value={message.audience}
                onChange={(e) => setMessage({...message, audience: e.target.value, specificClass: ''})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="all">All School</option>
                <option value="students">Students Only</option>
                <option value="parents">Parents Only</option>
                <option value="staff">Staff Only</option>
                <option value="specific_class">Specific Class</option>
              </select>
            </div>

            {/* Specific Class (if audience is specific_class) */}
            {message.audience === 'specific_class' && (
              <div>
                <label className="block text-sm font-medium mb-1">Select Class</label>
                <select
                  value={message.specificClass}
                  onChange={(e) => setMessage({...message, specificClass: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="">Choose a class...</option>
                  {classes.map(className => (
                    <option key={className} value={className}>{className}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Message Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Message Type</label>
              <select
                value={message.type}
                onChange={(e) => setMessage({...message, type: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="announcement">Announcement</option>
                <option value="reminder">Reminder</option>
                <option value="emergency">Emergency</option>
                <option value="update">Update</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={message.priority}
                onChange={(e) => setMessage({...message, priority: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Recipient Count Preview */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-700">
                This message will be sent to approximately{' '}
                <strong>{calculateRecipients(message.audience, message.specificClass)}</strong> recipients
              </span>
              <span className="text-blue-600 font-medium">
                {getAudienceText(message.audience, message.specificClass)}
              </span>
            </div>
          </div>

          {/* Send Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSending}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
            >
              {isSending ? '📤 Sending...' : '📤 Send Message'}
            </button>
          </div>
        </form>
      </div>

      {/* Sent Messages */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Sent Messages ({sentMessages.length})</h3>
            <div className="text-sm text-gray-600">
              Last 30 days
            </div>
          </div>
        </div>

        <div className="divide-y">
          {sentMessages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No messages sent yet. Your sent messages will appear here.
            </div>
          ) : (
            sentMessages.map(msg => (
              <div key={msg.id} className="p-6 border-l-4 border-blue-400">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3">
                      <span className="text-xl">{getTypeIcon(msg.type)}</span>
                      <div>
                        <h4 className="font-semibold text-lg">{msg.title}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>To: {getAudienceText(msg.audience, msg.specificClass)}</span>
                          <span>•</span>
                          <span>{new Date(msg.sentAt).toLocaleString()}</span>
                          <span>•</span>
                          <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(msg.priority)}`}>
                            {msg.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="text-red-600 hover:text-red-800 ml-4"
                    title="Delete message"
                  >
                    🗑️
                  </button>
                </div>

                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{msg.content}</p>

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex space-x-4">
                    <span>Sent by: {msg.sentByName}</span>
                    <span>•</span>
                    <span>Recipients: {msg.totalRecipients}</span>
                    <span>•</span>
                    <span>Read: {msg.readCount || 0}</span>
                  </div>
                  <span className="text-green-600 font-medium">✓ Delivered</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Send Templates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Send Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setMessage({
              ...message,
              title: 'School Assembly Reminder',
              content: 'Dear students and staff,\n\nThis is a reminder about the school assembly tomorrow. Please ensure you arrive on time and are in proper school uniform.\n\nThank you.',
              type: 'reminder',
              priority: 'normal'
            })}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="text-lg mb-2">⏰</div>
            <div className="font-medium">Assembly Reminder</div>
            <div className="text-sm text-gray-600">Quick reminder template</div>
          </button>

          <button
            onClick={() => setMessage({
              ...message,
              title: 'Parent-Teacher Meeting',
              content: 'Dear Parents,\n\nWe invite you to the upcoming Parent-Teacher Meeting scheduled for [Date]. Your participation is important for your child\'s academic progress.\n\nBest regards,\nSchool Administration',
              type: 'announcement',
              priority: 'high'
            })}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="text-lg mb-2">👥</div>
            <div className="font-medium">PTM Announcement</div>
            <div className="text-sm text-gray-600">Parent meeting template</div>
          </button>

          <button
            onClick={() => setMessage({
              ...message,
              title: 'Urgent Weather Update',
              content: 'URGENT: Due to severe weather conditions, school will be closed tomorrow. All students and staff should remain at home. Stay safe.\n\nFurther updates will be communicated.',
              type: 'emergency',
              priority: 'urgent'
            })}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="text-lg mb-2">🚨</div>
            <div className="font-medium">Emergency Alert</div>
            <div className="text-sm text-gray-600">Urgent situation template</div>
          </button>

          <button
            onClick={() => setMessage({
              ...message,
              title: 'Exam Schedule Update',
              content: 'Dear Students and Parents,\n\nPlease note that there has been an update to the exam schedule. The revised timetable is attached. Make sure to review the changes carefully.\n\nSchool Administration',
              type: 'update',
              priority: 'high'
            })}
            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div className="text-lg mb-2">📚</div>
            <div className="font-medium">Exam Update</div>
            <div className="text-sm text-gray-600">Academic update template</div>
          </button>
        </div>
      </div>
    </div>
  );
}
