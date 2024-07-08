import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import './DashBoard.css';
import UserProfile from './UserProfile';

const data = [
    {
        "id": "심장박동",
        "data": [
            { "x": "2024-07-01", "y": 75 },
            { "x": "2024-07-02", "y": 78 },
            { "x": "2024-07-03", "y": 72 },
            { "x": "2024-07-04", "y": 77 },
            { "x": "2024-07-05", "y": 80 },
            { "x": "2024-07-06", "y": 65 },
            { "x": "2024-07-07", "y": 80 },
            { "x": "2024-07-08", "y": 55 },
            { "x": "2024-07-09", "y": 86 }
        ]
    }
];

const Dashboard = () => (
    <div className="dashboard-container">
        <UserProfile />
        <div className="chart-container">
                    <div className="monitoring-container">
            <div className="monitoring-item">
                <span className="monitoring-label">심장박동</span>
                <span className="monitoring-value">정상</span>
            </div>
            <div className="monitoring-item">
                <span className="monitoring-label">스트레스 수준</span>
                <span className="monitoring-value">정상</span>
            </div>
            <div className="monitoring-item">
                <span className="monitoring-label">피로도</span>
                <span className="monitoring-value">정상</span>
            </div>
            <div className="monitoring-item">
                <span className="monitoring-label">집중력</span>
                <span className="monitoring-value">정상</span>
            </div>
        </div>
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
                xScale={{ type: 'point' }}
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                curve="catmullRom"
                axisTop={null}
                axisRight={null}
                axisBottom={null}
                axisLeft={null}
                enableGridX={false}
                enableGridY={false}
                pointSize={0}
                lineWidth={3}
                colors={['#32CD32']}
                pointLabel="y"
                pointLabelYOffset={-12}
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
);

export default Dashboard;
