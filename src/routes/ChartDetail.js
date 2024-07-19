import React, { useState, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ChartDetail.css';
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

const ChartDetail = ({ id = "심장박동" }) => {
    const [startDate, setStartDate] = useState(new Date("2024-07-01"));
    const [endDate, setEndDate] = useState(new Date("2024-07-11"));

    // Convert dates to string format for filtering
    const startDateStr = useMemo(() => startDate.toISOString().split('T')[0], [startDate]);
    const endDateStr = useMemo(() => endDate.toISOString().split('T')[0], [endDate]);

    // Filter data based on date range
    const filteredData = useMemo(() => {
        return data
            .filter(d => d.id === id)
            .map(d => ({
                ...d,
                data: d.data.filter(item => item.x >= startDateStr && item.x <= endDateStr)
            }))[0];
    }, [id, startDateStr, endDateStr]);

    return (
        <div className="chart-detail-container">
            <h1>{id} 상세 페이지</h1>
            <div className="date-picker-container">
                <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    className="date-picker"
                />
                <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    className="date-picker"
                />
            </div>
            <div className="chart-detail">
                <ResponsiveLine
                    data={[filteredData]}
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
    );
};

export default ChartDetail;
