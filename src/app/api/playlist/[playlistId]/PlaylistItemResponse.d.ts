export namespace PlaylistItem {
    type Response = {
        /**
         * Etag of this resource.
         */
        etag: string,
        /**
         * A list of playlist items that match the request criteria.
         */
        items: Item[],
        /**
         * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItemListResponse". Etag of this resource.
         */
        kind: 'youtube#playlistItemListResponse',
        /**
         * The token that can be used as the value of the pageToken parameter to retrieve the next page in the result set.
         */
        nextPageToken?: string,
        /**
         * General pagination information.
         */
        pageInfo: {
            totalResults: number,
            resultsPerPage: number,
        },
        /**
         * The token that can be used as the value of the pageToken parameter to retrieve the previous page in the result set.
         */
        prevPageToken?: string,
    }

    type Item = {
        /**
         * Etag of this resource.
         */
        etag: string;
        /**
         * The ID that YouTube uses to uniquely identify the playlist item.
         */
        id: string;
        /**
         * Identifies what kind of resource this is. Value: the fixed string "youtube#playlistItem".
         */
        kind: string;
        /**
         * The snippet object contains basic details about the playlist item, such as its title and position in the playlist.
         */
        snippet: PlaylistItemSnippet;
    }

    type PlaylistItemSnippet = {
        /**
         * The ID that YouTube uses to uniquely identify the user that added the item to the playlist.
         */
        channelId: string;
        /**
         * Channel title for the channel that the playlist item belongs to.
         */
        channelTitle: string;
        /**
         * The item's description.
         */
        description: string;
        /**
         * The ID that YouTube uses to uniquely identify thGe playlist that the playlist item is in.
         */
        playlistId: string;
        /**
         * The order in which the item appears in the playlist. The value uses a zero-based index, so the first item has a position of 0, the second item has a position of 1, and so forth.
         */
        position: number;
        /**
         * The date and time that the item was added to the playlist.
         */
        publishedAt: string;
        /**
         * The id object contains information that can be used to uniquely identify the resource that is included in the playlist as the playlist item.
         */
        resourceId: {
            kind: string,
            videoId: string,
        };
        /**
         * A map of thumbnail images associated with the playlist item. For each object in the map, the key is the name of the thumbnail image, and the value is an object that contains other information about the thumbnail.
         */
        thumbnails: Record<'default' | 'medium' | 'high' | 'standard' | 'maxres', {
            url: string,
            width: number,
            height: number,
        }>;
        /**
         * The item's title.
         */
        title: string;
        /**
         * Channel id for the channel this video belongs to.
         */
        videoOwnerChannelId: string;
        /**
         * Channel title for the channel this video belongs to.
         */
        videoOwnerChannelTitle: string;
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
