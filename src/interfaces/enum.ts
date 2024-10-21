export interface enumInterface {
    actions: {
        [key: string]: string;
    },
    namespaces: {
        [key: string]: string;
    },
    exceptions: {
        [key: string]: string;
    },
    admin_roles: {
        [key: string]: string;
    },
    b2b_business_statuses: {
        [key: string]: string;
    },
    playlist_categories: {
        [key: string]: string;
    },
    playlist_genres: {
        [key: string]: string;
    },
    playlist_moods: {
        [key: string]: string;
    },
    playlist_ratings: string[],
    playlist_decades: {
        [key: string]: string;
    },
    playlist_activities: {
        [key: string]: string;
    },
    content_video_types: {
        [key: string]: string;
    },
    layout_item_type: {
        [key: string]: string;
    },
    layout_category: {
        [key: string]: string;
    }
}