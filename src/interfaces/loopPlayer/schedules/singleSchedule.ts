import { Video } from '../../content/video';
export interface SingleSchedule {
    id: string,
    order: number,
    business_id: string,
    slug: string,
    name: string,
    type: string,
    image: boolean,
    video_url: string,
    active: boolean,
    free: boolean,
    duration: number,
    video_count: number,
    max_rating: string,
    description: string,
    tags: string[],
    created_at: string,
    updated_at: string,
    videos: Video[]
}