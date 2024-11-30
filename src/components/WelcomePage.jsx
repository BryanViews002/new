import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import "../styles/WelcomePage.css";

// Add sound effects for sending messages
import { Howl } from "howler";

const WelcomePage = () => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [status, setStatus] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [thankYouVisible, setThankYouVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // Typing indicator
  const maxLength = 250;

  const [backgroundColor, setBackgroundColor] = useState(
    "linear-gradient(to bottom, #1e3c72, #2a5298)" // Background gradient state
  );

  // Sound effect for message sent
  const sendMessageSound = new Howl({
    src: ["https://www.soundjay.com/button/beep-07.wav"], // Example sound
    volume: 3,
  });

  useEffect(() => {
    const timeout = setTimeout(() => setIsTyping(false), 2000); // Stop typing after 2 seconds
    return () => clearTimeout(timeout); // Clean up timeout
  }, [currentMessage]);

  const snowflakes = Array.from({ length: 50 }, (_, index) => (
    <div
      key={index}
      className="snowflake"
      style={{
        left: `${Math.random() * 100}vw`, // Random horizontal position
        animationDelay: `${Math.random() * 10}s`, // Randomize animation start
        fontSize: `${Math.random() * 1.5 + 0.5}rem`, // Randomize size
      }}
    >
      ❄
    </div>
  ));

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (currentMessage.trim() === "" || !email || !name) {
      setStatus("Please provide a name, email, and a message.");
      return;
    }

    setIsLoading(true); // Show loading state
    setStatus("Sending...");
    sendMessageSound.play(); // Play sound effect on send

    const formData = new FormData();
    formData.append("message", currentMessage);
    formData.append("email", email);
    formData.append("name", name);

    try {
      const response = await fetch("https://formspree.io/f/xwpkwwdn", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        setStatus("Message sent successfully!"); // Success message
        setCurrentMessage(""); // Clear message input
        setEmail(""); // Clear email input
        setName(""); // Clear name input
        setShowModal(true); // Show confirmation modal
        setThankYouVisible(true); // Show thank you message
        setConfettiVisible(true); // Trigger confetti animation
        setTimeout(() => {
          setThankYouVisible(false);
          setShowModal(false); // Hide after 5 seconds
          setConfettiVisible(false); // Hide confetti
        }, 5000);
      } else {
        setStatus("Failed to send message. Please try again.");
      }
    } catch (error) {
      setStatus("An error occurred while sending the message.");
      console.error(error);
    } finally {
      setIsLoading(false); // Hide loading state
    }
  };

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
    setIsTyping(true); // Set typing state when user is typing
  };

  const changeBackgroundColor = () => {
    // Dynamically change background color on form submission
    setBackgroundColor("linear-gradient(to bottom, #4e9af1, #5f72bd)");
  };

  return (
    <div className="welcome-container" style={{ background: backgroundColor }}>
      {snowflakes}
      <div className="welcome-header">
        <h1>Welcome to December!</h1>
        <p>Spread warmth and joy this season.</p>
      </div>

      {/* Confetti Effect */}
      {confettiVisible && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      {/* Typing Indicator */}
      {isTyping && <div className="typing-indicator">User is typing...</div>}

      <form className="message-box" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input-field"
        />
        <input
          type="email"
          placeholder="Your Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Type your message here..."
          value={currentMessage}
          maxLength={maxLength}
          onChange={handleInputChange}
          className="animated-textarea"
        />
        <p className="character-counter">
          {currentMessage.length}/{maxLength} characters
        </p>
        <button type="submit" className="animated-button" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </button>
        {status && (
          <p
            className={`status-message ${
              status.includes("successfully") ? "success" : "error"
            }`}
          >
            {status}
          </p>
        )}
      </form>

      {thankYouVisible && (
        <div className="thank-you-message">
          <p>Thank you for your message!</p>
        </div>
      )}

      {showModal && (
        <div className="confirmation-modal">
          <p>Your message has been successfully sent!</p>
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
