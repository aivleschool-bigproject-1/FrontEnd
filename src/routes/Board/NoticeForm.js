import React, {useState, useEffect, useCallback} from 'react';
import Editor from "./Editor";
import axios from "axios";
import {useNavigate} from "react-router-dom";

// TODO - createPostForm 에 내용 반영 후 제거예정
const NoticeForm = ({addNotice}) => {
    const [noticeData, setNoticeData] = useState({
        title: '',
        content: '',
        username: '',
    });
    const navigate = useNavigate();

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
        const {name, value} = e.target;
        setNoticeData({
            ...noticeData,
            [name]: value,
        });
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!noticeData.username) {
            console.error('로그인 필요');
            return;
        }
        console.log('Sending notice data:', noticeData);
        const response = await axios.post("/post", noticeData, {
            headers: {
                'Authorization': localStorage.getItem("Authorization")
            }
        })

        if (response.status !== 201) {
            throw new Error("post creeat failed!")
        }

        setNoticeData({title: '', content: '', username: noticeData.username});
        navigate('/boards'); 
    }, [noticeData]);

    useEffect(() => {
        console.log("changed");
        console.log(noticeData.content)
    }, [noticeData])

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

            <Editor onChange={(value) => handleChange({
                target: {name: "content", value: value}
            })}
                    initialValue={noticeData.content}/>
            <button type="submit">등록하기</button>
        </form>
    );
};

export default NoticeForm;
