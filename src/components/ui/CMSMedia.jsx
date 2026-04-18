import React from 'react';
import VideoPlayer from './VideoPlayer';
import { formatImgUrl } from '../../utils/formatters';

const CMSMedia = ({ mediaType, mediaUrl, fallbackImg, className = "w-full h-full object-cover" }) => {
  const url = formatImgUrl(mediaUrl || fallbackImg);

  if (!url) return null;

  if (mediaType === 'video') {
    return (
      <VideoPlayer 
        src={url}
        className={className}
        autoPlay={true}
        loop={true}
      />
    );
  }

  return (
    <img
      src={url}
      className={className}
      alt="Media Content"
      onError={(e) => {
        if (fallbackImg && e.target.src !== fallbackImg) {
          e.target.src = fallbackImg;
        }
      }}
    />
  );
};

export default CMSMedia;
