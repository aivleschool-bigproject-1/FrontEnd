import { Card, Divider, Table} from "antd";
import React, { useCallback, useEffect, useState } from 'react';
import axios from "axios";
import moment from "moment";
import 'moment-timezone';

const EventLogs = ({ cameraId }) => {
  const [logs, setEventLogs] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [pageNo, setPageNo] = useState(0);
  useEffect(() => {
    fetchEventLogs(pageNo);
  }, [cameraId, pageNo]);

  const fetchEventLogs = useCallback(async () => {
    try {
        const response = await axios.get(`http://localhost:8080/event-logs/${cameraId}?pageNumber=${pageNo}&pageSize=10`, {
            headers: {
                Authorization: localStorage.getItem('Authorization'),
            },
        });
        console.log(`http://localhost:8080/event-logs/${cameraId}?pageNumber=${pageNo}&pageSize=10`)
        console.log(response.data)
        if (response.data && response.data.content) {
            setEventLogs(response.data.content);
            setTotalSize(response.data.totalElements);
        } else {
            console.error('Invalid response structure:', response.data);
        }
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
  }, [cameraId, pageNo]);

  const eventLogColumns = [
    {
        title: '사고 내용',
        dataIndex: 'eventType',
        key: 'eventType',
        align: 'center'
    },
    {
        title: '작성일시',
        key: 'eventTime',
        align: 'center',
        render: (post) => {
            const koreanTime = moment.tz(post.createdAt, "Asia/Seoul").format('YYYY-MM-DD HH:mm:ss');
            return <div>{koreanTime}</div>
        }
    },
  ]

  // 페이지 선택시 동작
  const handleTableChange = useCallback((pagination) => {
    setPageNo(pagination.current - 1)
  }, []);

  return (
    <div className="event-logs">
      <Card>
        {/* todo - 배너 이미지 추가하면 좋을듯*/}
        <Divider/>
        <Table
            columns={eventLogColumns}
            dataSource={logs}
            style={{marginTop: 100}}
            pagination={{
                pageSize: 10,
                current: pageNo + 1,
                total: totalSize,
                showSizeChanger: false
            }}
            onChange={handleTableChange}
        />
    </Card>
    </div>
  );
};

export default EventLogs;
