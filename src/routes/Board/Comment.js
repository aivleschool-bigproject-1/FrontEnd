import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './Comment.css';
import {FaPaperPlane, FaTimes} from 'react-icons/fa';
import {Card, Space} from "antd";
import moment from "moment";
import 'moment-timezone';

const Comments = ({postId}) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState({content: ''});
    const token = localStorage.getItem('Authorization');
    const username = localStorage.getItem('Username');

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/comments/${postId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewComment(prevState => ({...prevState, [name]: value}));
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
                    Authorization: `${token}`,
                },
            });
            fetchComments();
            setNewComment({content: ''});
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await axios.delete(`http://localhost:8080/comment/${commentId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            fetchComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

  return (
    <div className="comments-container">
        {token && (
            <form onSubmit={handleCreateComment} className="create-comment-form">
                <div className="textarea-wrapper">
                    <textarea
                        className='textarea-inner'
                        name="content"
                        placeholder="자유롭게 의견을 작성해주세요"
                        value={newComment.content}
                        onChange={handleInputChange}
                        required
                    />
                    <button type="submit" className="submit-comment">
                        <FaPaperPlane/>
                    </button>
                </div>
            </form>
        )}
            {comments.length > 0 ? (
                <ul className="comments-list">
                    {comments.map(comment => (
                        <li key={comment.id} className="comment-item">
                            <Card>
                                <Space direction={'horizontal'}>
                                    <p>{moment.tz(comment.createdAt, "Asia/Seoul").format('YYYY-MM-DD HH:mm:ss')}</p>
                                    <p>{comment.writerId}</p>
                                </Space>
                                <p className="comment-content">{comment.content}</p>
                            </Card>
                            {comment.writerId === username && (
                                <span className="delete-icon" onClick={() => handleDeleteComment(comment.id)}>
                  <FaTimes/>
                </span>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-comments-message">댓글이 없습니다</p>
            )}
        </div>
    );
};

export default Comments;
