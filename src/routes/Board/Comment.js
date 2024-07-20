import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Comment.css';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: '' });
  const token = localStorage.getItem('Authorization');
  const username = localStorage.getItem('Username');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/comments/${postId}`, {
        headers: {
          'Authorization': `${token}`,
        },
      });
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewComment(prevState => ({ ...prevState, [name]: value }));
  };

  const handleCreateComment = async (e) => {
    e.preventDefault();
    try {
      const commentData = {
        content: newComment.content,
        postId: postId,
      };

      await axios.post('http://localhost:8080/comment', commentData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
      });
      fetchComments();
      setNewComment({ content: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:8080/comment/${commentId}`, {
        headers: {
          'Authorization': `${token}`,
        },
      });
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comments-container">
      <form onSubmit={handleCreateComment} className="create-comment-form">
        <textarea
          name="content"
          placeholder="Write a comment..."
          value={newComment.content}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {comments.length > 0 ? (
        <ul className="comments-list">
          {comments.map(comment => (
            <li key={comment.id} className="comment-item">
              <p className="comment-content">{comment.content}</p>
              {comment.writerId === username && (
                <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-comments-message">No comments available</p>
      )}
    </div>
  );
};

export default Comments;
