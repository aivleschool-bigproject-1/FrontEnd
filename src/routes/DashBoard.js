import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Modal from '../routes/Modal'; // 경로 수정
import VideoPlayer_Profile from '../components/VideoPlayer_profile';
import CustomCalendar from '../components/CustomCalendar'; // 추가
import '../routes/DashBoard.css';

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
    const [modalChartType, setModalChartType] = useState('line');
    const [videoUrl, setVideoUrl] = useState(null);
    const [startDate, setStartDate] = useState(new Date("2024-07-01"));
    const [endDate, setEndDate] = useState(new Date("2024-07-11"));
    const token = localStorage.getItem('Authorization');

    useEffect(() => {
        const fetchVideoUrl = async () => {
            try {
                const videoResponse = await axios.get(`/health-record/url/${username}`, {
                    headers: { 'Authorization': `${token}` }
                });
                console.log("비디오 URL 응답 데이터:", videoResponse.data);
    
                if (videoResponse.data) {
                    setVideoUrl(videoResponse.data);
                } else {
                    console.error('Video URL not found in response');
                }
            } catch (error) {
                console.error('Failed to fetch video URL:', error);
            }
        };
    
        const fetchData = async () => {
            if (!token) {
                setError('Authorization token not found');
                setLoading(false);
                return;
            }
    
            try {
                const [stressResponse, healthResponse] = await Promise.all([
                    axios.get(`/stress/${username}`, {
                        headers: { 'Authorization': `${token}` }
                    }),
                    axios.get(`/health-record/${username}`, {
                        headers: { 'Authorization': `${token}` }
                    })
                ]);
    
                console.log("스트레스 응답 데이터:", stressResponse.data);
                console.log("건강 기록 응답 데이터:", healthResponse.data);
    
                const filterDataByDateRange = (data) => {
                    return data.filter(item => {
                        const timestamp = new Date(item.logTimestamp);
                        return timestamp >= startDate && timestamp <= endDate;
                    });
                };
    
                const filteredStressData = filterDataByDateRange(stressResponse.data);
                const filteredHealthData = filterDataByDateRange(healthResponse.data);
    
                // 필터링된 스트레스 데이터 처리
                const stressLabels = [];
                const stressIndices = [];
    
                filteredStressData.forEach(item => {
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
                            label: '스트레스',
                            data: stressIndices,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.4
                        }
                    ]
                });
    
                // 필터링된 건강 기록 데이터 처리 (칼럼 3개)
                const healthLabels = [];
                const badPostureTimes = [];
                const maxStresses = [];
                const minStresses = [];
    
                filteredHealthData.forEach(item => {
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
    
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setError('데이터를 불러오는 데 실패했습니다. 다시 시도해 주세요.');
                setLoading(false);
            }
        };
    
        if (username) {
            fetchData();
            fetchVideoUrl();
        }
    }, [username, token, startDate, endDate]);

    const handleChartClick = (chartData, chartType) => {
        setModalContent(chartData);
        setModalChartType(chartType);
        setModalOpen(true);
    };

    return (
        <div className="dashboard-container">
            <div className="video-player-container">
                {videoUrl && <VideoPlayer_Profile url={videoUrl} />}
            </div>
            <h2 className="chart-title">스트레스 및 건강 기록 차트</h2>
            <CustomCalendar
                startDateProp={startDate}
                endDateProp={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
            />
            <div className="chart-container">
                {loading ? (
                    <p>로딩 중...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : (
                    <>
                        <div className="chart" onClick={() => handleChartClick(stressChartData, 'line')}>
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
                        <div className="chart" onClick={() => handleChartClick(healthChartData1, 'bar')}>
                            <h3>잘못된 자세</h3>
                            <Bar data={healthChartData1} options={{
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
                        <div className="chart" onClick={() => handleChartClick(healthChartData2, 'bar')}>
                            <h3>최대 스트레스</h3>
                            <Bar data={healthChartData2} options={{
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
                        <div className="chart" onClick={() => handleChartClick(healthChartData3, 'bar')}>
                            <h3>최소 스트레스</h3>
                            <Bar data={healthChartData3} options={{
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
                <div className="chart-detail-modal">
                    {modalContent && modalChartType === 'line' ? (
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
                    ) : (
                        <Bar data={modalContent} options={{
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
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
