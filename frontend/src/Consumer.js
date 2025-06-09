import React, { useState, useRef, useEffect } from 'react';
import './Consumer.css';
import CropScoreDashboard from './components/CropScoreDashboard';
import DashboardCards from "./components/DashboardCards";
import DataLLM from "./components/DataLLM"
import ConsumerQR from "./components/ConsumerQR"

function Consumer() {

  const [searchInput, setSearchInput] = useState('');
  const [searchCrop, setSearchCrop] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    // You can add validation here if you want

    if (searchInput.trim() === '') {
      setSearchCrop(null); // clear search if input empty
      return;
    }

    // Set the searched crop name (can be lowercase/uppercase handled here)
    setSearchCrop(searchInput.trim().toUpperCase());
  };



  {/* Top here is the added one */}
  const [activeCard, setActiveCard] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm AgriBot 🌱 How can I help you learn more about your organic potatoes?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const [score, setScore] = useState({})
  const [metrics, setMetrics] = useState({})

    // 1️⃣ Load and POST data only once on mount
  useEffect(() => {
    fetch('/metrics.json')
      .then(res => res.json())
      .then(data => {
        setMetrics(data)
        console.log("datais", data)
        fetch('http://127.0.0.1:8000/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
          .then(res => res.json())
          .then(result => {
            console.log("Backend response:", result);
            setScore(result);
          })
          .catch(err => console.error('Error posting to FastAPI:', err));
      });
  }, []); // Only run once on component mount

  const toggleCard = (card) => {
    setActiveCard(activeCard === card ? null : card);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
  e.preventDefault();

  const newMessage = {
    id: Date.now(),
    sender: 'user',
    text: inputMessage,
    timestamp: new Date()
  };

  console.log(metrics)

  setMessages((prevMessages) => [...prevMessages, newMessage]);
  setInputMessage(''); // Clear input

  try {
    const res = await fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          Data: { preharvest:metrics.preharvest, storage:metrics.storage},
          user_question: newMessage.text
        })
    });
    console.log(JSON.stringify({}))

    const data = await res.json();
    console.log("here is the data", data)

    const botReply = {
      id: Date.now() + 1,
      sender: 'bot',
      text: data.response || 'Sorry, I didn’t understand that.',
      timestamp: new Date()
    };

    setMessages((prevMessages) => [...prevMessages, botReply]);
  } catch (err) {
    const errorReply = {
      id: Date.now() + 1,
      sender: 'bot',
      text: '⚠ There was an error contacting the server.',
      timestamp: new Date()
    };
    setMessages((prevMessages) => [...prevMessages, errorReply]);
    console.error('Chatbot error:', err);
  }
};


  return (
    <div className="consumer-container">
      <h1>Organic Potatoes</h1>
      <img src="/assets/potato.webp" alt="Photo of Organic Potato" className="consumer-image" />

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search Batch"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>


      {searchCrop && (
        <div style={{ marginTop: "2rem" }}>
          <CropScoreDashboard batchId={searchCrop} />
        </div>
      )}

      {searchCrop && (
        <div className="cards-container">
          <DashboardCards
            batchId={searchCrop}
            activeCard={activeCard}
            toggleCard={toggleCard}
          />
        </div>
      )}

      {searchCrop && (
          <DataLLM
            batchId={searchCrop}
          />
      )}

      {searchCrop && (
          <ConsumerQR
            batchId={searchCrop}
          />
      )}

      

      {/* Chat Button */}
      <button
        className={`chat-button ${isChatOpen ? 'chat-open' : ''}`}
        onClick={toggleChat}
        aria-label="Toggle chat"
      >
        {isChatOpen ? '✕' : '💬'}
      </button>

      {/* Chatbot Panel */}
      <div className={`chatbot-panel ${isChatOpen ? 'open' : ''}`}>
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="bot-avatar">🤖</div>
            <div>
              <h3>AgriBot</h3>
              <span className="status">Online</span>
            </div>
          </div>
          <button className="close-chat" onClick={toggleChat}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                <p>{message.text}</p>
                <span className="timestamp">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about your potatoes..."
            className="chat-input"
          />
          <button type="submit" className="send-button" disabled={!inputMessage.trim()}>
            <span>➤</span>
          </button>
        </form>
      </div>

      {/* Overlay */}
      {isChatOpen && <div className="chat-overlay" onClick={toggleChat} />}
    </div>
  );
}

export default Consumer;