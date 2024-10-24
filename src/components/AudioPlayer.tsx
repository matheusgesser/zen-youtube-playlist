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
    SpeakerHigh,
    SpeakerLow,
    SpeakerSlash,
} from '@phosphor-icons/react';
import ReactPlayer from 'react-player';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { OnProgressProps } from 'react-player/base';
import * as motion from 'framer-motion/client';
import { useWindowDimensions } from '@/lib/hooks/useWindowDimensions';
import { AudioPlayerSkeleton } from './AudioPlayerSkeleton';

type Props = {
    videoId: Playlist.Video['id'] | undefined,
    videoTitle: Playlist.Video['title'] | undefined,
    videoThumbnail: Playlist.Video['thumbnail'] | undefined,
    skipBack?: () => void,
    skipForward?: () => void,
    toggleList: () => void,
    isShuffleActive: boolean,
    toggleShuffle: () => void,
}

/** @factory */
const makeVolumeIcon = (volume: number, isMuted: boolean) => {
    if (isMuted || volume === 0)
        return <SpeakerSlash size={24} />;

    if (volume < 50)
        return <SpeakerLow size={24} />;

    return <SpeakerHigh size={24} />;
};

export const AudioPlayer = forwardRef<HTMLDivElement, Props>(({
    videoId,
    videoTitle,
    videoThumbnail,
    skipBack,
    skipForward,
    toggleList,
    isShuffleActive,
    toggleShuffle,
}: Props, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);

    const [volume, setVolume] = useState(50);
    const [isMuted, setIsMuted] = useState(false);

    const player = useRef<ReactPlayer>(null);

    const { width } = useWindowDimensions();
    const isMobile = width < 1280;

    const updateProgress = ({ playedSeconds }: OnProgressProps) => {
        const totalSeconds = player.current!.getDuration();

        const progress = ((playedSeconds * 100) / totalSeconds).toFixed(1);

        setProgress(parseFloat(progress));
    };

    const handleSeekProgress = ({ value }: SliderChangeEvent) => {
        // Prevents skipping on sliding to end
        if (value === 100)
            return;

        const sliderValue = value as number;

        player.current!.seekTo(sliderValue / 100, 'fraction');

        setProgress(sliderValue);
    };

    const toggleMuted = () => setIsMuted(prevState => !prevState);

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
                volume={isMuted ? 0 : (volume / 100)}
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

                        <div className="flex flex-col gap-6 items-center">
                            <Slider
                                value={progress}
                                onChange={handleSeekProgress}
                                className="w-[16rem] bg-neutral-800 h-1.5"
                                pt={{
                                    root: { className: 'cursor-pointer rounded-xl' },
                                    range: { className: 'cursor-pointer bg-white rounded-xl' },
                                    handle: { className: 'bg-white hover:scale-105 active:scale-105 focus:scale-105 byp-focus' },
                                }}
                            />

                            <div className="flex gap-6 items-center">
                                <button type="button" onClick={toggleShuffle} className={`p-1.5 rounded-full byp-focus byp-focus-bg ${isShuffleActive && 'bg-neutral-800'}`}>
                                    <Shuffle size={20} className="mr-[1px] mb-[1px]" />
                                </button>

                                <button type="button" disabled={skipBack === undefined} onClick={skipBack} className="byp-focus byp-focus-bg">
                                    <SkipBack size={20} color={skipBack === undefined ? '#555' : undefined} />
                                </button>

                                {isPaused ? (
                                    <button
                                        type="button"
                                        onClick={() => setIsPaused(false)}
                                        className="box-content p-2 rounded-full bg-white byp-focus"
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
                                        className="box-content p-2 rounded-full bg-white byp-focus"
                                    >
                                        <Pause
                                            size={28}
                                            color="black"
                                            weight="fill"
                                        />
                                    </button>
                                )}

                                <button type="button" disabled={skipForward === undefined} onClick={skipForward} className="byp-focus byp-focus-bg">
                                    <SkipForward size={20} color={skipForward === undefined ? '#555' : undefined} />
                                </button>

                                <button type="button" disabled={isMobile} onClick={toggleList} className="p-1.5 rounded-full byp-focus byp-focus-bg">
                                    <ListBullets size={20} color={isMobile ? '#555' : undefined} />
                                </button>
                            </div>

                            <div className="flex gap-4 items-center">
                                <button type="button" onClick={toggleMuted} className="byp-focus byp-focus-bg">
                                    {makeVolumeIcon(volume, isMuted)}
                                </button>

                                <Slider
                                    value={volume}
                                    onChange={(e) => setVolume(e.value as number)}
                                    className="w-[8rem] bg-neutral-800 h-1.5 my-2"
                                    pt={{
                                        root: { className: 'cursor-pointer rounded-xl' },
                                        range: { className: 'cursor-pointer bg-white rounded-xl' },
                                        handle: { className: 'bg-white hover:scale-105 active:scale-105 focus:scale-105 byp-focus' },
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
        </motion.div>
    );
});
