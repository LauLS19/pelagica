import { getPlatform } from '@pelagica/core';
import VideoPlayer from './VideoPlayer';
import TizenVideoPlayer from './TizenVideoPlayer';
import type { VideoPlayerProps } from './types';

const PlatformVideoPlayer = (props: VideoPlayerProps) => {
    return getPlatform() === 'tizen' ? <TizenVideoPlayer {...props} /> : <VideoPlayer {...props} />;
};

export default PlatformVideoPlayer;
