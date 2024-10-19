import { PlaylistResponse } from "@/types/PlaylistResponse";
import type { NextRequest } from "next/server";

type Params = { params: { playlistId: string } };

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

    const response = await fetch(url);

    const data: PlaylistResponse.Model | Error = await response.json();

    return Response.json({ data });
}