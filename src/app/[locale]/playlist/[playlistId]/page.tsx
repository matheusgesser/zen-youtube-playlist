'use client';

import { PlaylistStorage } from '@/lib/storage/PlaylistStorage';
import { Toast } from 'primereact/toast';
import { getPlaylist, isServiceError } from '@/service/PlaylistService';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Spinner } from '@phosphor-icons/react';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Button } from 'primereact/button';
import { AudioPlayer } from '@/components/AudioPlayer';
import { sleep } from '@/lib/sleep';
import * as motion from 'framer-motion/client';
import { AnimatePresence } from 'framer-motion';
import type { Playlist } from '@/types/Playlist';
import { fetchPageAndAppendVideos } from '@/lib/helpers/PlaylistHelper';

type Props = { params: { playlistId: string } };

const getRandomVideoIndex = (currentIndex: number, totalVideos: number) => {
    const randomIndex = Math.round(Math.random() * totalVideos);

    if (randomIndex === currentIndex)
        return getRandomVideoIndex(currentIndex, totalVideos);

    return randomIndex;
};

export default function PlaylistPage({ params: { playlistId } }: Props) {
    const [playlist, setPlaylist] = useState<Playlist.Model | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(0);

    const [isShuffleActive, setIsShuffleActive] = useState(false);
    const [isListVisible, setIsListVisible] = useState(true);

    const toast = useRef<Toast>(null);

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

    const previousSong = () => {
        setCurrentVideoIndex(previousVideoIndex => previousVideoIndex as number - 1);
    };

    const nextSong = () => {
        if (isShuffleActive) {
            const randomIndex = getRandomVideoIndex(currentVideoIndex!, playlist?.videos.length ?? 0);

            setCurrentVideoIndex(randomIndex);

            return;
        }

        setCurrentVideoIndex(previousVideoIndex => previousVideoIndex as number + 1);
    };

    useEffect(() => {
        const fetchPlaylist = async () => {
            const savedPlaylist = PlaylistStorage.get(playlistId);

            if (savedPlaylist) {
                // Fast loading isn't always pleasant for user
                await sleep(1000);

                setPlaylist(savedPlaylist);

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
    }, [playlistId, loadRemainingVideos]);

    return (
        <div className="min-h-64 grid place-items-center">
            {playlist === null ? (
                <Spinner size={32} className="animate-spin" />
            ) : (
                <div className="w-full min-h-[600px] flex flex-col gap-16 xl:flex-row justify-evenly items-center">
                    <motion.div initial={false} id="audio-player">
                        <AudioPlayer
                            videoId={currentVideo?.id}
                            videoTitle={currentVideo?.title}
                            videoThumbnail={currentVideo?.thumbnail}
                            skipBack={currentVideoIndex !== null && currentVideoIndex !== 0 && !isShuffleActive
                                ? previousSong
                                : undefined}
                            skipForward={currentVideoIndex !== null && playlist.videos !== null && (currentVideoIndex < (playlist.videos.length - 1))
                                ? nextSong
                                : undefined}
                            toggleList={() => setIsListVisible(prevState => !prevState)}
                            isShuffleActive={isShuffleActive}
                            toggleShuffle={() => setIsShuffleActive(prevState => !prevState)}
                        />
                    </motion.div>

                    <AnimatePresence mode="popLayout">
                        {isListVisible ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <ScrollPanel
                                    style={{ width: '500px', height: '600px' }}
                                    className="px-4"
                                    pt={{ content: { className: 'flex flex-col gap-2' } }}
                                >
                                    {playlist?.videos.map((video, index) => (
                                        <button type="button" onClick={() => setCurrentVideoIndex(index)} className={`w-full flex gap-2 px-2 py-1.5 rounded-lg ${index === currentVideoIndex && 'bg-neutral-800'}`}>
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <span className="text-neutral-400">
                                                    {index === currentVideoIndex ? (
                                                        <Play size={16} color="white" weight="fill" className="ml-0.5 mr-1" />
                                                    ) : (
                                                        `${index + 1}.`
                                                    )}
                                                </span>
                                                <span className="text-start whitespace-nowrap overflow-hidden text-ellipsis">{video.title}</span>
                                            </div>
                                        </button>
                                    ))}
                                </ScrollPanel>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div>
            )}

            <Toast ref={toast} />
        </div>
    );
}
