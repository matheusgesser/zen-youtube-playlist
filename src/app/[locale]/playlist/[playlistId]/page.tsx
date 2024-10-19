'use client'

import { PlaylistStorage } from "@/lib/storage/PlaylistHelper";
import { Toast } from 'primereact/toast'
import { getPlaylist, isServiceError } from "@/service/PlaylistService";
import { type Playlist } from "@/types/Playlist";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@phosphor-icons/react";
import { ScrollPanel } from 'primereact/scrollpanel';
import { AudioPlayer } from "@/components/AudioPlayer";
import { sleep } from "@/lib/sleep";

type Props = { params: { playlistId: string } };

export default function Playlist({ params: { playlistId } }: Props) {
    const [playlist, setPlaylist] = useState<Playlist.Model | null>(null);
    const [currentVideo, setCurrentVideo] = useState<Playlist.Video | null>(null);

    const toast = useRef<Toast>(null);

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
                    summary: 'Error',
                    detail: response.code === 404 ? 'Playlist not found' : 'Error fetching playlist',
                    life: 3000,
                });

                return;
            }

            PlaylistStorage.add(response.data);

            setPlaylist(response.data);
        }

        fetchPlaylist();
    }, []);

    console.log({ currentVideo, playlist })

    return (
        <div className="min-h-64 grid place-items-center">
            {playlist === null ? (
                <Spinner size={32} className="animate-spin">
                    teste
                </Spinner>
            ) : (
                <div className="w-full flex flex-col gap-16 lg:flex-row justify-evenly items-center">
                    <AudioPlayer
                        videoId={currentVideo?.id}
                        videoTitle={currentVideo?.title}
                        videoThumbnail={currentVideo?.thumbnail}
                        skipBack={(currentVideo?.position ?? 0) !== 0
                            ? () => setCurrentVideo(playlist?.videos.find(video => video.position === ((currentVideo?.position ?? 0) - 1))!)
                            : undefined}
                        skipForward={((currentVideo?.position ?? 0) + 1) < (playlist?.videos.length ?? 0)
                            ? () => setCurrentVideo(playlist?.videos.find(video => video.position === ((currentVideo?.position ?? 0) + 1))!)
                            : undefined}
                        key={currentVideo?.id}
                    />

                    <ScrollPanel
                        style={{ width: '500px', height: '600px' }}
                        className="px-4"
                        pt={{ content: { className: 'flex flex-col gap-2' } }}
                    >
                        {playlist?.videos.map(video => (
                            <button onClick={() => setCurrentVideo(video)} className="w-full flex gap-2 py-1.5">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <span className="text-neutral-400">{video.position + 1}.</span>

                                    <span className="text-start whitespace-nowrap overflow-hidden text-ellipsis">{video.title}</span>
                                </div>
                            </button>
                        ))}
                    </ScrollPanel>
                </div>
            )}

            <Toast ref={toast} />
        </div>
    );
}
