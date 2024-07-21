import React, { useState } from 'react';
import './Rating.css'; 

const StarRating = () => {
  const [rating, setRating] = useState(0);

  return (
    <div className="rating">
      {[5, 4, 3, 2, 1].map((star) => (
        <React.Fragment key={star}>
          <input
            type="radio"
            id={`star${star}`}
            name="rating"
            value={star}
            checked={rating === star}
            onChange={() => setRating(star)}
          />
          <label htmlFor={`star${star}`}>
            <svg viewBox="0 0 24 24">
              <polygon points="12,17.27 18.18,21 15.64,14.14 21,9.27 14.09,8.63 12,2 9.91,8.63 3,9.27 8.36,14.14 5.82,21" />
            </svg>
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default StarRating;
