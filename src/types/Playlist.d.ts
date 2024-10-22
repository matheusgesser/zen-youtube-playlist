export namespace Playlist {
    type Model = {
        id: string,
        videos: Video[],
        totalVideos: number,
        nextPageToken?: string,
    }

    type Video = {
        id: string,
        title: string,
        thumbnail: string,
        originalPosition: number,
    }
}
