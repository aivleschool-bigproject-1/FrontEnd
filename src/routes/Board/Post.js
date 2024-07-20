import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Post.css';
import Comments from './Comment';  // 댓글 컴포넌트 추가

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);

  const token = localStorage.getItem('Authorization');
  const username = localStorage.getItem('Username');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/posts?pageNumber=${currentPage}&pageSize=10
`, {
        headers: {
          'Authorization': `${token}`,
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
          'Authorization': `${token}`,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prevState => ({ ...prevState, [name]: value }));
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
          'Authorization': `${token}`,
        },
      });
      fetchPosts();
      setShowCreateForm(false);
      setNewPost({ title: '', content: '' });
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8080/post/${postId}`, {
        headers: {
          'Authorization': `${token}`,
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
    setNewPost({ title: post.title, content: post.content });
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
          'Authorization': `${token}`,
        },
      });
      fetchPosts();
      setIsEditing(false);
      setSelectedPost(null);
      setNewPost({ title: '', content: '' });
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <div className="posts-container">
      <button onClick={() => navigate('/create-post')}>
        Create Post
      </button>
      {selectedPost && isEditing ? (
        <form onSubmit={handleUpdatePost} className="edit-post-form">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newPost.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            value={newPost.content}
            onChange={handleInputChange}
            required
          />
          <button type="submit">Update</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          {selectedPost ? (
            <div className="post-details">
              <h2>{selectedPost.title}</h2>
              <p>{selectedPost.content}</p>
              {selectedPost.writerId === username && (
                <>
                  <button onClick={() => handleEditPost(selectedPost)}>Update</button>
                  <button onClick={() => handleDeletePost(selectedPost.id)}>Delete</button>
                </>
              )}
              <button onClick={() => setSelectedPost(null)}>Back to list</button>
              <Comments postId={selectedPost.id} /> 
            </div>
          ) : (
            <>
              {posts.length > 0 ? (
                <ul className="posts-list">
                  {posts.map(post => (
                    <li key={post.id} className="post-item" onClick={() => fetchPostDetails(post.id)}>
                      <h2 className="post-title">{post.title}</h2>
                      <p className="post-content">{post.content}</p>
                      {post.writerId === username && (
                        <>
                          <button onClick={(e) => { e.stopPropagation(); handleEditPost(post); }}>Update</button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}>Delete</button>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-posts-message">No posts available</p>
              )}
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
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
