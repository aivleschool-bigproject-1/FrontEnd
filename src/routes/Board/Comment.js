import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Comment.css';

const CommentSection = ({ boardId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/comments/${boardId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = async () => {
    if (commentText.trim()) {
      try {
        await axios.post(`/comments/${boardId}`, { text: commentText });
        setCommentText('');
        fetchComments(); 
      } catch (error) {
        console.error('Failed to add comment:', error);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`/comments/${boardId}/${commentId}`);
      fetchComments(); 
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h3>댓글</h3>
      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              {comment.text}
              <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
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
