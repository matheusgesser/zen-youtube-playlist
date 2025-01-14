'use client';

import PlaylistInput from '@/components/PlaylistInput';
import { PlaylistList } from '@/components/PlaylistList';
import { PlaylistStorage } from '@/lib/storage/PlaylistStorage';
import { Playlist } from '@/types/Playlist';
import { useState, useEffect } from 'react';

const SUGGESTED_PLAYLISTS: Playlist.Model[] = [
    {
        id: 'PLtSpfhj-xSMvBCnhShC12dPJ8CDQXNisf',
        title: 'Brazilian MPB',
        privacyStatus: 'public',
        videos: Array.from({ length: 36 }) as Playlist.Video[],
        totalVideos: 36,
        shuffledOrder: [],
    },
    {
        id: 'PL7DA3D097D6FDBC02',
        title: '90\'s Hits',
        privacyStatus: 'public',
        videos: Array.from({ length: 150 }) as Playlist.Video[],
        totalVideos: 150,
        shuffledOrder: [],
    },
    {
        id: 'PL8EAA83325701CE9C',
        title: 'Classic Rock',
        privacyStatus: 'public',
        videos: Array.from({ length: 91 }) as Playlist.Video[],
        totalVideos: 91,
        shuffledOrder: [],
    },
] as const;

export default function Home() {
    const [playlists, setPlaylists] = useState<Playlist.Model[]>([]);

    // Stored playlists must NOT be listed as suggestions
    const suggestedPlaylists = SUGGESTED_PLAYLISTS
        .filter(playlist => !playlists.some(storedPlaylist => storedPlaylist.id === playlist.id));

    useEffect(() => {
        const playlists = Object.values(PlaylistStorage.getAll());

        setPlaylists(playlists);
    }, []);

    return (
        <div className="w-full self-center min-h-64 max-w-[48rem] px-6 flex flex-col gap-8">
            <PlaylistInput />

            {playlists.length > 0 && (
                <PlaylistList
                    label="Stored playlists"
                    playlists={playlists}
                />
            )}

            {suggestedPlaylists.length > 0 && (
                <PlaylistList
                    label="Suggested playlists"
                    playlists={suggestedPlaylists}
                />
            )}
        </div>
    );
}
