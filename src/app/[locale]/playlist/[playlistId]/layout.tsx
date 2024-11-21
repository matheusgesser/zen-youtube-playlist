import { AudioPlayerProvider } from '@/lib/hooks/useAudioPlayer';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

type Props = { children: ReactNode };

export const metadata: Metadata = {
    title: 'Zen Youtube Playlist',
    description: 'Minimalist player, offering a distraction-free way to enjoy your playlists',
};

export default function Layout({ children }: Props) {
    return (
        <AudioPlayerProvider>
            {children}
        </AudioPlayerProvider>
    );
}
