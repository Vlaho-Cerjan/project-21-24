import { Artist } from "../interfaces/content/artist";
import { Error } from "../interfaces/error/error";
import { RefreshIfLoggedOut } from './refreshIfLoggedOut';

export const fetchArtists = (searchVal: string, selArtists: any[] | null, setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, signal?: AbortSignal) => {
    setLoading(true);
    if (searchVal === "") {
        setCurrentItems([]);
        setLoading(false);
        return;
    }
    fetch(
        '/api/content/artists',
        {
            method: 'POST',
            body: JSON.stringify({
                action: 'list',
                offset: 0,
                limit: 20,
                active: true,
                search: searchVal,
            }),
            signal: signal,
        }
    )
        .then(async (response) => {
            if (response.ok) {
                return response.json();
            }
            return Promise.reject(await response.json());
        })
        .then((artists: {
            total: number,
            artists: Artist[]
        }) => {
            const tempArtists = artists.artists.map(artist => ({
                id: artist.id,
                name: artist.name,
                label: artist.name,
            })).filter(
                (artist) => {
                    if (selArtists) {
                        const isArtistSelected = selArtists.find(selectedArtist => selectedArtist.id === artist.id);
                        if (typeof isArtistSelected !== "undefined") return false;
                        return true;
                    }
                    return true;
                }
            );
            setCurrentItems(tempArtists);
        })
        .catch((err: Error) => {
            if (signal?.aborted) {
                console.log('The user aborted the request');
            } else {
                RefreshIfLoggedOut(err.message);
                setCurrentItems([]);
            }
        })
        .finally(() => {
            setLoading(false);
        })
}
