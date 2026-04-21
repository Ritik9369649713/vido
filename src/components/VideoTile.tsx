import React, { useEffect, useRef, useState } from 'react';
import { VideoItem, VideoSourceType } from '../types';

interface VideoTileProps {
  video: Partial<VideoItem> & { url: string; type: VideoSourceType; id: string };
  minimal?: boolean;
}

export const VideoTile = React.memo(({ video, minimal }: VideoTileProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (video.type === 'mp4' && videoRef.current) {
      if (video.isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
      videoRef.current.muted = video.isMuted ?? true;
      videoRef.current.loop = video.isLooping ?? true;
      videoRef.current.volume = video.volume ?? 0.5;
    }
  }, [video.isPlaying, video.isMuted, video.isLooping, video.volume, video.type, video.url]);

  const getYoutubeEmbedUrl = (url: string) => {
    let videoId = '';
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/gi;
    const match = regex.exec(url);
    if (match && match[1]) {
      videoId = match[1];
    }
    return `https://www.youtube.com/embed/${videoId}?autoplay=${video.isPlaying ? 1 : 0}&mute=${video.isMuted ? 1 : 0}&loop=${video.isLooping ? 1 : 0}${video.isLooping ? `&playlist=${videoId}` : ''}&controls=0&modestbranding=1&iv_load_policy=3&rel=0`;
  };

  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
      {video.type === 'mp4' ? (
        <video
          ref={videoRef}
          src={video.url}
          className="w-full h-full object-cover"
          playsInline
          muted={video.isMuted ?? true}
          loop={video.isLooping ?? true}
          autoPlay={video.isPlaying ?? true}
          onError={() => setIsValid(false)}
        />
      ) : (
        <iframe
          src={getYoutubeEmbedUrl(video.url)}
          className="w-full h-full border-0 pointer-events-none scale-105"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
        />
      )}
      {!isValid && <div className="absolute inset-0 bg-black flex items-center justify-center text-[10px] text-zinc-800 font-mono">ERR_STREAM</div>}
    </div>
  );
});

VideoTile.displayName = 'VideoTile';
