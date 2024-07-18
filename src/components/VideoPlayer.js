import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    let hls;

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

      return () => {
        if (hls) {
          hls.destroy();
        }
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.autoplay = true;
      video.addEventListener('loadedmetadata', () => {
        video.play();
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url]);

  return <video ref={videoRef} style={{ width: '1000px' }} controls />;

};

export default VideoPlayer;



