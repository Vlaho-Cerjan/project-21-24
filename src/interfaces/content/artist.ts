export interface Artist {
    id: string,
    name: string,
    biography: string,
    genre: {
        genre: string[],
        subgenre: string[]
    },
    image: boolean,
    last_activity: string,
    created_at: string,
    updated_at: string
}