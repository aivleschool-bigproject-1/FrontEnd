import React, { useState, useEffect } from 'react';
import NoticeForm from './BoardForm';
import Notice from './Notice';
import { gsap } from 'gsap';
import './Board.css';

const Board = ({ currentUser }) => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const hardCodedNotices = [
      {
        id: 1,
        title: 'First Notice',
        content: 'This is the first notice.',
        userId: 1,
        userName: '박현빈'
      },
      {
        id: 2,
        title: 'Second Notice',
        content: 'This is the second notice.',
        userId: 2,
        userName: 'Jane Doe'
      }
    ];

    setNotices(hardCodedNotices);
  }, []);

  const addNotice = (newNotice) => {
    setNotices([newNotice, ...notices]);
    setTimeout(() => {
      const noticeElement = document.getElementById(`notice-${newNotice.id}`);
      gsap.from(noticeElement, { y: 50, opacity: 0, duration: 0.5, ease: 'power2.out' });
    }, 0);
  };

  const updateNotice = (updatedNotice) => {
    setNotices(
      notices.map((notice) => (notice.id === updatedNotice.id ? updatedNotice : notice))
    );
  };

  const deleteNotice = (noticeId) => {
    const noticeElement = document.getElementById(`notice-${noticeId}`);
    gsap.to(noticeElement, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setNotices(notices.filter((notice) => notice.id !== noticeId));
      }
    });
  };

  return (
    <div>
      <NoticeForm addNotice={addNotice} currentUser={currentUser} />
      {notices.length === 0 ? (
        <p className="no-notices-message">문의 및 건의 사항을 등록해주세요</p>
      ) : (
        notices.map((notice) => (
          <Notice
            key={notice.id}
            notice={notice}
            currentUser={currentUser}
            updateNotice={updateNotice}
            deleteNotice={deleteNotice}
          /> 
        ))
      )}
    </div>

  );
};

export default Board;
