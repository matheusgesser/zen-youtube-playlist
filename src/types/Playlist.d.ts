export namespace Playlist {
    type Model = {
        id: string,
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
