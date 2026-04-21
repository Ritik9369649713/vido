export type VideoSourceType = 'youtube' | 'mp4';

export interface VideoItem {
  id: string;
  url: string;
  title: string;
  type: VideoSourceType;
  isMuted: boolean;
  isPlaying: boolean;
  isLooping: boolean;
  volume: number;
}

export interface VideoLayout {
  id: string;
  name: string;
  videos: VideoItem[];
  createdAt: number;
}

export interface GlobalState {
  playAll: boolean;
  muteAll: boolean;
  loopAll: boolean;
}
