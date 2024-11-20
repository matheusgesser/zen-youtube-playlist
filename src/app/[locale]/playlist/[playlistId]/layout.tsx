import { AudioPlayerProvider } from '@/lib/hooks/useAudioPlayer';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

type Props = { children: ReactNode };

export const metadata: Metadata = {
    title: 'Better Youtube Playlist',
    description: 'Play Youtube playlists, with a minimalist and better performing interface',
};

export default function Layout({ children }: Props) {
    return (
        <AudioPlayerProvider>
            {children}
        </AudioPlayerProvider>
    );
}
