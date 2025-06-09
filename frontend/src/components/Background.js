import React from 'react';
import './Background.css';
import farmVideo from '../assets/BackgroundVideo.mp4';

function BackgroundVideo() {
  return (
    <div className="video-background">
      <video autoPlay muted loop>
        <source src={farmVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default BackgroundVideo;
