import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import moment from 'moment';
import 'chartjs-adapter-moment'; // 어댑터를 임포트합니다.
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
    const token = localStorage.getItem('Authorization');

    const now = new Date();
    const kstNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
    const firstDayOfMonth = new Date(kstNow.getFullYear(), kstNow.getMonth(), 1);
    const lastDayOfMonth = new Date(kstNow.getFullYear(), kstNow.getMonth() + 1, 0);

    const [startDate, setStartDate] = useState(firstDayOfMonth);
    const [endDate, setEndDate] = useState(lastDayOfMonth);



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

                const groupDataByHour = (data, field) => {
                    const groupedData = new Array(24).fill(0);
                    data.forEach(item => {
                        const timestamp = new Date(item.logTimestamp);
                        const hour = timestamp.getHours();
                        groupedData[hour] += item[field];
                    });
                    return groupedData;
                };

                const filteredStressData = filterDataByDateRange(stressResponse.data);
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
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.4
                        }
                    ]
                });

                // 건강 기록 데이터 처리 (칼럼 3개)
                const badPostureTimes = groupDataByHour(filteredHealthData, 'badPostureTime');
                const maxStresses = groupDataByHour(filteredHealthData, 'maxStress');
                const minStresses = groupDataByHour(filteredHealthData, 'minStress');

                setHealthChartData1({
                    labels: stressLabels,
                    datasets: [
                        {
                            data: badPostureTimes,
                            borderColor: 'rgb(192, 75, 75)',
                            backgroundColor: 'rgba(192, 75, 75, 0.2)',
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
                            backgroundColor: 'rgba(75, 75, 192, 0.2)',
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
                    }
                },
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
        },
        plugins: {
            legend: {
                display: false  // 범례를 숨깁니다.
            }
        }
    };

    const postureChartOptions = {
        ...commonChartOptions,
        scales: {
            ...commonChartOptions.scales,
            y: {
                ...commonChartOptions.scales.y,
                max: 60 // y축 최대값을 60으로 설정
            }
        }
    };

    const stressChartOptions = {
        ...commonChartOptions,
        scales: {
            ...commonChartOptions.scales,
            y: {
                ...commonChartOptions.scales.y,
                max: 100 // y축 최대값을 100으로 설정
            }
        }
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
                            <Line data={stressChartData} options={commonChartOptions} />
                        </div>
                        <div className="chart" onClick={() => handleChartClick(healthChartData1, 'bar')}>
                            <h3>잘못된 자세</h3>
                            <Bar data={healthChartData1} options={postureChartOptions} />
                        </div>
                        <div className="chart" onClick={() => handleChartClick(healthChartData2, 'bar')}>
                            <h3>최대 스트레스</h3>
                            <Bar data={healthChartData2} options={stressChartOptions} />
                        </div>
                        <div className="chart" onClick={() => handleChartClick(healthChartData3, 'bar')}>
                            <h3>최소 스트레스</h3>
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
