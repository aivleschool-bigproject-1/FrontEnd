import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import moment from 'moment';
import 'chartjs-adapter-moment';
import Modal from '../routes/Modal';
import VideoPlayer_Profile from '../components/VideoPlayer_profile';
import CustomCalendar from '../components/CustomCalendar';
import '../routes/DashBoard.css';

ChartJS.register(...registerables, annotationPlugin);

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
    
    const now = new Date();
    const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const firstDayOfMonth = new Date(kstNow.getFullYear(), kstNow.getMonth(), 1);
    const lastDayOfMonth = new Date(kstNow.getFullYear(), kstNow.getMonth() + 1, 0);
    
    const [startDate, setStartDate] = useState(new Date(firstDayOfMonth.toLocaleString('en-US', { timeZone: 'Asia/Seoul' })));
    const [endDate, setEndDate] = useState(new Date(lastDayOfMonth.toLocaleString('en-US', { timeZone: 'Asia/Seoul' })));

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

        const filterStressDataByToday = (data) => {
            const today = new Date();
            return data.filter(item => {
                const timestamp = new Date(item.logTimestamp);
                return timestamp.toDateString() === today.toDateString();
            });
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
        
                const groupDataByHour = (data, field) => {
                    const groupedData = new Array(24).fill(0);
                    data.forEach(item => {
                        const timestamp = new Date(item.logTimestamp);
                        const hour = timestamp.getHours();
                        groupedData[hour] = Math.max(groupedData[hour], item[field]);
                    });
                    return groupedData;
                };
        
                const filteredStressData = filterStressDataByToday(stressResponse.data); // 오늘 날짜로 필터링
                const filteredHealthData = filterDataByDateRange(healthResponse.data);
        
                // 스트레스 데이터 처리
                const stressLabels = Array.from({ length: 24 }, (_, i) => moment({ hour: i }).format('HH:mm'));
                const stressIndices = groupDataByHour(filteredStressData, 'stressIndex');
        
                setStressChartData({
                    labels: stressLabels,
                    datasets: [
                        {
                            data: stressIndices,  // label을 제거합니다.
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)', // 고정된 색상
                            tension: 0.4
                        }
                    ]
                });
        
                // 건강 기록 데이터 처리 (칼럼 3개)
                const badPostureTimes = groupDataByHour(filteredHealthData, 'badPostureTime');
                const maxStresses = groupDataByHour(filteredHealthData, 'maxStress');
                const minStresses = groupDataByHour(filteredHealthData, 'minStress');

                const getColorForValue = (value, range) => {
                    const ratio = value / range;
                    const r = Math.floor(255 * ratio);
                    const g = Math.floor(255 * (1 - ratio));
                    return `rgb(${r},${g},0)`;
                };

                const stressColors = stressIndices.map(value => getColorForValue(value, 100));
        
                setHealthChartData1({
                    labels: stressLabels,
                    datasets: [
                        {
                            data: badPostureTimes,
                            borderColor: 'rgb(192, 75, 75)',
                            backgroundColor: badPostureTimes.map(value => getColorForValue(value, 60)),
                            tension: 0.4
                        }
                    ]
                });
        
                setHealthChartData2({
                    labels: stressLabels,
                    datasets: [
                        {
                            data: maxStresses,
                            borderColor: 'rgb(75, 75, 192)',
                            backgroundColor: maxStresses.map(value => getColorForValue(value, 100)),
                            tension: 0.4
                        }
                    ]
                });
        
                setHealthChartData3({
                    labels: stressLabels,
                    datasets: [
                        {
                            data: minStresses,
                            borderColor: 'rgb(75, 192, 75)',
                            backgroundColor: minStresses.map(value => getColorForValue(value, 100)),
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

        const updateStressData = async () => {
            try {
                const stressResponse = await axios.get(`/stress/${username}`, {
                    headers: { 'Authorization': `${token}` }
                });

                console.log("실시간 스트레스 응답 데이터:", stressResponse.data);

                const now = new Date();
                const recentData = stressResponse.data.filter(item => {
                    const timestamp = new Date(item.logTimestamp);
                    return timestamp >= startDate && timestamp <= endDate && timestamp.getMinutes() === now.getMinutes();
                });

                if (recentData.length > 0) {
                    const recentStressIndex = recentData.reduce((max, item) => item.stressIndex > max ? item.stressIndex : max, 0);
                    const timestamp = new Date(recentData[0].logTimestamp);

                    setStressChartData(prevData => {
                        const updatedLabels = [...prevData.labels, timestamp.toLocaleTimeString()];
                        const updatedData = [...prevData.datasets[0].data, recentStressIndex];

                        return {
                            ...prevData,
                            labels: updatedLabels,
                            datasets: [
                                {
                                    ...prevData.datasets[0],
                                    data: updatedData
                                }
                            ]
                        };
                    });
                }
            } catch (error) {
                console.error('실시간 데이터를 가져오는 데 실패했습니다:', error);
            }
        };

        if (username) {
            fetchData();
            fetchVideoUrl();
        }

        const intervalId = setInterval(updateStressData, 60000); // 1분마다 업데이트

        return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
    }, [username, token, startDate, endDate]); // 여기에 startDate와 endDate 추가

    const handleChartClick = (chartData, chartType) => {
        setModalContent(chartData);
        setModalChartType(chartType);
        setModalOpen(true);
    };

    const commonChartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    parser: 'HH',
                    unit: 'hour',
                    stepSize: 1,
                    displayFormats: {
                        hour: 'HH:mm'
                    },
                    tooltipFormat: 'HH:mm',
                    min: '00:00',
                    max: '23:59',
                },
                ticks: {
                    callback: function(value, index, values) {
                        const hour = moment(value).hour();
                        if (hour === 0) return '오전 12시';
                        if (hour === 6) return '오후 6시';
                        if (hour === 12) return '오후 12시';
                        if (hour === 18) return '오후 6시';
                        return '';
                    },
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0
                },
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    display: false
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: 25,
                        yMax: 25,
                        borderColor: 'rgba(169, 169, 169, 0.5)',
                        borderWidth: 1,
                        label: {
                            content: '낮음',
                            enabled: true,
                            position: 'start',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'black',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    line2: {
                        type: 'line',
                        yMin: 50,
                        yMax: 50,
                        borderColor: 'rgba(169, 169, 169, 0.5)',
                        borderWidth: 1,
                        label: {
                            content: '평균',
                            enabled: true,
                            position: 'start',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'black',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    line3: {
                        type: 'line',
                        yMin: 75,
                        yMax: 75,
                        borderColor: 'rgba(169, 169, 169, 0.5)',
                        borderWidth: 1,
                        label: {
                            content: '높음',
                            enabled: true,
                            position: 'start',
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            color: 'black',
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    }
                }
            }
        }
    };

    const postureChartOptions = {
        ...commonChartOptions,
        scales: {
            ...commonChartOptions.scales,
            y: {
                ...commonChartOptions.scales.y,
                max: 60
            }
        }
    };

    const stressChartOptions = {
        ...commonChartOptions,
        scales: {
            ...commonChartOptions.scales,
            y: {
                ...commonChartOptions.scales.y,
                max: 100 
            }
        }
    };

    return (
        <div className="dashboard-container">
            <div className="video-player-container">
                {videoUrl && <VideoPlayer_Profile url={videoUrl} />}
            </div>
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
                            <h3>Stress</h3>
                            <Line data={stressChartData} options={commonChartOptions} />
                        </div>
                        <div className="chart" onClick={() => handleChartClick(healthChartData1, 'bar')}>
                            <h3>Bad Posture</h3>
                            <Bar data={healthChartData1} options={postureChartOptions} />
                        </div>
                        <div className="chart" onClick={() => handleChartClick(healthChartData2, 'bar')}>
                            <h3>Max Stress</h3>
                            <Bar data={healthChartData2} options={stressChartOptions} />
                        </div>
                        <div className="chart" onClick={() => handleChartClick(healthChartData3, 'bar')}>
                            <h3>Min Stress</h3>
                            <Bar data={healthChartData3} options={stressChartOptions} />
                        </div>
                    </>
                )}
            </div>
            
            <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
                <div className="chart-detail-modal">
                    {modalContent && modalChartType === 'line' ? (
                        <Line data={modalContent} options={commonChartOptions} />
                    ) : (
                        <Bar data={modalContent} options={commonChartOptions} />
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Dashboard;
