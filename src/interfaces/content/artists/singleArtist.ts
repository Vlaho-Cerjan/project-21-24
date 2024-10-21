export interface SingleArtist {
    id: string,
    name: string,
    slug: string,
    biography: null | string,
    genre: {
      genre: string[],
      subgenre: string[]
    },
    image: boolean,
    total_videos: number,
    last_activity: string,
    created_at: string,
    updated_at: string
  }