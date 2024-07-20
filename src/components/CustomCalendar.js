import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CustomCalendar.css';

const CustomCalendar = ({ startDateProp, endDateProp, onStartDateChange, onEndDateChange }) => {
    const [startDate, setStartDate] = useState(startDateProp);
    const [endDate, setEndDate] = useState(endDateProp);

    const handleStartDateChange = (date) => {
        setStartDate(date);
        onStartDateChange(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        onEndDateChange(date);
    };

    return (
        <div className="chart-detail-container">
            <div className="date-picker-container">
                <DatePicker
                    selected={startDate}
                    onChange={handleStartDateChange}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="Start Date"
                    className="date-picker"
                />
                <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="End Date"
                    className="date-picker"
                />
            </div>
        </div>
    );
};

export default CustomCalendar;
