import React, { useState } from 'react';
import './FeedbackPopup.css'; // Make sure to import the CSS

const FeedbackPopup = ({ isOpen, onClose, onSubmit }) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(feedback);
    setFeedback('');
    onClose();
  };

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <h2>Your Feedback</h2>
        <textarea
          className="feedback-textarea"
          placeholder="Enter your feedback..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="popup-buttons">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="submit-btn" disabled={!feedback.trim()} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPopup;
