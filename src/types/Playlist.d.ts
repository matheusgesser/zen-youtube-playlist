export namespace Playlist {
    type Model = {
        id: string,
        title: string,
        privacyStatus: 'public' | 'unlisted' | 'private',
        videos: Video[],
        totalVideos: number,
        nextPageToken?: string,
        shuffledOrder: number[],
    }

    type Video = {
        id: string,
        title: string,
        thumbnail: string,
        originalPosition: number,
    }
}
