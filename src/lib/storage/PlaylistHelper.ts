import { Playlist } from "@/types/Playlist";

const getAll = () => {
    const playlists = window.localStorage.getItem('playlists');

    if (!playlists) {
        window.localStorage.setItem('playlists', JSON.stringify({}));

        return {};
    }

    const parsedPlaylists: Record<Playlist.Model['id'], Playlist.Model> = JSON.parse(playlists);

    return parsedPlaylists;
};

const get = (playlistId: string) => {
    const playlists = getAll();

    const matchingPlaylist = playlists[playlistId];

    if (!matchingPlaylist)
        return null;

    return matchingPlaylist;
};

const add = (playlist: Playlist.Model) => {
    const playlists = getAll();

    if (playlists[playlist.id] !== undefined)
        throw new Error(`The playlist ${playlist.id} already exists`);

    playlists[playlist.id] = playlist;

    window.localStorage.setItem('playlists', JSON.stringify(playlists));
};

const addVideos = (playlistId: string, videos: Playlist.Model['videos']) => {
    const playlists = getAll();

    const savedPlaylist = playlists[playlistId];

    if (!savedPlaylist)
        throw new Error(`The playlist ${playlistId} doesn't exists`);

    savedPlaylist.videos = [...savedPlaylist.videos, ...videos];

    window.localStorage.setItem('playlists', JSON.stringify(playlists));
};

export const PlaylistStorage = {
    getAll,
    get,
    add,
    addVideos,
}