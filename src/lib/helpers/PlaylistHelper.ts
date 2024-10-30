import { getPlaylist, isServiceError } from '@/service/PlaylistService';
import { type Playlist } from '@/types/Playlist';
import { type Service } from '@/types/Service';
import { PlaylistStorage } from '../storage/PlaylistStorage';

export const fetchPageAndAppendVideos = async (
    playlistId: Playlist.Model['id'],
    pageToken: NonNullable<Playlist.Model['nextPageToken']>,
): Promise<Service.Error | { totalVideos: number }> => {
    const response = await getPlaylist(playlistId, pageToken);

    if (isServiceError(response))
        return response;

    PlaylistStorage.addVideos(response.data.id, response.data.videos);

    if (response.data.nextPageToken)
        return fetchPageAndAppendVideos(playlistId, response.data.nextPageToken);

    const { totalVideos } = response.data;

    return { totalVideos };
};

// Fisher-Yates algorithm
const shuffleArray = (array: any[]) => {
    const arrayClone = [...array];
    let oldElement;

    for (let i = arrayClone.length - 1; i > 0; i -= 1) {
        const randomPosition = Math.floor(Math.random() * (i + 1));

        // Swap elements in the cloned array
        oldElement = arrayClone[i];
        arrayClone[i] = arrayClone[randomPosition];
        arrayClone[randomPosition] = oldElement;
    }

    return arrayClone;
};

/** @factory */
export const makeShuffledOrder = (totalVideos: number) => {
    const list = Array.from({ length: totalVideos }).map((_, index) => index);

    // Shuffles the list
    const shuffledList = shuffleArray(list);

    return shuffledList;
};
