import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Comment.css';

const CommentSection = ({ articleId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const username = localStorage.getItem('Username'); // 사용자의 이름을 로컬 스토리지에서 가져옴
  const token = localStorage.getItem('Authorization'); // JWT 토큰을 로컬 스토리지에서 가져옴

  useEffect(() => {
    fetchComments();
  }, [articleId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/articles/${articleId}/comments`, {
        headers: {
          'Authorization': `${token}`, // JWT 토큰을 헤더에 추가
        },
      });
      setComments(response.data);
      setError(''); // Clear any previous error
    } catch (error) {
      setError(
        error.response && error.response.status === 404
          ? '댓글을 찾을 수 없습니다.'
          : '댓글을 가져오는 데 실패했습니다.'
      );
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleAddComment = async () => {
    if (commentText.trim()) {
      try {
        setLoading(true);
        await axios.post(
          `/api/articles/${articleId}/comments`,
          {
            body: commentText,
            username: username,
            articleId: articleId,
          },
          {
            headers: {
              'Authorization': `${token}`,
            },
          }
        );
        setCommentText('');
        fetchComments();
      } catch (error) {
        setError(
          error.response && error.response.status === 404
            ? '댓글을 추가할 수 없습니다.'
            : '댓글을 추가하는 데 실패했습니다.'
        );
        console.error('Failed to add comment:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setLoading(true);
      await axios.delete(`/api/comments/${commentId}`, {
        headers: {
          'Authorization': `${token}`, // JWT 토큰을 헤더에 추가
        },
      });
      fetchComments();
    } catch (error) {
      setError(
        error.response && error.response.status === 404
          ? '댓글을 삭제할 수 없습니다.'
          : '댓글을 삭제하는 데 실패했습니다.'
      );
      console.error('Failed to delete comment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comment-section">
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="comment-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment-item">
              {comment.body}
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
        <button onClick={handleAddComment} disabled={loading}>
          추가
        </button>
      </div>
    </div>
  );
};

export default CommentSection;
