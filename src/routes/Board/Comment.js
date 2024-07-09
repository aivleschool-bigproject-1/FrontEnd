import React, { useState } from 'react';
import './Comment.css';

const CommentSection = () => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  const handleInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      setComments([...comments, commentText]);
      setCommentText('');
    }
  };
  const handleDeleteComment = (index) => {
    const newComments = comments.filter((_, i) => i !== index);
    setComments(newComments);
  };

  return (
    <div className="comment-section">
      <h3>댓글</h3>
      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className="comment-item">
              {comment}
              <button onClick={() => handleDeleteComment(index)}>삭제</button>
            </div>
          ))
        ) : (
          <div className="no-comments-message">아직 댓글이 없습니다.</div>
        )}
      </div>
      <div className="comment-input-container">
        <textarea
          value={commentText}
          onChange={handleInputChange}
          placeholder="댓글을 입력하세요"
          rows="4"
        ></textarea>
        <button onClick={handleAddComment}>추가</button>
      </div>
    </div>
  );
};

export default CommentSection;
