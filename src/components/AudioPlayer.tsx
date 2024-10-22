import { Playlist } from '@/types/Playlist';
import {
    CSSProperties, forwardRef, useEffect, useRef, useState,
} from 'react';
import {
    ListBullets,
    Pause,
    Play,
    Shuffle,
    SkipBack,
    SkipForward,
} from '@phosphor-icons/react';
import ReactPlayer from 'react-player';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { OnProgressProps } from 'react-player/base';
import * as motion from 'framer-motion/client';
import { AudioPlayerSkeleton } from './AudioPlayerSkeleton';

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
        animation: `spin 30s linear infinite normal none ${isPaused ? 'paused' : 'running'}`,
        transition: 'transform 2s linear',
    };

    useEffect(() => {
        setIsLoaded(false);
        setIsPaused(false);
    }, [videoId]);

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

            {!isLoaded
                ? <AudioPlayerSkeleton />
                : (
                    <>
                        <span className="max-w-[28rem] text-xl text-center">
                            {videoTitle}
                        </span>

                        <div className="relative size-[12rem] rounded-full bg-neutral-800 animation-pulse" style={thumbnailStyles} />

                        <div className="flex flex-col gap-4 items-center">
                            <Slider
                                value={progress}
                                onChange={handleSeekProgress}
                                className="w-[16rem] bg-neutral-800 h-1.5"
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

                                <button type="button" disabled={skipBack === undefined} onClick={skipBack}>
                                    <SkipBack size={20} color={skipBack === undefined ? '#555' : undefined} />
                                </button>

                                {isPaused ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsPaused(false)}
                                        className="box-content p-2 rounded-full bg-white"
                                    >
                                        <Play
                                            size={28}
                                            color="black"
                                            weight="fill"
                                        />
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsPaused(true)}
                                        className="box-content p-2 rounded-full bg-white"
                                    >
                                        <Pause
                                            size={28}
                                            color="black"
                                            weight="fill"
                                        />
                                    </button>
                                )}

                                <button type="button" disabled={skipForward === undefined} onClick={skipForward}>
                                    <SkipForward size={20} color={skipForward === undefined ? '#555' : undefined} />
                                </button>

                                <button type="button" onClick={toggleList}>
                                    <ListBullets size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
        </motion.div>
    );
});
