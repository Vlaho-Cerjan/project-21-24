export interface SingleVideo {
    id: string,
    title: string,
    display_title: string,
    slug: string,
    artist_name: string,
    artist_display_name: string,
    artist_id: string,
    artist_slug: string,
    online: boolean,
    image: boolean,
    genres: {
        genre: string[],
        subgenre: string[]
    },
    duration: number,
    screenplay_id: number,
    release_date: string,
    created_at: string,
    updated_at: string,
    isrc: string,
    bpm_in: number,
    rating: string,
    version: string,
    language: string,
    licensor: string,
    lyrical_content: string,
    business_appropriate: boolean
}