import type { NextRequest } from "next/server";
import { PlaylistItem } from "./PlaylistItemResponse";
import { Playlist } from "@/types/Playlist";

type Params = { params: { playlistId: string } };

export const isError = (data: PlaylistItem.Response | PlaylistItem.Error): data is PlaylistItem.Error => (Object.keys(data).includes('error'));

export async function GET(request: NextRequest, { params }: Params) {
    const { playlistId } = params;

    const pageToken = new URL(request.url).searchParams.get('pageToken');

    const urlParams = new URLSearchParams({
        part: 'snippet',
        maxResults: '50',
        playlistId,
        key: process.env.API_KEY,
    });

    if (pageToken)
        urlParams.set('pageToken', pageToken);

    const url = `https://www.googleapis.com/youtube/v3/playlistItems?${urlParams.toString()}`;

    const response: PlaylistItem.Response | PlaylistItem.Error = await fetch(url).then(response => response.json());

    if (isError(response)) {
        const { code, message } = response.error;

        return Response.json({ code, message });
    }

    const formattedData: Playlist.Model = {
        id: playlistId,
        totalVideos: response.pageInfo.totalResults,
        videos: response.items.map(({ snippet: { resourceId, title, position, thumbnails } }) => ({
            id: resourceId.videoId,
            title,
            position,
            thumbnail: thumbnails.high.url,
        })),
    }

    return Response.json({ data: formattedData });
}