import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './BoardDetail.css';
import CommentSection from './Comment';

const BoardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      console.log('Fetching article...');
      try {
        const response = await axios.get(`/api/articles/${id}`, {
          headers: {
            'Authorization': localStorage.getItem('Authorization'), // JWT 토큰을 헤더에 추가
            'Username': localStorage.getItem('Username'), // 사용자 이름을 헤더에 추가
          },
        });
        console.log('Article fetched:', response.data);
        setArticle(response.data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [id]);

  const deleteArticle = async () => {
    try {
      await axios.delete(`/api/articles/${id}`, {
        headers: {
          'Authorization': localStorage.getItem('Authorization'), // JWT 토큰을 헤더에 추가
          'Username': localStorage.getItem('Username'), // 사용자 이름을 헤더에 추가
        },
      });
      navigate('/boards');
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  const editArticle = () => {
    navigate(`/articles/${id}/edit`);
  };

  if (!article) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="article-detail">
        <h2>{article.title}</h2>
        <p className="article-author">작성자: {article.username}</p>
        <p className="article-content">{article.content}</p>
        <div className="button-container">
          <button onClick={editArticle}>수정</button>
          <button onClick={deleteArticle}>삭제</button>
        </div>
      </div>
      <CommentSection articleId={id} />
      <div className="back-button-container">
        <button onClick={() => navigate('/boards')}>목록으로 돌아가기</button>
      </div>
    </>
  );
};

export default BoardDetail;
