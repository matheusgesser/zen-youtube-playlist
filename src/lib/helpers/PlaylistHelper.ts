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
