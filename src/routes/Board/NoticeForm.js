import React, { useState, useEffect } from 'react';

const NoticeForm = ({ addNotice }) => {
  const [noticeData, setNoticeData] = useState({
    title: '',
    content: '',
    username: '', // username을 상태로 추가
  });

  useEffect(() => {
    // 로컬 스토리지에서 username 가져오기
    const storedUsername = localStorage.getItem('Username');
    console.log('Stored username:', storedUsername); // 콘솔 로그 추가
    if (storedUsername) {
      setNoticeData(prevState => ({
        ...prevState,
        username: storedUsername,
      }));
    } else {
      console.error('No username found in localStorage');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNoticeData({
      ...noticeData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!noticeData.username) {
      console.error('로그인 필요');
      return;
    }
    console.log('Sending notice data:', noticeData); 
    addNotice(noticeData);
    setNoticeData({ title: '', content: '', username: noticeData.username });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={noticeData.title}
        onChange={handleChange}
        placeholder="제목"
        required
      />
      <textarea
        name="content"
        value={noticeData.content}
        onChange={handleChange}
        placeholder="내용"
        required
      ></textarea>
      <button type="submit">등록하기</button>
    </form>
  );
};

export default NoticeForm;
