import React, {useCallback, useEffect, useState} from "react";
import moment from "moment";
import 'moment-timezone';
import './PostListPage.css';

const PostListPage = () => {
    const [posts, setPosts] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const [pageNo, setPageNo] = useState(0);
    const token = localStorage.getItem('Authorization');

    useEffect(() => {
        fetchPosts(pageNo);
    }, [pageNo]);

    const fetchPosts = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:8080/posts?pageNumber=${pageNo}&pageSize=10`, {
                headers: {
                    Authorization: localStorage.getItem('Authorization'),
                },
            });
            const data = await response.json();
            if (data && data.content) {
                setPosts(data.content);
                setTotalSize(data.totalElements);
            } else {
                console.error('Invalid response structure:', data);
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    }, [pageNo]);

    const handleTableChange = useCallback((newPageNo) => {
        setPageNo(newPageNo);
    }, []);

    const handlePostCreate = useCallback(() => {
        window.location.href = '/posts/new';
    }, []);

    return (
        <div className="post-list-page">
            <div className="post-list-card">
                <table className="post-list-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일시</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map(post => (
                            <tr key={post.id}>
                                <td>{post.id}</td>
                                <td>
                                    <div className="post-title">
                                        <a href={`/posts/${post.id}`} className="post-title-link">
                                            {post.title}
                                        </a>
                                        {/<img\s+src\s*=\s*["'][^"']*["'][^>]*>/i.test(post.content) && <span className="image-icon">🖼️</span>}
                                        <span>({post.commentCount || 0})</span>
                                    </div>
                                </td>
                                <td>{post.writerId}</td>
                                <td>{moment.tz(post.createdAt, "Asia/Seoul").format('YYYY-MM-DD HH:mm:ss')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pagination">
                    {[...Array(Math.ceil(totalSize / 10)).keys()].map(page =>
                        <button
                            key={page}
                            className={`page-button ${pageNo === page ? 'active' : ''}`}
                            onClick={() => handleTableChange(page)}
                        >
                            {page + 1}
                        </button>
                    )}
                </div>
            </div>
            {token && (
                <button className="create-post-button" onClick={handlePostCreate}>🖋️</button>
            )}
        </div>
    );
}

export default PostListPage;
