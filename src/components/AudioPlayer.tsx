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
import { useAudioPlayer } from '@/lib/hooks/useAudioPlayer';
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

    const player = useRef<ReactPlayer>(null);

    const isFirstRender = useRef(false);

    const {
        progress,
        setProgress,

        isPaused,
        setIsPaused,

        volume,
        setVolume,
        isMuted,
        setIsMuted,
    } = useAudioPlayer();

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

    const handleSkipBack = () => {
        setProgress(0);
        skipBack?.();
    };

    const handleSkipForward = () => {
        setProgress(0);
        skipForward?.();
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
        player.current?.forceUpdate();
    }, [videoId, setIsPaused]);

    return (
        <motion.div ref={ref} layout className="flex flex-col gap-6 items-center">
            <ReactPlayer
                playing={!isPaused}
                url={`https://www.youtube.com/watch?v=${videoId}`}
                ref={player}
                controls={false}
                onError={handleSkipForward}
                volume={isMuted ? 0 : (volume / 100)}
                onReady={() => {
                    setIsLoaded(true);

                    if (!isFirstRender)
                        return;

                    // We need this approach to prevent paused player on first render
                    setIsPaused(false);

                    isFirstRender.current = false;
                }}
                onEnded={skipForward}
                onProgress={updateProgress}
                style={{ display: 'none', visibility: 'hidden' }}
            />

            {!isLoaded
                ? <AudioPlayerSkeleton />
                : (
                    <>
                        <div className="grid place-items-center">
                            <span className="px-2 max-w-[min(24rem,100%)] text-xl text-center line-clamp-3">
                                {videoTitle}
                            </span>
                        </div>

                        <div className="relative size-[12rem] rounded-full bg-neutral-800" style={thumbnailStyles} />

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

                                <button type="button" disabled={skipBack === undefined} onClick={handleSkipBack} className="byp-focus byp-focus-bg">
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

                                <button type="button" disabled={skipForward === undefined} onClick={handleSkipForward} className="byp-focus byp-focus-bg">
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
                                    value={isMuted ? 0 : volume}
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
