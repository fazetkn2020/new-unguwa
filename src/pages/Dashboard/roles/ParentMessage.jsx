import React, { useState } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function ParentMessage() {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('complaint');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert('Please enter your message');
      return;
    }

    setIsSubmitting(true);

    // Create message object
    const parentMessage = {
      id: Date.now().toString(),
      studentId: user.id,
      studentName: user.name,
      studentClass: user.assignedClasses?.[0] || 'Unknown',
      message: message.trim(),
      type: messageType,
      date: new Date().toISOString(),
      status: 'pending',
      read: false
    };

    // Save to localStorage
    const existingMessages = JSON.parse(localStorage.getItem('parentMessages')) || [];
    const updatedMessages = [parentMessage, ...existingMessages];
    localStorage.setItem('parentMessages', JSON.stringify(updatedMessages));

    setIsSubmitting(false);
    setMessage('');
    alert('Your message has been sent to the Principal successfully!');
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Parent Message/Complaint</h2>
      <p className="text-gray-600 mb-6">
        Send a message or complaint directly to the Principal. This will be reviewed and addressed promptly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message Type
          </label>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="complaint">Complaint</option>
            <option value="suggestion">Suggestion</option>
            <option value="inquiry">Inquiry</option>
            <option value="appreciation">Appreciation</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="6"
            placeholder="Type your message, complaint, or suggestion here..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">Message Guidelines:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be clear and specific about your concern</li>
            <li>• Include relevant details (dates, names if applicable)</li>
            <li>• Maintain respectful language</li>
            <li>• Principal will respond within 24-48 hours</li>
          </ul>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !message.trim()}
          className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
        >
          {isSubmitting ? 'Sending...' : 'Send Message to Principal'}
        </button>
      </form>
    </div>
  );
}
