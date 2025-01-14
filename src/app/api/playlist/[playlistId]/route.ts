import type { NextRequest } from 'next/server';
import { Playlist } from '@/types/Playlist';
import { PlaylistItem as PlaylistItemResponse } from './PlaylistItemResponse';
import { Playlist as PlaylistResponse } from './PlaylistResponse';

type Params = { params: { playlistId: string } };

const isPlaylistError = (data: PlaylistResponse.Response | PlaylistResponse.Error): data is PlaylistResponse.Error => ('error' in data);
const isPlaylistItemError = (data: PlaylistItemResponse.Response | PlaylistItemResponse.Error): data is PlaylistItemResponse.Error => ('error' in data);

export async function GET(request: NextRequest, { params }: Params) {
    const { playlistId } = params;

    const pageToken = new URL(request.url).searchParams.get('pageToken');

    const playlistURLParams = new URLSearchParams({
        part: 'snippet,status',
        maxResults: '50',
        id: playlistId,
        key: process.env.API_KEY,
    });

    const playlistURL = `https://www.googleapis.com/youtube/v3/playlists?${playlistURLParams.toString()}`;

    const playlistResponse: PlaylistResponse.Response | PlaylistResponse.Error = await fetch(playlistURL)
        .then(response => response.json());

    if (isPlaylistError(playlistResponse)) {
        const { code, message } = playlistResponse.error;

        return Response.json({ code, message });
    }

    const { items } = playlistResponse;
    const [fetchedPlaylist] = items;

    const playlistItemsURLParams = new URLSearchParams({
        part: 'snippet',
        maxResults: '50',
        playlistId,
        key: process.env.API_KEY,
    });

    if (pageToken)
        playlistItemsURLParams.set('pageToken', pageToken);

    const playlistItemsURL = `https://www.googleapis.com/youtube/v3/playlistItems?${playlistItemsURLParams.toString()}`;

    const playlistItemsResponse: PlaylistItemResponse.Response | PlaylistItemResponse.Error = await fetch(playlistItemsURL)
        .then(response => response.json());

    if (isPlaylistItemError(playlistItemsResponse)) {
        const { code, message } = playlistItemsResponse.error;

        return Response.json({ code, message });
    }

    // Exclude private and deleted videos
    const filteredVideos = playlistItemsResponse.items
        .filter(({ snippet: { title } }) => title !== 'Private video' && title !== 'Deleted video');

    const formattedData: Playlist.Model = {
        id: playlistId,
        title: fetchedPlaylist.snippet.title,
        privacyStatus: fetchedPlaylist.status.privacyStatus,
        totalVideos: playlistItemsResponse.pageInfo.totalResults,
        videos: filteredVideos.map(({ snippet: { resourceId, title, position, thumbnails } }) => ({
            id: resourceId.videoId,
            title,
            originalPosition: position,
            thumbnail: thumbnails?.high?.url ?? thumbnails?.medium?.url ?? thumbnails?.default?.url,
        })),
        shuffledOrder: [],
        nextPageToken: playlistItemsResponse.nextPageToken,
    };

    return Response.json({ data: formattedData });
}
