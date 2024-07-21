import {Button, Card, Divider, Space, Table, Typography} from "antd";
import {PictureOutlined} from '@ant-design/icons';
import React, {useCallback, useEffect, useState, useContext} from "react";
import { AuthContext } from '../../Context/AuthContext';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import 'moment-timezone';

const PostListPage = () => {
    const [posts, setPosts] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [pageNo, setPageNo] = useState(0);
    const navigate = useNavigate();

    const { isLoggedIn, logout } = useContext(AuthContext);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchPosts(pageNo);
        if (isLoggedIn) {
            fetchUser();
        } else {
            setUser(null);
        }
    }, [pageNo, isLoggedIn]);

    const fetchUser = async () => {
        const token = localStorage.getItem('Authorization');
        try {
            const response = await axios.get('/user', {
                headers: {
                    'Authorization': `${token}`
                }
            });
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchPosts = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8080/posts?pageNumber=${pageNo}&pageSize=10`, {
                headers: {
                    Authorization: localStorage.getItem('Authorization'),
                },
            });
            if (response.data && response.data.content) {
                setPosts(response.data.content);
                setTotalSize(response.data.totalElements);
                console.log("posts:", response.data.content);
            } else {
                console.error('Invalid response structure:', response.data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [pageNo]);

    const postColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center'
        },
        {
            title: '제목',
            key: 'title',
            align: 'center',
            render: (post) => {
                // 내용에 이미지가 있으면 아이콘 추가
                const imgTagPattern = /<img\s+src\s*=\s*["'][^"']*["'][^>]*>/i;
                const hasImage = imgTagPattern.test(post.content);
                return <Space direction={'horizontal'}>
                    <Typography.Link href={`/posts/${post.id}`}>{post.title}</Typography.Link>
                    {hasImage ? <PictureOutlined/> : <></>}
                    <span>({post?.commentCount || 0})</span>
                </Space>
            }
        },
        {
            title: '작성자',
            dataIndex: 'writerId',
            key: 'writerId',
            align: 'center'
        },
        {
            title: '작성일시',
            key: 'createdAt',
            align: 'center',
            render: (post) => {
                const koreanTime = moment.tz(post.createdAt, "Asia/Seoul").format('YYYY-MM-DD HH:mm:ss');
                return <div>{koreanTime}</div>
            }
        },
    ]

    // 페이지 선택시 동작
    const handleTableChange = useCallback((pagination) => {
        setPageNo(pagination.current - 1)
    }, []);

    // 게시글 작성 버튼 클릭 핸들러
    const handlePostCreate = useCallback(() => {
        navigate('/posts/new');
    }, []);

    return <Card>
        {/* todo - 배너 이미지 추가하면 좋을듯*/}
        <Divider/>
        <Table
            columns={postColumns}
            dataSource={posts}
            style={{marginTop: 100}}
            pagination={{
                pageSize: 10,
                current: pageNo + 1,
                total: totalSize,
                showSizeChanger: false
            }}
            onChange={handleTableChange}
            title={() => (
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    {isLoggedIn && (
                            <Button type="primary" onClick={handlePostCreate}>게시글 작성하기</Button>
                        )}
                </div>)
            }
        />
    </Card>
}

export default PostListPage;