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

type Props = { params: { playlistId: string } };

export default function PlaylistPage({ params: { playlistId } }: Props) {
    const [playlist, setPlaylist] = useState<Playlist.Model | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(0);

    const [isListVisible, setIsListVisible] = useState(true);

    const toast = useRef<Toast>(null);

    const { setIsPaused, setVolume, setIsMuted } = useAudioPlayer();

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
            toast.current!.show({
                severity: 'error',
                summary: 'Error',
                detail: `Error ${response.code} fetching playlist: ${response.message}`,
                life: 3000,
            });

            return;
        }

        toast.current!.clear();

        const savedPlaylist = PlaylistStorage.get(playlistId);

        setPlaylist(savedPlaylist);

        toast.current!.show({
            severity: 'success',
            summary: 'Success!',
            detail: `All ${response.totalVideos} videos were fetched and stored`,
            life: 3000,
        });
    }, [playlistId]);

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
                toast.current!.show({
                    severity: 'error',
                    summary: 'Error!',
                    detail: response.code === 404
                        ? 'Playlist not found'
                        : `Error ${response.code} fetching playlist: ${response.message}`,
                    life: 3000,
                });

                return;
            }

            PlaylistStorage.add(response.data);

            setPlaylist(response.data);

            if (response.data.totalVideos > 50 && response.data.nextPageToken) {
                toast.current!.show({
                    severity: 'secondary',
                    summary: 'Load more',
                    detail: `Do you wanna load the remaining ${response.data.totalVideos - 50} items?`,
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
                                label="Load"
                                onClick={() => loadRemainingVideos(response.data.nextPageToken!)}
                                className="h-8 w-16 border bg-neutral-50 text-black"
                            />
                        </div>
                    ),
                });
            }
        };

        fetchPlaylist();

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playlistId, loadRemainingVideos, handleKeyDown]);

    return (
        <div className="min-h-64">
            {playlist === null ? (
                <div className="w-full flex justify-center items-center h-20">
                    <Spinner size={32} className="animate-spin" />
                </div>
            ) : (
                <div className="w-full min-h-[600px] flex flex-col xl:flex-row gap-16 justify-evenly items-center">
                    <motion.div initial={false} id="audio-player">
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
                        isVisible={isListVisible}
                        playlistVideos={playlist.videos}
                        currentVideoIndex={currentVideoIndex}
                        setCurrentVideoIndex={setCurrentVideoIndex}
                    />
                </div>
            )}

            <Toast ref={toast} />
        </div>
    );
}
