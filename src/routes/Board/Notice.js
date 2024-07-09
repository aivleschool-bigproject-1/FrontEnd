import React, { useState } from 'react';
import NoticeForm from './BoardForm';
import CommentSection from './Comment';

const Notice = ({ notice, currentUser, updateNotice, deleteNotice }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };


  const handleDelete = () => {
    deleteNotice(notice.id);
  };

  return (
    <div className="notice" id={`notice-${notice.id}`}>
      {isEditing ? (
        <NoticeForm
          noticeToEdit={notice}
          updateNotice={(updatedNotice) => {
            updateNotice(updatedNotice);
            setIsEditing(false);
          }}
          currentUser={currentUser}
        />
      ) : (
        <>
          <h2>{notice.title}</h2>
          <p>{notice.content}</p>
          <p>유저: {notice.userName}</p>
          {currentUser.id === notice.userId && (
            <div className="button-container">
              <button onClick={handleEdit}>편집</button>
              <button onClick={handleDelete}>삭제</button>
            </div>
            
          )}
          <CommentSection noticeId={notice.id} />
        </>
      )}
    </div>
  );
};

export default Notice;
