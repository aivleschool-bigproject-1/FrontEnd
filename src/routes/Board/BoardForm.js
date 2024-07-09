import React, { useState, useEffect } from 'react';

const NoticeForm = ({ addNotice, currentUser, noticeToEdit, updateNotice }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (noticeToEdit) {
      setTitle(noticeToEdit.title);
      setContent(noticeToEdit.content);
    }
  }, [noticeToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newNotice = {
      title,
      content,
      userId: currentUser.id,
      userName: currentUser.name,
    };
    if (noticeToEdit) {
      updateNotice({ ...noticeToEdit, ...newNotice });
    } else {
      addNotice({ ...newNotice, id: Date.now() });
    }
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="notice-form">
      <input
        type="text"
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="내용"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className="button-container">
        <button type="submit">
          {noticeToEdit ? '수정' : '추가'}
        </button>
      </div>
    </form>
  );
};

export default NoticeForm;
