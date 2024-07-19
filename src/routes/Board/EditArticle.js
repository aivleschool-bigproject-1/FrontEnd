import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditArticle.css';

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState({
    title: '',
    content: '',
    username: localStorage.getItem('Username'),
  });

  useEffect(() => {
    fetchArticle();
  }, []);

  const fetchArticle = async () => {
    try {
      const response = await axios.get(`/api/articles/${id}`);
      setArticle(response.data);
    } catch (error) {
      console.error('Error fetching article:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArticle({ ...article, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/api/articles/${id}`, {
        title: article.title,
        content: article.content,
        username: article.username,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('Authorization'),
        },
      });
      navigate('/boards');
    } catch (error) {
      console.error('Error updating article:', error);
    }
  };

  return (
    <div className="edit-article">
      <h1>게시글 수정</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={article.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="content"
          value={article.content}
          onChange={handleChange}
          placeholder="Content"
          required
        />
        <button type="submit">수정 완료</button>
      </form>
    </div>
  );
};

export default EditArticle;
