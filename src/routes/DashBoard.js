import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Modal from '../routes/Modal'; // 경로 수정
import VideoPlayer_Profile from '../components/VideoPlayer_profile'; // 경로 수정
import '../routes/DashBoard.css'; // 경로 수정

const Dashboard = () => {
    const { username } = useParams();
    const [stressChartData, setStressChartData] = useState({ labels: [], datasets: [] });
    const [healthChartData1, setHealthChartData1] = useState({ labels: [], datasets: [] });
    const [healthChartData2, setHealthChartData2] = useState({ labels: [], datasets: [] });
    const [healthChartData3, setHealthChartData3] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [videoUrl, setVideoUrl] = useState('https://boda-ts-bucket.s3.amazonaws.com/facecam-output/playlist.m3u8');
    const token = localStorage.getItem('Authorization');

    

    useEffect(() => {
        const fetchData = async () => {
            if (!token) {
                setError('Authorization token not found');
                setLoading(false);
                return;
            }

            try {
                const [stressResponse, healthResponse, videoResponse] = await Promise.all([
                    axios.get(`/stress/${username}`, {
                        headers: { 'Authorization': `${token}` }
                    }),
                    axios.get(`/health-record/${username}`, {
                        headers: { 'Authorization': `${token}` }
                    }),
                    axios.get(`/health-record/url/${username}`, {
                        headers: { 'Authorization': `${token}` }
                    })
                ]);

                console.log("스트레스 응답 데이터:", stressResponse.data);
                console.log("건강 기록 응답 데이터:", healthResponse.data);
                console.log("비디오 URL 응답 데이터:", videoResponse.data);

                // 스트레스 데이터 처리
                const stressLabels = [];
                const stressIndices = [];

                stressResponse.data.forEach(item => {
                    const timestamp = new Date(item.logTimestamp);
                    if (!isNaN(timestamp)) {
                        const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        stressLabels.push(formattedTime);
                        stressIndices.push(item.stressIndex);
                    }
                });

                setStressChartData({
                    labels: stressLabels,
                    datasets: [
                        {
                            label: '스트레스 지수',
                            data: stressIndices,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.4
                        }
                    ]
                });

                // 건강 기록 데이터 처리 (칼럼 3개)
                const healthLabels = [];
                const badPostureTimes = [];
                const maxStresses = [];
                const minStresses = [];

                healthResponse.data.forEach(item => {
                    const timestamp = new Date(item.logTimestamp);
                    if (!isNaN(timestamp)) {
                        const formattedTime = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        healthLabels.push(formattedTime);
                        badPostureTimes.push(item.badPostureTime);
                        maxStresses.push(item.maxStress);
                        minStresses.push(item.minStress);
                    }
                });

                setHealthChartData1({
                    labels: healthLabels,
                    datasets: [
                        {
                            label: '잘못된 자세 시간',
                            data: badPostureTimes,
                            borderColor: 'rgb(192, 75, 75)',
                            backgroundColor: 'rgba(192, 75, 75, 0.2)',
                            tension: 0.4
                        }
                    ]
                });

                setHealthChartData2({
                    labels: healthLabels,
                    datasets: [
                        {
                            label: '최대 스트레스',
                            data: maxStresses,
                            borderColor: 'rgb(75, 75, 192)',
                            backgroundColor: 'rgba(75, 75, 192, 0.2)',
                            tension: 0.4
                        }
                    ]
                });

                setHealthChartData3({
                    labels: healthLabels,
                    datasets: [
                        {
                            label: '최소 스트레스',
                            data: minStresses,
                            borderColor: 'rgb(75, 192, 75)',
                            backgroundColor: 'rgba(75, 192, 75, 0.2)',
                            tension: 0.4
                        }
                    ]
                });

                // 비디오 URL 설정
                if (videoResponse.data.url) {
                    setVideoUrl(videoResponse.data.url);
                }

                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username, token]);

    const handleChartClick = (chartData) => {
        setModalContent(chartData);
        setModalOpen(true);
    };

    return (
        <div className="dashboard-container">
            <div className="video-player-container">
                <VideoPlayer_Profile url={videoUrl} token={token} />
            </div>
            <h2 className="chart-title">스트레스 및 건강 기록 차트</h2>
            <div className="chart-container">
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        <div className="chart" onClick={() => handleChartClick(stressChartData)}>
                            <h3>스트레스 차트</h3>
                            <Line data={stressChartData} options={{
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: '시간'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: '스트레스 지수'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }} />
                        </div>
                        <div className="chart" onClick={() => handleChartClick(healthChartData1)}>
                            <h3>건강 기록 - 잘못된 자세 시간</h3>
                            <Line data={healthChartData1} options={{
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: '시간'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: '잘못된 자세 시간'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }} />
                        </div>
                        <div className="chart" onClick={() => handleChartClick(healthChartData2)}>
                            <h3>건강 기록 - 최대 스트레스</h3>
                            <Line data={healthChartData2} options={{
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: '시간'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: '최대 스트레스'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }} />
                        </div>
                        <div className="chart" onClick={() => handleChartClick(healthChartData3)}>
                            <h3>건강 기록 - 최소 스트레스</h3>
                            <Line data={healthChartData3} options={{
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: '시간'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: '최소 스트레스'
                                        },
                                        grid: {
                                            display: false
                                        }
                                    }
                                }
                            }} />
                        </div>
                    </>
                )}
            </div>
            
            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="chart-container">
                    <Line data={modalContent} options={{
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: '시간'
                                },
                                grid: {
                                    display: false
                                }
                            },
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: '지수'
                                },
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }} />
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
