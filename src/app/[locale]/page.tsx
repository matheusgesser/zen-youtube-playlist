'use client';

import PlaylistInput from '@/components/PlaylistInput';
import { PlaylistList } from '@/components/PlaylistList';
import { PlaylistStorage } from '@/lib/storage/PlaylistStorage';
import { Playlist } from '@/types/Playlist';
import { useState, useEffect } from 'react';

export default function Home() {
    const [playlists, setPlaylists] = useState<Playlist.Model[]>([]);

    useEffect(() => {
        const playlists = Object.values(PlaylistStorage.getAll());

        setPlaylists(playlists);
    }, []);

    return (
        <div className="w-full self-center min-h-64 max-w-[40rem] px-6 grid place-items-center gap-8">
            <PlaylistInput />

            {playlists.length > 0 && <PlaylistList playlists={playlists} />}
        </div>
    );
}
