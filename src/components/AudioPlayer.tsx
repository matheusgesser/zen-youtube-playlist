import { Playlist } from '@/types/Playlist';
import { CSSProperties, forwardRef, useRef, useState } from 'react';
import {
    ListBullets, Pause, Play, Shuffle, SkipBack, SkipForward, Spinner,
} from '@phosphor-icons/react';
import ReactPlayer from 'react-player';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { OnProgressProps } from 'react-player/base';
import * as motion from 'framer-motion/client';

type Props = {
    videoId: Playlist.Video['id'] | undefined,
    videoTitle: Playlist.Video['title'] | undefined,
    videoThumbnail: Playlist.Video['thumbnail'] | undefined,
    skipBack?: () => void,
    skipForward?: () => void,
    toggleList: () => void,
}

export const AudioPlayer = forwardRef<HTMLDivElement, Props>(({
    videoId,
    videoTitle,
    videoThumbnail,
    skipBack,
    skipForward,
    toggleList,
}: Props, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const player = useRef<ReactPlayer>(null);

    const updateProgress = ({ playedSeconds }: OnProgressProps) => {
        const totalSeconds = player.current!.getDuration();

        const progress = ((playedSeconds * 100) / totalSeconds).toFixed(1);

        setProgress(parseFloat(progress));
    };

    const handleSeekProgress = ({ value }: SliderChangeEvent) => {
        const sliderValue = value as number;

        player.current!.seekTo(sliderValue / 100, 'fraction');

        setProgress(sliderValue);
    };

    const thumbnailStyles: CSSProperties = {
        backgroundImage: `url(${videoThumbnail})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '180% 140%',
        animation: `spin 30s linear infinite normal none ${!isLoaded || isPaused ? 'paused' : 'running'}`,
        transition: 'transform 2s linear',
    };

    return (
        <motion.div ref={ref} layout className="min-w-[28rem] flex flex-col gap-6 items-center">
            <ReactPlayer
                playing={!isPaused}
                url={`https://www.youtube.com/watch?v=${videoId}`}
                ref={player}
                controls={false}
                volume={0.1}
                onReady={() => setIsLoaded(true)}
                onEnded={skipForward}
                onProgress={updateProgress}
                style={{ display: 'none', visibility: 'hidden' }}
            />

            <span className={`max-w-[28rem] text-xl text-center ${!isLoaded && 'text-[#555]'}`}>
                {videoTitle}
            </span>

            <div className="relative size-[12rem] rounded-full bg-neutral-800 animation-pulse" style={thumbnailStyles}>
                {!isLoaded && (
                    <div className="absolute top-[40%] left-1/2 -translate-x-1/2">
                        <Spinner size={32} color="white" fontWeight={400} className="animate-spin" />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4 items-center">
                <Slider
                    value={progress}
                    onChange={handleSeekProgress}
                    className="w-[16rem] bg-neutral-800 h-1.5"
                    disabled={!isLoaded}
                    pt={{
                        root: { className: 'rounded-xl' },
                        range: { className: 'bg-white rounded-xl' },
                        handle: { className: 'bg-white' },
                    }}
                />

                <div className="flex gap-6 items-center">
                    <button type="button" disabled title="Soon">
                        <Shuffle size={20} color="#555" />
                    </button>

                    <button type="button" disabled={!isLoaded || skipBack === undefined} onClick={skipBack}>
                        <SkipBack size={20} color={!isLoaded || skipBack === undefined ? '#555' : undefined} />
                    </button>

                    {isPaused ? (
                        <button
                            type="button"
                            onClick={() => setIsPaused(false)}
                            className={`box-content p-2 rounded-full ${isLoaded ? 'bg-white' : 'bg-[#888]'}`}
                            disabled={!isLoaded}
                        >
                            <Play
                                size={28}
                                color={isLoaded ? 'black' : '#555'}
                                weight="fill"
                            />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => setIsPaused(true)}
                            className={`box-content p-2 rounded-full ${isLoaded ? 'bg-white' : 'bg-[#888]'}`}
                            disabled={!isLoaded}
                        >
                            <Pause
                                size={28}
                                color={isLoaded ? 'black' : '#555'}
                                weight="fill"
                            />
                        </button>
                    )}

                    <button type="button" disabled={!isLoaded || skipForward === undefined} onClick={skipForward}>
                        <SkipForward size={20} color={!isLoaded || skipForward === undefined ? '#555' : undefined} />
                    </button>

                    <button type="button" disabled={!isLoaded} onClick={toggleList}>
                        <ListBullets size={20} color={!isLoaded ? '#555' : undefined} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
});
