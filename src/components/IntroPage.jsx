import React, { useEffect, useState } from "react";
import { Howl } from "howler"; // Optional: for sound effects
import { useNavigate } from "react-router-dom"; // useNavigate instead of useHistory
import "../styles/IntroPage.css";

const IntroPage = () => {
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const navigate = useNavigate(); // useNavigate instead of useHistory

  // Optional: Play Intro Sound using Howler.js
  const introSound = new Howl({
    src: ["https://www.soundjay.com/button/beep-07.wav"], // Replace with your intro sound URL
    volume: 0.5,
  });

  // Play sound and initiate the transition
  useEffect(() => {
    introSound.play(); // Play sound on page load
    setTimeout(() => {
      setIsIntroComplete(true); // After intro completes, show main content
      setTimeout(() => {
        navigate("/welcome"); // Redirect to the Welcome page after intro
      }, 2000); // Wait 2 seconds before navigating
    }, 5000); // Wait 5 seconds for intro animation and sound
  }, [navigate]);

  return (
    <div className="intro-container">
      <div className="intro-text">
        <h1 className="animated-text">Welcome to December!</h1>
        <p className="animated-text">
          The season of warmth, joy, and togetherness.
        </p>
        <p className="animated-text">
          Get ready for a heartwarming experience.
        </p>
      </div>

      {isIntroComplete && (
        <div className="intro-complete-message">
          <p>Enjoy your journey to the holiday season!</p>
        </div>
      )}
    </div>
  );
};

export default IntroPage;
