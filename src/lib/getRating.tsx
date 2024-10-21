import { RatingPG, RatingG, Rating14, RatingMA, RatingPENDING } from '../components/common/ratings/ratings';

export const GetRating = (rating: string, transparent?: boolean) => {
    switch (rating) {
        case "TV-G":
            return <RatingG className={transparent ? 'transparent' : ''} />
        case "TV-PG":
            return <RatingPG className={transparent ? 'transparent' : ''} />
        case "TV-14":
            return <Rating14 className={transparent ? 'transparent' : ''} />
        case "TV-MA":
            return <RatingMA className={transparent ? 'transparent' : ''} />
        case "PEND":
            return <RatingPENDING className={transparent ? 'transparent' : ''} />
        default:
            return <RatingPENDING className={transparent ? 'transparent' : ''} />
    }
}