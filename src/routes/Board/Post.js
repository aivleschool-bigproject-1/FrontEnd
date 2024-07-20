import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Post.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '' });

  const username = localStorage.getItem('Username'); // Username을 userId로 사용
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/posts?page=${currentPage}&listSizePerPage=10`, {
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
        ...newPost,
        writerId: `${username}`,
      };

      const response = await axios.post('http://localhost:8080/post', postData, {
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

  return (
    <div className="posts-container">
      <h1 className="posts-title">Posts</h1>
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : 'Create Post'}
      </button>
      {showCreateForm && (
        <form onSubmit={handleCreatePost} className="create-post-form">
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
          <button type="submit">Submit</button>
        </form>
      )}
      {selectedPost ? (
        <div className="post-details">
          <h2>{selectedPost.title}</h2>
          <p>{selectedPost.content}</p>
          <button onClick={() => setSelectedPost(null)}>Back to Posts</button>
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            <ul className="posts-list">
              {posts.map(post => (
                <li key={post.id} className="post-item" onClick={() => fetchPostDetails(post.id)}>
                  <h2 className="post-title">{post.title}</h2>
                  <p className="post-content">{post.content}</p>
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
    </div>
  );
};

export default Posts;
