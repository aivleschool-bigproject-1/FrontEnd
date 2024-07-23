import { Card, Table } from "antd";
import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import moment from "moment";
import 'moment-timezone';
import "./CCTVGrid_ex.css";

const EventLogs = ({ cameraId }) => {
  const [logs, setEventLogs] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [pageNo, setPageNo] = useState(0);

  const fetchEventLogs = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:8080/event-logs/${cameraId}?pageNumber=${pageNo}&pageSize=5`, {
        headers: {
          Authorization: localStorage.getItem('Authorization'),
        },
      });
      console.log(`API URL: http://localhost:8080/event-logs/${cameraId}?pageNumber=${pageNo}&pageSize=5`);
      console.log('API Response:', response.data);
      if (response.data && response.data.content && Array.isArray(response.data.content)) {
        const logsWithKey = response.data.content.map((log, index) => ({ ...log, key: log.id || index }));
        setEventLogs(logsWithKey);
        setTotalSize(response.data.totalElements);  // totalSize를 전체 로그 개수로 설정
      } else {
        console.error('Invalid response structure:', response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [cameraId, pageNo]);

  useEffect(() => {
    fetchEventLogs();
  }, [cameraId, pageNo, fetchEventLogs]);

  const eventLogColumns = [
    {
      title: '사고 내용',
      dataIndex: 'eventType',
      key: 'eventType',
      align: 'center'
    },
    {
      title: '발생 일시',
      key: 'eventTime',
      align: 'center',
      render: (post) => {
        const koreanTime = moment.tz(post.eventTime, "Asia/Seoul").format('YYYY-MM-DD HH:mm:ss');
        return <div>{koreanTime}</div>;
      }
    },
  ];

  const handleTableChange = useCallback((pagination) => {
    setPageNo(pagination.current - 1);
  }, []);

  console.log('Rendered logs:', logs);

  return (
    <div className="event-logs-container">
      <Card className="card-log">
        <Table
          columns={eventLogColumns}
          dataSource={logs}
          pagination={{
            pageSize: 5,
            current: pageNo + 1,
            total: totalSize,
            showSizeChanger: false,
          }}
          onChange={handleTableChange}
          scroll={{ x: 400 }} 
        />
      </Card>
    </div>
  );
};

export default EventLogs;
