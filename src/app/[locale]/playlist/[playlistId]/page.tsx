'use client';

import { PlaylistStorage } from '@/lib/storage/PlaylistStorage';
import { Toast } from 'primereact/toast';
import { getPlaylist, isServiceError } from '@/service/PlaylistService';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Spinner } from '@phosphor-icons/react';
import { Button } from 'primereact/button';
import { AudioPlayer } from '@/components/AudioPlayer';
import { sleep } from '@/lib/sleep';
import * as motion from 'framer-motion/client';
import type { Playlist } from '@/types/Playlist';
import { fetchPageAndAppendVideos, makeShuffledOrder } from '@/lib/helpers/PlaylistHelper';
import { usePlaylistOrder } from '@/lib/hooks/usePlaylistOrder';
import { VideosList } from '@/components/VideosList';
import { useShortcuts } from '@/lib/hooks/useShortcuts';
import { useAudioPlayer } from '@/lib/hooks/useAudioPlayer';
import { useTranslations } from 'next-intl';
import { useWindowDimensions } from '@/lib/hooks/useWindowDimensions';

type Props = { params: { playlistId: string } };

export default function PlaylistPage({ params: { playlistId } }: Props) {
    const [playlist, setPlaylist] = useState<Playlist.Model | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(0);

    const [isListVisible, setIsListVisible] = useState(true);

    const { width } = useWindowDimensions();
    const isMobile = width < 1280;

    const toast = useRef<Toast>(null);

    const translate = useTranslations();

    const { setProgress, setIsPaused, setVolume, setIsMuted } = useAudioPlayer();

    const {
        isShuffleActive,
        setIsShuffleActive,
        nextSong,
        previousSong,
    } = usePlaylistOrder({
        playlistId,
        totalVideos: playlist?.videos.length,
        currentVideoIndex,
        setCurrentVideoIndex,
    });

    const { handleKeyDown } = useShortcuts({ setIsPaused, setVolume, setIsMuted });

    const currentVideo = (currentVideoIndex !== null && playlist?.videos)
        ? playlist.videos[currentVideoIndex]
        : null;

    const loadRemainingVideos = useCallback(async (pageToken: NonNullable<Playlist.Model['nextPageToken']>) => {
        const response = await fetchPageAndAppendVideos(playlistId, pageToken);

        if (isServiceError(response)) {
            const { code, message } = response;

            toast.current!.show({
                severity: 'error',
                summary: translate('error'),
                detail: translate('error-fetching-playlist', { code, message }),
                life: 3000,
            });

            return;
        }

        toast.current!.clear();

        const savedPlaylist = PlaylistStorage.get(playlistId);

        setPlaylist(savedPlaylist);

        const { totalVideos } = response;

        toast.current!.show({
            severity: 'success',
            summary: translate('success'),
            detail: translate('x-videos-fetched-stored', { totalVideos }),
            life: 3000,
        });
    }, [playlistId, translate]);

    const handleSetCurrentVideoIndex = (videoIndex: number) => {
        setProgress(0);
        setCurrentVideoIndex(videoIndex);
    };

    useEffect(() => {
        const fetchPlaylist = async () => {
            const savedPlaylist = PlaylistStorage.get(playlistId);

            if (savedPlaylist) {
                // Fast loading isn't always pleasant for user
                await sleep(1000);

                setPlaylist(savedPlaylist);

                // Updates playlist shuffle order to ensure randomization
                const shuffledOrder = makeShuffledOrder(savedPlaylist.videos.length);
                PlaylistStorage.setShuffledOrder(playlistId, shuffledOrder);

                return;
            }

            const response = await getPlaylist(playlistId);

            if (isServiceError(response)) {
                const { code, message } = response;

                toast.current!.show({
                    severity: 'error',
                    summary: translate('error'),
                    detail: response.code === 404
                        ? translate('playlist-not-found')
                        : translate('error-fetching-playlist', { code, message }),
                    life: 3000,
                });

                return;
            }

            PlaylistStorage.add(response.data);

            setPlaylist(response.data);

            if (response.data.totalVideos > 50 && response.data.nextPageToken) {
                const totalVideos = response.data.totalVideos - 50;

                toast.current!.show({
                    severity: 'secondary',
                    summary: translate('load-more'),
                    detail: translate('load-remaining-x-items', { totalVideos }),
                    sticky: true,
                    pt: { content: { className: 'bg-neutral-950 rounded-lg' } },
                    content: ({ message }) => (
                        <div className="flex flex-col" style={{ flex: '1' }}>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg">{message.summary}</span>
                            </div>

                            <div className="font-medium my-3">
                                {message.detail}
                            </div>

                            <Button
                                label={translate('load')}
                                onClick={() => loadRemainingVideos(response.data.nextPageToken!)}
                                className="h-8 w-[5rem] border bg-neutral-50 text-black"
                            />
                        </div>
                    ),
                });
            }
        };

        fetchPlaylist();

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playlistId, loadRemainingVideos, handleKeyDown, translate]);

    return (
        <div className="min-h-64">
            {playlist === null ? (
                <div className="w-full flex justify-center items-center h-20">
                    <Spinner size={32} className="animate-spin" />
                </div>
            ) : (
                <div className="w-full min-h-[600px] flex flex-col xl:flex-row gap-16 justify-evenly items-center">
                    <motion.div initial={false} id="audio-player" className="w-[min(24rem,100%)]">
                        <AudioPlayer
                            videoId={currentVideo?.id}
                            videoTitle={currentVideo?.title}
                            videoThumbnail={currentVideo?.thumbnail}
                            skipBack={previousSong}
                            skipForward={nextSong}
                            toggleList={() => setIsListVisible(prevState => !prevState)}
                            isShuffleActive={isShuffleActive}
                            toggleShuffle={() => setIsShuffleActive(prevState => !prevState)}
                        />
                    </motion.div>

                    <VideosList
                        isVisible={isListVisible || isMobile}
                        playlistVideos={playlist.videos}
                        currentVideoIndex={currentVideoIndex}
                        setCurrentVideoIndex={handleSetCurrentVideoIndex}
                    />
                </div>
            )}

            <Toast ref={toast} />
        </div>
    );
}
