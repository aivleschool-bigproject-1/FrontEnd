import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer_profile = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let hls;

    const handleVideoEnd = () => {
      video.currentTime = 0;
      video.play();
    };

    if (Hls.isSupported()) {
      hls = new Hls({
        liveSyncDurationCount: 3, // 라이브 스트리밍 지연 시간 설정
        liveMaxLatencyDurationCount: 5, // 최대 허용 지연 시간 설정
        lowLatencyMode: true, // 저지연 모드 활성화
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });

      hls.on(Hls.Events.LEVEL_LOADED, (event, data) => {
        if (data.details.live) {
          console.log('LEVEL_LOADED', data.details.totalduration);
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Network error encountered, trying to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Media error encountered, trying to recover');
              hls.recoverMediaError();
              break;
            default:
              console.error('Unrecoverable error encountered, destroying HLS instance');
              hls.destroy();
              break;
          }
        }
      });

      video.addEventListener('ended', handleVideoEnd);

      return () => {
        hls.destroy();
        video.removeEventListener('ended', handleVideoEnd);
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });

      video.addEventListener('ended', handleVideoEnd);

      return () => {
        video.removeEventListener('ended', handleVideoEnd);
      };
    }
  }, [url]);

  return (
    <video 
      ref={videoRef} 
      style={{ width: '800px', height: '600px' }}
    />
  );
};

export default VideoPlayer_profile;
