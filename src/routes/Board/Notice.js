import React from 'react';

const Notice = ({ notice, currentUser, updateNotice, deleteNotice }) => {
  const handleDelete = () => {
    deleteNotice(notice.id);
  };

  const handleEdit = () => {
    updateNotice(notice);
  };

  const username = notice.username || 'Unknown';

  // currentUser와 notice.username이 올바르게 전달되는지 확인
  console.log('Current User:', currentUser);
  console.log('Notice Username:', username);

  return (
    <div className="notice" id={`notice-${notice.id}`}>
      <h3>{notice.title}</h3>
      <p>{notice.content}</p>
      <p>작성자: {username}</p>
      {currentUser && currentUser.username === username && (
        <div className="button-container">
          <button onClick={handleEdit}>수정</button>
          <button onClick={handleDelete}>삭제</button>
        </div>
      )}
    </div>
  );
};

export default Notice;
