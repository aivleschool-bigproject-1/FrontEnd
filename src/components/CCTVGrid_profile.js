import React from 'react';
import './CCTVGrid_profile.css';
import VideoPlayer_profile from './VideoPlayer_profile';

const CCTVGrid_profile = () => {
  const videoSource = 'https://boda-ts-bucket.s3.amazonaws.com/facecam-output/playlist.m3u8';

  return (
    <div className="grid-container-profile">
      <VideoPlayer_profile url={videoSource} />
    </div>
  );
};

export default CCTVGrid_profile;
