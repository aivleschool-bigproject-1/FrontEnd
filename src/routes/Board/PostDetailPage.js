import {useNavigate, useParams} from "react-router-dom";
import React, {useCallback, useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Form, Input, message, Space, Spin, Typography} from "antd";
import Comments from "./Comment";
import ReactQuill from "react-quill";
import Editor from "./Editor";
import "./PostDetailPage.css";  // Import the CSS file

const EditMode = {
    CREATE: 'CREATE', READ: 'READ', UPDATE: 'UPDATE',
}

const PostDetailPage = () => {
    const [editMode, setEditMode] = useState(EditMode.CREATE); // 모드
    const {id} = useParams(); // path variable 로 전달된 post id
    const [post, setPost] = useState({ // API 조회 값
        title: '',
        content: '',
    });
    const [postForm] = Form.useForm(); // 생성, 수정에 사용되는 폼
    const [messageApi, contextHolder] = message.useMessage(); // 메시지 출력
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== 'new') { // 존재하는 포스트 -> 읽기 모드
            fetchPost(id);
            setEditMode(EditMode.READ)
        } else { // 생성 모드
            setEditMode(EditMode.CREATE)
        }
    }, [id]);

    useEffect(() => {
        postForm.setFieldsValue(post);
    }, [post]);

    const fetchPost = async (postId) => {
        try {
            const response = await axios.get(`http://localhost:8080/post/${postId}`, {
                headers: {
                    Authorization: localStorage.getItem('Authorization'),
                },
            });
            setPost(response.data);
        } catch (error) {
            console.error('Error fetching post details:', error);
        }
    };

    // 저장
    const onSave = useCallback(async () => {
        const requestBody = postForm.getFieldsValue();
        if (!(requestBody.title && requestBody.content)) {
            messageApi.open({
                type: 'error',
                content: '게시글 제목,내용을 입력해주세요',
                duration: 5,
            });
            return;
        }

        if (editMode === EditMode.CREATE) {
            const response = await axios.post('http://localhost:8080/post', requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('Authorization'),
                },
            });
            messageApi.open({
                type: 'success',
                content: '게시글을 저장하였습니다.',
                duration: 10,
            });
            navigate(`/posts/${response.data}`);
            // navigate(`/posts/${response.id}`) todo - API 에서 id 를 반환하면 상세페이지로 바로 이동 가능
        } else if (editMode === EditMode.UPDATE) {
            const response = await axios.patch(`http://localhost:8080/post/${post.id}`, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('Authorization'),
                },
            });
            messageApi.open({
                type: 'success',
                content: '게시글을 수정하였습니다.',
                duration: 10,
            });
            navigate(`/posts/${id}`);
        }
    }, [id, editMode, postForm?.getFieldsValue()]);

    // 제목 입력
    const onTitleChange = useCallback((value) => {
        postForm.setFieldValue(['title'], value);
    }, [postForm]);

    // 내용 입력
    const onContentChange = useCallback((value) => {
        postForm.setFieldValue(['content'], value);
    }, [postForm]);

    // 취소 -> 생성 도중 취소하면 목록 페이지 이동, 수정 도중 취소하면 읽기 모드로 변경
    const onCancel = useCallback(() => {
        editMode === EditMode.CREATE ?
            navigate('/posts') : setEditMode(EditMode.READ);
    }, [editMode]);

    // 삭제 -> 삭제 후 목록 페이지로 이동
    const onDelete = useCallback(async () => {
        await axios.delete(`http://localhost:8080/post/${id}`, {
            headers: {
                Authorization: localStorage.getItem("Authorization"),
            },
        });
        messageApi.open({
            type: 'success',
            content: '게시글이 삭제되었습니다.',
            duration: 10,
        });
        navigate('/posts');
    }, [id]);

    // 모드 변경
    const onEdit = useCallback((editMode) => {
        setEditMode(editMode);
    }, []);

    return <div>
        {contextHolder}
        {editMode === EditMode.CREATE || editMode === EditMode.UPDATE ? // 편집 모드
            <Card>
                <Form form={postForm}>
                    <Form.Item name={'title'} required>
                        <Input
                            defaultValue={post?.title}
                            placeholder={'제목을 입력해주세요.'}
                            onChange={e => onTitleChange(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item name={'content'} required>
                        <Editor value={postForm.getFieldsValue(['content'])}
                                onChange={value => onContentChange(value)}/>
                    </Form.Item>
                </Form>
                <Space direction='horizontal' align={'center'}>
                    <Button type="primary" className="custom-button-primary" onClick={onSave}>
                        저장
                    </Button>
                    <Button className="custom-button-danger" onClick={onCancel}>
                        취소
                    </Button>
                </Space>
            </Card> :
            post === null ? <Spin/> : // 읽기모드
                <Card title={<Typography.Title level={2}>{post.title}</Typography.Title>}>
                    <div className="post-content">
                        <ReactQuill value={post.content} readOnly={true} theme="bubble"/>
                    </div>
                    <div>
                        {post.writerId === localStorage.getItem('Username') ?
                            <Space direction='horizontal' align={'center'}>
                                <Button type="primary" className="custom-button-primary" onClick={() => onEdit(EditMode.UPDATE)}>
                                    수정
                                </Button>
                                <Button className="custom-button-danger" onClick={onDelete}>
                                    삭제
                                </Button>
                            </Space> : <div/>}
                    </div>
                    <Comments postId={post.id}/>
                </Card>}
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <Button type="default" className="custom-button-default" onClick={() => navigate('/posts')}>
                목록
            </Button>
        </div>
    </div>
}

export default PostDetailPage;
