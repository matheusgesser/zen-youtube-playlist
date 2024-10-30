import { Playlist } from '@/types/Playlist';
import { makeShuffledOrder } from '../helpers/PlaylistHelper';

const getAll = () => {
    const playlists = window.localStorage.getItem('playlists');

    if (!playlists) {
        window.localStorage.setItem('playlists', JSON.stringify({}));

        return {};
    }

    const parsedPlaylists: Record<Playlist.Model['id'], Playlist.Model> = JSON.parse(playlists);

    return parsedPlaylists;
};

const get = (playlistId: Playlist.Model['id']) => {
    const playlists = getAll();

    const matchingPlaylist = playlists[playlistId];

    if (!matchingPlaylist)
        return null;

    return matchingPlaylist;
};

const getShuffledOrder = (playlistId: Playlist.Model['id']): number[] => {
    const playlists = getAll();

    const savedPlaylist = playlists[playlistId];

    if (!savedPlaylist)
        return [];

    return savedPlaylist.shuffledOrder;
};

const setShuffledOrder = (playlistId: Playlist.Model['id'], order: number[]) => {
    const playlists = getAll();

    const savedPlaylist = playlists[playlistId];

    if (!savedPlaylist)
        throw new Error(`The playlist ${playlistId} doesn't exists`);

    savedPlaylist.shuffledOrder = order;

    window.localStorage.setItem('playlists', JSON.stringify(playlists));
};

const add = (playlist: Playlist.Model) => {
    const playlists = getAll();

    if (playlists[playlist.id] !== undefined)
        return;

    const shuffledOrder = makeShuffledOrder(playlist.videos.length);

    playlists[playlist.id] = { ...playlist, shuffledOrder };

    window.localStorage.setItem('playlists', JSON.stringify(playlists));
};

const addVideos = (playlistId: Playlist.Model['id'], videos: Playlist.Model['videos']) => {
    const playlists = getAll();

    const savedPlaylist = playlists[playlistId];

    if (!savedPlaylist)
        throw new Error(`The playlist ${playlistId} doesn't exists`);

    savedPlaylist.videos = [...savedPlaylist.videos, ...videos];

    const shuffledOrder = makeShuffledOrder(savedPlaylist.videos.length + videos.length);
    savedPlaylist.shuffledOrder = shuffledOrder;

    window.localStorage.setItem('playlists', JSON.stringify(playlists));
};

export const PlaylistStorage = {
    getAll,
    get,
    add,
    addVideos,
    getShuffledOrder,
    setShuffledOrder,
};
