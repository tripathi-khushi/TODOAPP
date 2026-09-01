import React, { useState } from 'react';
import { Send, CheckCheck, User, Phone, Video, MoreVertical } from 'lucide-react';

export const MessagesView = ({ initialTeacher = 'Olivia Miller' }) => {
  const [activeTeacherId, setActiveTeacherId] = useState(1);
  const [messageInput, setMessageInput] = useState('');

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: 'Olivia Miller',
      role: 'Mentor & AI Specialist',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
      online: true,
      messages: [
        { id: 1, sender: 'them', text: 'Hi Sophia! Have you had a chance to review the loss function equations for linear regression?', time: '10:15 AM' },
        { id: 2, sender: 'me', text: 'Hello Ms. Miller! Yes, I just finished the Jupyter notebook and calculated the mean squared error.', time: '10:20 AM' },
        { id: 3, sender: 'them', text: 'Excellent work! Your submission scored 100/100. Let us discuss neural backpropagation next Wednesday.', time: '10:22 AM' },
      ],
    },
    {
      id: 2,
      name: 'Liam Garcia',
      role: 'Electronics Teacher',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      online: true,
      messages: [
        { id: 1, sender: 'them', text: 'Sophia, remember to bring your multimeter to the lab session tomorrow at 16:00.', time: 'Yesterday' },
        { id: 2, sender: 'me', text: 'Got it, Mr. Garcia! I also finished assembling the op-amp comparator circuit.', time: 'Yesterday' },
      ],
    },
    {
      id: 3,
      name: 'Jackson Lopez',
      role: 'Robotics Lecturer',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      online: false,
      messages: [
        { id: 1, sender: 'them', text: 'The Robot Fest 2026 showcase arena booth has been approved. Your autonomous rover will be the centerpiece demo!', time: 'May 15' },
        { id: 2, sender: 'me', text: 'That is awesome! We are finalizing the ultrasonic obstacle sensors tonight.', time: 'May 15' },
      ],
    },
  ]);

  const activeContact = conversations.find((c) => c.id === activeTeacherId) || conversations[0];

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeTeacherId
          ? { ...c, messages: [...c.messages, newMsg] }
          : c
      )
    );

    setMessageInput('');
  };

  return (
    <div className="section-view-container">
      <div className="section-view-header">
        <div>
          <h2 className="section-main-heading">Teacher & Mentor Messages</h2>
          <p className="section-sub-heading">Direct communication channels with faculty advisors</p>
        </div>
      </div>

      <div className="messages-layout-box">
        {/* Left Contacts Pane */}
        <div className="messages-contacts-pane">
          <div className="contacts-header">
            <h4>Conversations</h4>
            <span className="badge badge-category">{conversations.length} Active</span>
          </div>

          <div className="contacts-list">
            {conversations.map((contact) => (
              <div
                key={contact.id}
                className={`contact-item ${contact.id === activeTeacherId ? 'active' : ''}`}
                onClick={() => setActiveTeacherId(contact.id)}
              >
                <div className="contact-avatar-wrap">
                  <img src={contact.avatar} alt={contact.name} className="contact-avatar" />
                  {contact.online && <span className="online-dot" />}
                </div>

                <div className="contact-info">
                  <div className="contact-name-row">
                    <h5 className="contact-name">{contact.name}</h5>
                  </div>
                  <p className="contact-role">{contact.role}</p>
                  <p className="contact-last-msg">
                    {contact.messages[contact.messages.length - 1]?.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Chat Thread Pane */}
        <div className="messages-chat-pane">
          {/* Chat Header */}
          <div className="chat-top-header">
            <div className="chat-contact-profile">
              <img src={activeContact.avatar} alt={activeContact.name} className="chat-header-avatar" />
              <div>
                <h4 className="chat-contact-name">{activeContact.name}</h4>
                <span className="chat-contact-status">
                  {activeContact.online ? '● Online & Available' : 'Offline • Last seen recently'}
                </span>
              </div>
            </div>

            <div className="chat-header-actions">
              <button className="btn-icon" title="Call"><Phone size={15} /></button>
              <button className="btn-icon" title="Video Meeting"><Video size={15} /></button>
              <button className="btn-icon"><MoreVertical size={15} /></button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="chat-messages-stream">
            {activeContact.messages.map((msg) => (
              <div key={msg.id} className={`chat-bubble-row ${msg.sender === 'me' ? 'outgoing' : 'incoming'}`}>
                <div className={`chat-bubble ${msg.sender === 'me' ? 'bubble-me' : 'bubble-them'}`}>
                  <p className="bubble-text">{msg.text}</p>
                  <span className="bubble-time">
                    {msg.time}
                    {msg.sender === 'me' && <CheckCheck size={12} className="read-receipt" />}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendMessage} className="chat-input-row">
            <input
              type="text"
              className="chat-text-input"
              placeholder={`Message ${activeContact.name}...`}
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button type="submit" className="btn-pill btn-primary chat-send-btn">
              <Send size={15} />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default MessagesView;
