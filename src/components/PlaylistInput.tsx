'use client'

import { useRouter } from '@/i18n/routing';
import { MagnifyingGlass } from '@phosphor-icons/react/dist/ssr'
import { InputText } from 'primereact/inputtext'
import React, { KeyboardEvent, useState } from 'react'

export default function PlaylistInput() {
    const [playlist, setPlaylist] = useState('');

    const router = useRouter();

    const handleSearch = () => {
        if (!playlist)
            return;

        if (playlist.includes('http')) {
            const playlistId = new URL(playlist).searchParams.get('list');

            router.push(`/playlist/${playlistId}`);

            return;
        }

        router.push(`/playlist/${playlist}`);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter')
            handleSearch();
    }

    return (
        <div className='w-full max-w-[40rem] px-6 flex flex-col gap-2 sm:ml-[38px]'>
            <label htmlFor="playlist">Playlist ID or URL</label>

            <div className='w-full relative flex items-center gap-1'>
                <InputText
                    id="playlist"
                    aria-describedby="playlist-help"
                    className='w-full px-4 py-2 pr-11 bg-white text-black selection:bg-teal-200'
                    autoComplete='off'
                    value={playlist}
                    onChange={e => setPlaylist(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button onClick={handleSearch} className='p-2 absolute right-[0.25rem]'>
                    <MagnifyingGlass size={22} color='black' />
                </button>
            </div>

            <small id="playlist-help">
                The playlist must be public or non-listed
            </small>
        </div>
    )
}
