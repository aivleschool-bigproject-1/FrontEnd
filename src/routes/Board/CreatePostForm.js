import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import Editor from "./Editor";
import './CreatePostForm.css';

const CreatePostForm = () => {
    const [newPost, setNewPost] = useState({title: '', content: ''});
    const token = localStorage.getItem('Authorization');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setNewPost(prevState => ({...prevState, [name]: value}));
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
            navigate('/posts');
        } catch (error) {
            console.error('Error adding post:', error);
        }
    };

    return (
        <div className="page-container">
            <div className="create-post-container">
                <form onSubmit={handleCreatePost} className="create-post-form">
                    <input
                        type="text"
                        name="title"
                        className="title-input"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={handleInputChange}
                        required
                    />
                    <Editor
                        initialValue={newPost.content}
                        onChange={(value) =>
                            handleInputChange({
                                target: {name: "content", value: value}
                            })}
                    />
                    <div className="button-group-create">
                        <button type="submit">등록</button>
                        <button type="button" onClick={() => navigate('/posts')}>취소</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostForm;
