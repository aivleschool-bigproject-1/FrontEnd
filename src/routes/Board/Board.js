import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NoticeForm from './NoticeForm';
import { gsap } from 'gsap';
import axios from 'axios';
import './Board.css';

const Board = () => {
  const [notices, setNotices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const token = localStorage.getItem('Authorization');
  const username = localStorage.getItem('Username');

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.get('/api/articles');
      setNotices(response.data);
      console.log('Fetched notices:', response.data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    }
  };

  const addNotice = async (newNotice) => {
    try {
      if (!token || !username) {
        console.error('로그인 필요');
        return;
      }

      console.log('Sending new notice:', newNotice);

      const response = await axios.post('/api/articles', newNotice, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // JWT 토큰을 헤더에 추가
          'username': username, // 사용자 이름을 헤더에 추가
        },
      });

      console.log('Notice added:', response.data);
      setNotices([response.data, ...notices]);
      setShowForm(false); // 폼을 숨김
      animateNotice(response.data.id);
    } catch (error) {
      console.error('Error adding notice:', error);
      console.error('Response data:', error.response?.data);
    }
  };

  const updateNotice = async (updatedNotice) => {
    try {
      if (!token || !username) {
        console.error('로그인 필요');
        return;
      }

      await axios.patch(`/api/articles/${updatedNotice.id}`, updatedNotice, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // JWT 토큰을 헤더에 추가
          'username': username, // 사용자 이름을 헤더에 추가
        },
      });
      setNotices(
        notices.map((notice) => (notice.id === updatedNotice.id ? updatedNotice : notice))
      );
    } catch (error) {
      console.error('Error updating notice:', error);
    }
  };

  const deleteNotice = async (noticeId) => {
    try {
      if (!token || !username) {
        console.error('로그인 필요');
        return;
      }

      await axios.delete(`/api/articles/${noticeId}`, {
        headers: {
          'Authorization': token, // JWT 토큰을 헤더에 추가
          'username': username, // 사용자 이름을 헤더에 추가
        },
      });
      removeNoticeWithAnimation(noticeId);
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const animateNotice = (noticeId) => {
    setTimeout(() => {
      const noticeElement = document.getElementById(`notice-${noticeId}`);
      gsap.from(noticeElement, { y: 50, opacity: 0, duration: 0.5, ease: 'power2.out' });
    }, 0);
  };

  const removeNoticeWithAnimation = (noticeId) => {
    const noticeElement = document.getElementById(`notice-${noticeId}`);
    gsap.to(noticeElement, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setNotices(notices.filter((notice) => notice.id !== noticeId));
      },
    });
  };

  return (
    <div className="board">
      <div className="board-container">
        <table>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>사용자</th>
            </tr>
          </thead>
          <tbody>
            {notices.length === 0 ? (
              <tr>
                <td colSpan="3" className="no-notices-message">문의 및 건의 사항을 등록해주세요</td>
              </tr>
            ) : (
              notices.map((notice, index) => (
                <tr id={`notice-${notice.id}`} key={notice.id}>
                  <td>{index + 1}</td>
                  <td>
                    <Link to={`/articles/${notice.id}`}>{notice.title}</Link>
                  </td>
                  <td>{notice.username}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="write-button-container">
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? '닫기' : '글쓰기'}
        </button>
      </div>
      {showForm && <NoticeForm addNotice={addNotice} />}
    </div>
  );
};

export default Board;
