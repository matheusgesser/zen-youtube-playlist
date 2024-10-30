import { Dispatch, SetStateAction, useState } from 'react';
import { Playlist } from '@/types/Playlist';
import { PlaylistStorage } from '../storage/PlaylistStorage';

type Props = {
    playlistId: Playlist.Model['id'],
    totalVideos: number | undefined,
    currentVideoIndex: number | null,
    setCurrentVideoIndex: Dispatch<SetStateAction<number | null>>,
}

export function usePlaylistOrder({ playlistId, totalVideos, currentVideoIndex, setCurrentVideoIndex }: Props) {
    const [isShuffleActive, setIsShuffleActive] = useState(false);

    const shuffledOrder = PlaylistStorage.getShuffledOrder(playlistId);

    const previousSong = () => {
        if (isShuffleActive) {
            const currentOrderIndex = shuffledOrder.findIndex(index => index === currentVideoIndex);

            // Is first video on shuffleOrder
            if (currentOrderIndex === 0) {
                setCurrentVideoIndex(shuffledOrder[shuffledOrder.length - 1]);

                return;
            }

            setCurrentVideoIndex(shuffledOrder[currentOrderIndex - 1]);

            return;
        }

        // Is first video in the list
        if (currentVideoIndex === 0) {
            setCurrentVideoIndex((totalVideos ?? 1) - 1);

            return;
        }

        setCurrentVideoIndex(previousVideoIndex => previousVideoIndex as number - 1);
    };

    const nextSong = () => {
        if (isShuffleActive) {
            const currentOrderIndex = shuffledOrder.findIndex(index => index === currentVideoIndex);

            // Is last video on shuffleOrder
            if (currentOrderIndex === shuffledOrder.length - 1) {
                setCurrentVideoIndex(shuffledOrder[0]);

                return;
            }

            setCurrentVideoIndex(shuffledOrder[currentOrderIndex + 1]);

            return;
        }

        // Is last video in the list
        if (currentVideoIndex === (totalVideos ?? 0) - 1) {
            setCurrentVideoIndex(0);

            return;
        }

        setCurrentVideoIndex(previousVideoIndex => previousVideoIndex as number + 1);
    };

    return {
        isShuffleActive,
        setIsShuffleActive,
        previousSong,
        nextSong,
    };
}
