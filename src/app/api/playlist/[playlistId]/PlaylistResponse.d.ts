export namespace Playlist {
    type Response = {
        /**
         * Etag of this resource.
         */
        etag: string,
        items: Playlist.Item[],
        /**
         * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItemListResponse". Etag of this resource.
         */
        kind: 'youtube#playlistListResponse',
        /**
         * General pagination information.
         */
        pageInfo: {
            totalResults: number,
            resultsPerPage: number,
        },
    }

    type Item = {
        /**
         * Etag of this resource.
         */
        etag: string,
        id: string,
        /**
         * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItemListResponse". Etag of this resource.
         */
        kind: 'youtube#playlist',
        /**
         * The snippet object contains basic details about the playlist item, such as its title and position in the playlist.
         */
        snippet: PlaylistSnippet,
        status: {
            privacyStatus: 'public' | 'unlisted' | 'private',
            podcastStatus: 'enabled' | 'disabled' | 'unspecified',
        },
    }

    type PlaylistSnippet = {
        /**
         * The ID that YouTube uses to uniquely identify the user that added the item to the playlist.
         */
        channelId: string;
        /**
         * Channel title for the channel that the playlist item belongs to.
         */
        channelTitle: string;
        defaultLanguage: string,
        /**
         * The item's description.
         */
        description: string;
        localized: {
            title: string,
            description: string,
        }
        /**
         * The ID that YouTube uses to uniquely identify thGe playlist that the playlist item is in.
         */
        playlistId: string;
        /**
         * The date and time that the item was added to the playlist.
         */
        publishedAt: string;
        /**
         * A map of thumbnail images associated with the playlist item. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
         */
        thumbnails: Record<'default' | 'medium' | 'high' | 'standard' | 'maxres', {
            url: string,
            width: number,
            height: number,
        }>;
        /**
         * The playlist's title.
         */
        title: string;
    }

    type Error = {
        error: {
            code: number,
            message: string,
            errors: Array<{
                message: string,
                domain: string,
                reason: string,
                location: string,
                locationType: string,
            }>
        }
    }
}
