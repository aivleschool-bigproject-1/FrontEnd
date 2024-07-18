import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import './DashBoard.css';
import UserProfile from './UserProfile';
import CCTVGrid_profile from '../components/CCTVGrid_profile';

const data = [
    {
        "id": "심장박동",
        "data": [
            { "x": "2024-07-01", "y": 75 },
            { "x": "2024-07-02", "y": 78 },
            { "x": "2024-07-03", "y": 72 },
            { "x": "2024-07-04", "y": 77 },
            { "x": "2024-07-05", "y": 76 },
            { "x": "2024-07-06", "y": 79 },
            { "x": "2024-07-07", "y": 74 },
            { "x": "2024-07-08", "y": 75 },
            { "x": "2024-07-09", "y": 76 },
            { "x": "2024-07-10", "y": 75 },
            { "x": "2024-07-11", "y": 76 },
        ]
    },
    {
        "id": "스트레스",
        "data": [
            { "x": "2024-07-01", "y": 80 },
            { "x": "2024-07-02", "y": 82 },
            { "x": "2024-07-03", "y": 78 },
            { "x": "2024-07-04", "y": 81 },
            { "x": "2024-07-05", "y": 79 },
            { "x": "2024-07-06", "y": 74 },
            { "x": "2024-07-07", "y": 77 },
            { "x": "2024-07-08", "y": 70 },
            { "x": "2024-07-09", "y": 72 },
            { "x": "2024-07-10", "y": 69 },
            { "x": "2024-07-11", "y": 81 },
        ]
    }
];

const Dashboard = () => (
    <div className="dashboard-container">
        <CCTVGrid_profile />
        <UserProfile />
        <div className="chart-wrapper">
            <div className="monitoring-container">
                <div className="monitoring-item">
                    <span className="monitoring-label">거북목</span>
                    <span className="monitoring-value">정상</span>
                </div>
                <div className="monitoring-item">
                    <span className="monitoring-label">스트레스</span>
                    <span className="monitoring-value">정상</span>
                </div>
                <div className="monitoring-item">
                    <span className="monitoring-label">심장박동</span>
                    <span className="monitoring-value">정상</span>
                </div>
            </div>
            <div className="chart-container">
                <ResponsiveLine
                    data={data}
                    margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                    xScale={{ type: 'point' }}
                    yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
                    curve="catmullRom"
                    axisTop={null}
                    axisRight={null}
                    axisBottom={null}
                    axisLeft={null}
                    enableGridX={false}
                    enableGridY={false}
                    pointSize={0}
                    lineWidth={3}
                    colors={['#FDBD40', '#00A6FF']}
                    useMesh={true}
                    legends={[
                        {
                            anchor: 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: 100,
                            translateY: 0,
                            itemsSpacing: 0,
                            itemDirection: 'left-to-right',
                            itemWidth: 80,
                            itemHeight: 20,
                            itemOpacity: 0.75,
                            symbolSize: 12,
                            symbolShape: 'circle',
                            symbolBorderColor: 'rgba(0, 0, 0, .5)',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemBackground: 'rgba(0, 0, 0, .03)',
                                        itemOpacity: 1
                                    }
                                }
                            ]
                        }
                    ]}
                />
            </div>
        </div>
    </div>
);

export default Dashboard;
