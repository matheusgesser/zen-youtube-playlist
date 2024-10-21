import { Playlist } from "@/types/Playlist";
import { Service } from "@/types/Service";

export const isServiceError = <T extends object>(response: T | Service.Error): response is Service.Error => "code" in response;

export const getPlaylist = async (playlistId: string, pageToken?: string): Promise<{ data: Playlist.Model } | Service.Error> => {
    const params = new URLSearchParams({ pageToken: pageToken ?? '' });

    const route = `/api/playlist/${playlistId}?${params.toString()}`;

    const response = await fetch(route).then(response => response.json());

    return response;
}