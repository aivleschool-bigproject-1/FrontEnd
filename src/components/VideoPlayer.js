import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import './CCTVGrid_ex.css'; 

const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let hls;

    const handleInteraction = () => {
      video.play().catch((error) => {
        console.error('Error attempting to play video:', error);
      });
    };

    if (Hls.isSupported()) {
      hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 5,
        lowLatencyMode: true,
        maxLiveSyncPlaybackRate: 1.5,
        enableWorker: true,
        debug: true,
      });

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('keydown', handleInteraction, { once: true });
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

      return () => {
        if (hls) {
          hls.destroy();
        }
        document.removeEventListener('click', handleInteraction);
        document.removeEventListener('keydown', handleInteraction);
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.autoplay = true;
      video.addEventListener('loadedmetadata', () => {
        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('keydown', handleInteraction, { once: true });
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, [url]);

  return <video ref={videoRef} className="video-player" />;
};

export default VideoPlayer;
