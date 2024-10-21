export interface Playlist {
    id: string,
    order: number,
    slug: string,
    name: string,
    type: string,
    image: number,
    video_url: string,
    active: boolean,
    free: boolean,
    description: string,
    created_at: string,
    updated_at: string,
    tags:
    {
        id: string,
        tag: {
            name: string,
            group: string
        }
    }[],
    duration: number,
    video_count: number,
    max_rating: string,
    explicit: boolean
}