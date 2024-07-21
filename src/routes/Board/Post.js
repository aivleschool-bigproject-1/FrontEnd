import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import parse, {domToReact} from 'html-react-parser';
import './Post.css';
import Comments from './Comment';
import Editor from './Editor';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedPost, setSelectedPost] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newPost, setNewPost] = useState({title: '', content: ''});
    const [isEditing, setIsEditing] = useState(false);

    const token = localStorage.getItem('Authorization');
    const username = localStorage.getItem('Username');
    const navigate = useNavigate();

    useEffect(() => {
        fetchPosts();
    }, [currentPage]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/posts?pageNumber=${currentPage}&pageSize=10`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            if (response.data && response.data.content) {
                setPosts(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                console.error('Invalid response structure:', response.data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    const fetchPostDetails = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:8080/post/${postId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            setSelectedPost(response.data);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleInputChange = (value) => {
        setNewPost((prevState) => ({...prevState, content: value}));
    };

    const handleTitleChange = (e) => {
        const {name, value} = e.target;
        setNewPost((prevState) => ({...prevState, [name]: value}));
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        try {
            const postData = {
                title: newPost.title,
                content: newPost.content,
            };

            await axios.post('http://localhost:8080/post', postData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            });
            fetchPosts();
            setShowCreateForm(false);
            setNewPost({title: '', content: ''});
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await axios.delete(`http://localhost:8080/post/${postId}`, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            fetchPosts();
            setSelectedPost(null);
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleEditPost = (post) => {
        setIsEditing(true);
        setSelectedPost(post);
        setNewPost({title: post.title, content: post.content});
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                title: newPost.title,
                content: newPost.content,
            };

            await axios.patch(`http://localhost:8080/post/${selectedPost.id}`, updateData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${token}`,
                },
            });
            fetchPosts();
            setIsEditing(false);
            setSelectedPost(null);
            setNewPost({title: '', content: ''});
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const removeImages = (html) => {
        return parse(html, {
            replace: (domNode) => {
                if (domNode.name === 'img') {
                    return null;
                }
                if (domNode.children) {
                    return domToReact(domNode.children);
                }
                return domNode;
            },
        });
    };

    return (
        <div className="posts-container">
            <button className="create-post-button" onClick={() => navigate('/create-post')}>
                글쓰기
            </button>
            {showCreateForm && (
                <form onSubmit={handleCreatePost} className="create-post-form">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={handleTitleChange}
                        required
                    />
                    <Editor value={newPost.content} onChange={handleInputChange}/>
                    <button type="submit" className="create-post-submit">Create</button>
                </form>
            )}
            {selectedPost && isEditing ? (
                <form onSubmit={handleUpdatePost} className="edit-post-form">
                    <input
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={handleTitleChange}
                        required
                    />
                    <Editor value={newPost.content} onChange={handleInputChange}/>
                    <div className="button-group">
                        <button className="post-edit-button" type="submit">
                            수정
                        </button>
                        <button className="post-cancel-button" onClick={() => setIsEditing(false)}>
                            취소
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    {selectedPost ? (
                        <div className="post-details-container">
                            <div className="post-details">
                                <h2>{selectedPost.title}</h2>
                                <div className="post-content">
                                    <ReactQuill value={selectedPost.content} readOnly={true} theme="bubble"/>
                                </div>

                                <Comments postId={selectedPost.id}/>
                                {selectedPost.writerId === username && (
                                    <div className="button-group">
                                        <button className="post-edit-button"
                                                onClick={() => handleEditPost(selectedPost)}>
                                            수정
                                        </button>
                                        <button className="post-delete-button"
                                                onClick={() => handleDeletePost(selectedPost.id)}>
                                            삭제
                                        </button>
                                    </div>
                                )}
                                <div className="post-back-button-container">
                                    <button className="post-back-button" onClick={() => setSelectedPost(null)}>
                                        목록으로 돌아가기
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {posts.length > 0 ? (
                                <ul className="posts-list">
                                    {posts.map((post) => (
                                        <li key={post.id} className="post-item"
                                            onClick={() => fetchPostDetails(post.id)}>
                                            <h2 className="post-title">{post.title}</h2>
                                            <div className="post-content">{removeImages(post.content)}</div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-posts-message">게시글이 없습니다</p>
                            )}
                            <div className="pagination">
                                {Array.from({length: totalPages}, (_, index) => (
                                    <button
                                        key={index}
                                        className={`page-button ${index === currentPage ? 'active' : ''}`}
                                        onClick={() => handlePageChange(index)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Posts;
