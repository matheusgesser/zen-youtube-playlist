'use client'

import { PlaylistStorage } from "@/lib/storage/PlaylistHelper";
import { Toast } from 'primereact/toast'
import { getPlaylist, isServiceError } from "@/service/PlaylistService";
import { type Playlist } from "@/types/Playlist";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@phosphor-icons/react";
import { ScrollPanel } from 'primereact/scrollpanel';
import { Button } from 'primereact/button';
import { AudioPlayer } from "@/components/AudioPlayer";
import { sleep } from "@/lib/sleep";
import * as motion from "framer-motion/client"
import { AnimatePresence } from "framer-motion";

type Props = { params: { playlistId: string } };

export default function Playlist({ params: { playlistId } }: Props) {
    const [playlist, setPlaylist] = useState<Playlist.Model | null>(null);
    const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(null);

    const [isListVisible, setIsListVisible] = useState(true);

    const currentVideo = (currentVideoIndex !== null && playlist?.videos)
        ? playlist.videos[currentVideoIndex]
        : null;

    const toast = useRef<Toast>(null);

    const loadRemainingVideos = async (pageToken: NonNullable<Playlist.Model['nextPageToken']>) => {
        const fetchPageAndAppendVideos = async (pageToken: NonNullable<Playlist.Model['nextPageToken']>) => {
            const response = await getPlaylist(playlistId, pageToken);

            if (isServiceError(response)) {
                toast.current!.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Error fetching playlist: ${response.message}`,
                    life: 3000,
                });

                return;
            }

            PlaylistStorage.addVideos(response.data.id, response.data.videos);

            if (response.data.nextPageToken) {
                fetchPageAndAppendVideos(response.data.nextPageToken);

                return;
            }

            toast.current!.clear();

            const savedPlaylist = PlaylistStorage.get(playlistId);

            setPlaylist(savedPlaylist);

            toast.current!.show({
                severity: 'success',
                summary: 'Success!',
                detail: `All ${response.data.totalVideos} videos were fetched and stored`,
                life: 3000,
            });
        }

        fetchPageAndAppendVideos(pageToken);
    }

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
                    detail: response.code === 404 ? 'Playlist not found' : `Error fetching playlist: ${response.message}`,
                    life: 3000,
                });

                return;
            }

            PlaylistStorage.add(response.data);

            setPlaylist(response.data);

            if (response.data.totalVideos > 50 && response.data.nextPageToken)
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
                    )
                });
        }

        fetchPlaylist();
    }, []);

    return (
        <div className="min-h-64 grid place-items-center">
            {playlist === null ? (
                <Spinner size={32} className="animate-spin" />
            ) : (
                <div className="w-full min-h-[600px] flex flex-col gap-16 lg:flex-row justify-evenly items-center">
                    <motion.div initial={false} id="audio-player">
                        <AudioPlayer
                            videoId={currentVideo?.id}
                            videoTitle={currentVideo?.title}
                            videoThumbnail={currentVideo?.thumbnail}
                            skipBack={currentVideoIndex !== null && currentVideoIndex !== 0
                                ? () => setCurrentVideoIndex(previousVideoIndex => previousVideoIndex as number + 1)
                                : undefined}
                            skipForward={currentVideoIndex !== null && playlist.videos !== null && (currentVideoIndex < (playlist.videos.length - 1))
                                ? () => setCurrentVideoIndex(previousVideoIndex => previousVideoIndex as number - 1)
                                : undefined}
                            toggleList={() => setIsListVisible(prevState => !prevState)}
                            key={currentVideoIndex}
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
                                        <button onClick={() => setCurrentVideoIndex(index)} className="w-full flex gap-2 py-1.5">
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <span className="text-neutral-400">{index + 1}.</span>
                                                <span className="text-start whitespace-nowrap overflow-hidden text-ellipsis">{video.title}</span>
                                            </div>
                                        </button>
                                    ))}
                                </ScrollPanel>
                            </motion.div>
                        ) : null}
                    </AnimatePresence>
                </div >
            )
            }

            <Toast ref={toast} />
        </div >
    );
}