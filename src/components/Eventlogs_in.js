import React, { useEffect, useState } from 'react';

const EventLogs_in = ({ cameraId }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/event-logs/office-cctv`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log('Fetched logs:', data); 
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      }
    };

    fetchLogs();
  }, [cameraId]);

  return (
    <div className="event-logs">
      <ul>
        {logs.map((log) => (
            <li key={log.id}>
              <p>{new Date(log.eventTime).toLocaleString()}</p>
              <p>{log.eventType}</p>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default EventLogs_in;
