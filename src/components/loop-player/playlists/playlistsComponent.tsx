import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import { Backdrop, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from "react";
import { useAppSelector } from '../../../hooks';
import { Error } from '../../../interfaces/error/error';
import { ExceptionStrings } from '../../../lang/common/exceptions';
import { GenericText } from '../../../lang/common/genericText';
import { RefreshIfLoggedOut } from '../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { LoadingContext } from '../../../store/providers/loadingProvider';
import { LockContext } from '../../../store/providers/lockProvider';
import { setSidebarItems } from '../../../utility/setSidebarItems';
import useTranslation from "../../../utility/useTranslation";
import useWindowSize from '../../../utility/windowSize';
import ContentSidebar from '../../common/contentSidebar/contentSidebar';
import StyledGrid from '../../common/gridComponents/styledGrid';
import StyledPlayVideoOverlay from '../../common/playVideoOverlay/playVideoOverlay';
import { SidebarBox } from '../../common/sidebarComponents/sidebarBox';
import { FixedFilterBox, StyledSearchContainer, TopContainerBox } from '../../common/styledComponents/styledComponents';
import { PlaylistsStrings } from "./lang/playlistsStrings";

interface MusicPlaylistsProps {
    searchResult: string | null;
    setSearchResult: React.Dispatch<React.SetStateAction<string | null>>;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MusicPlaylistsComponent = ({ searchResult, setSearchResult, setSearchLoading }: MusicPlaylistsProps) => {
    const { t } = useTranslation(PlaylistsStrings);
    const genericText = useTranslation(GenericText).t;
    const exception = useTranslation(ExceptionStrings).t;
    const router = useRouter();
    const { enumProject } = useAppSelector(state => state.enum);
    const { setLoading } = React.useContext(LoadingContext);
    const { enqueueSnackbar } = useSnackbar();
    const [offset, setOffset] = React.useState(0);
    const { theme } = React.useContext(AccessibilityContext);
    const { width } = useWindowSize();
    const [openFilters, setOpenFilters] = React.useState(false);
    const [playlistsLoading, setPlaylistsLoading] = React.useState(false);
    const [totalPlaylists, setTotalPlaylists] = React.useState(0);
    const [contentId, setPlaylistId] = React.useState<string | null>(null);
    const [openPlaylist, setOpenPlaylist] = React.useState(false);
    const [playlists, setPlaylists] = React.useState<{
        id: string,
        title: string,
        playlist_source: string,
        licensor_provider: string,
        release_date: string,
        rating: string,
        lyrical_content: string
    }[]>([]);
    const [types, setTypes] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [genres, setGenres] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [ratings, setRatings] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [decades, setDecades] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [moods, setMoods] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [activities, setActivities] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [active, setActive] = React.useState<{
        id: string,
        title: string
    }[]>([
        {
            id: "active",
            title: genericText("active")
        },
        {
            id: "inactive",
            title: genericText("inactive")
        }
    ]);
    const [checkedType, setCheckedType] = React.useState<string | null>(null);
    const [checkedGenres, setCheckedGenres] = React.useState<string[]>([]);
    const [checkedRating, setCheckedRating] = React.useState<string | null>(null);
    const [checkedDecades, setCheckedDecades] = React.useState<string[]>([]);
    const [checkedMoods, setCheckedMoods] = React.useState<string[]>([]);
    const [checkedActivities, setCheckedActivities] = React.useState<string[]>([]);
    const [checkedActive, setCheckedActive] = React.useState<string | null>(null);
    const [title, setTitle] = React.useState<string>(genericText("playlists"));
    const [limit, setLimit] = React.useState<number | null>(20);
    const [arrowClicked, setArrowClicked] = React.useState(false);
    //  update sticky instance when height changes
    const sidebarDomRef = React.useRef<any>(null) // needed for resize observer

    const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

    const abortController = new AbortController();
    const { lockEntity } = React.useContext(LockContext);

    const handleDeletePlaylist = (contentId?: string) => {
        fetch('/api/project-player/playlists', {
            method: 'POST',
            body: JSON.stringify({
                action: "delete",
                type: "music",
                id: contentId
            }),
            signal: abortController.signal
        })
            .then(async (response) => {
                if (response.ok) {
                    fetch(
                        '/api/project-player/playlists',
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                action: 'list',
                                offset: offset,
                                tags: [...checkedGenres, ...checkedDecades, ...checkedMoods, ...checkedActivities].length > 0 ? [...checkedGenres, ...checkedDecades, ...checkedMoods, ...checkedActivities] : null,
                                type: checkedType,
                                rating: checkedRating,
                                limit: limit,
                                name: searchResult ? searchResult : null
                            }),
                            signal: abortController.signal
                        }
                    )
                        .then(async (response) => {
                            if (response.ok) {
                                return response.json();
                            }
                            return Promise.reject(await response.json());
                        })
                        .then((musicPlaylists) => {
                            if (musicPlaylists.total === 0) enqueueSnackbar(exception("noResultChangeFilters"), { variant: 'info' });
                            setTotalPlaylists(musicPlaylists.total);
                            setPlaylists(musicPlaylists.playlists);
                            enqueueSnackbar(exception("playlistDeleteSuccess"), { variant: 'success' });
                        })
                        .catch((err: Error) => {
                            if (abortController.signal.aborted) {
                                console.log('The user aborted the request');
                            } else {
                                RefreshIfLoggedOut(err.message);
                                enqueueSnackbar(exception("playlistListFetchError"), { variant: "error" });
                                //console.error('The request failed');
                            }
                        })

                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("playlistDeleteError"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
    }

    const handleFilterDelete = (filter: string) => {
        if (typeof enumProject !== "undefined" && enumProject) {
            if (checkedActive === filter) {
                setCheckedActive(null);
            }
            if (checkedType === filter) {
                setCheckedType(null);
            }
            const tempGenre = Object.entries(enumProject.playlist_genres).find((genre) => genre[1] === filter);
            if (tempGenre && checkedGenres.includes(tempGenre[0])) {
                setCheckedGenres(checkedGenres.filter((genre) => genre !== tempGenre[0]));
            }
            if (checkedRating === filter) {
                setCheckedRating(null);
            }
            const tempDecade = Object.entries(enumProject.playlist_decades).find((decade) => decade[1] === filter);
            if (tempDecade && checkedDecades.includes(tempDecade[0])) {
                setCheckedDecades(checkedDecades.filter((decade) => decade !== tempDecade[0]));
            }
            const tempMood = Object.entries(enumProject.playlist_moods).find((mood) => mood[1] === filter);
            if (tempMood && checkedMoods.includes(tempMood[0])) {
                setCheckedMoods(checkedMoods.filter((mood) => mood !== tempMood[0]));
            }
            const tempActivity = Object.entries(enumProject.playlist_activities).find((activity) => activity[1] === filter);
            if (tempActivity && checkedActivities.includes(tempActivity[0])) {
                setCheckedActivities(checkedActivities.filter((activity) => activity !== tempActivity[0]));
            }
        }
    }

    const handleEditPlaylist = async (contentId?: string) => {
        setLoading(true);
        if (contentId) {
            const lockSuccess = await lockEntity("playlist", contentId, "lock")
            if (lockSuccess) {
                enqueueSnackbar(exception("playlistLockSuccess"), { variant: 'success' });
                router.push('/project-player/playlists/edit/' + contentId + '?itemLocked=true');
            }
        }

        setLoading(false);
    }

    React.useEffect(() => {
        if (enumProject) {
            if (enumProject.playlist_categories) {
                const tempTypes = enumProject.playlist_categories;

                setSidebarItems(tempTypes, setTypes);
            }

            if (enumProject.playlist_genres) {
                const tempGenres = enumProject.playlist_genres;

                setSidebarItems(tempGenres, setGenres);
            }

            if (enumProject.playlist_ratings) {
                const tempRatings = enumProject.playlist_ratings;

                setSidebarItems(tempRatings, setRatings);
            }

            if (enumProject.playlist_decades) {
                const tempDecades = enumProject.playlist_decades;

                setSidebarItems(tempDecades, setDecades);
            }

            if (enumProject.playlist_moods) {
                const tempMoods = enumProject.playlist_moods;

                setSidebarItems(tempMoods, setMoods);
            }

            if (enumProject.playlist_activities) {
                const tempActivities = enumProject.playlist_activities;

                setSidebarItems(tempActivities, setActivities);
            }
        }
    }, [enumProject]);

    React.useEffect(() => {
        if (router.query.itemNotLocked) {
            enqueueSnackbar(exception("playlistLockError"), { variant: 'error' });
            router.push({
                pathname: '/project-player/playlists',
                query: {}
            }, undefined, { shallow: true });
        }
    }, [router]);

    React.useEffect(() => {
        if (contentId) setOpenPlaylist(true);

        return () => {
            setOpenPlaylist(false);
        }
    }, [contentId]);

    React.useEffect(() => {

        fetch(
            '/api/project-player/playlists',
            {
                method: 'POST',
                body: JSON.stringify({
                    action: 'list',
                    offset: 0,
                    limit: limit,
                }),
                signal: abortController.signal
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((musicPlaylists) => {
                if (musicPlaylists.total === 0) enqueueSnackbar(exception("noResultChangeFilters"), { variant: 'info' });
                setTotalPlaylists(musicPlaylists.total);
                setPlaylists(musicPlaylists.playlists);
                setPlaylistsLoading(false);
                if (searchResult) setSearchLoading(false);
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("playlistListFetchError"), { variant: "error" });
                    //console.error('The request failed');
                }
            })

        return () => {
            setPlaylists([]);
            setTotalPlaylists(0);
            setSearchResult(null);
            //abortController.abort();
        }
    }, []);

    React.useEffect(() => {
        let tempOffset = offset;
        if (!arrowClicked) {
            setOffset(0);
            tempOffset = 0;
        } else {
            setArrowClicked(false);
        }
        if (searchResult) {
            setSearchLoading(true);
            setTitle(searchResult);
        } else {
            setTitle(genericText("playlists"));
        }
        if (!limit) return;
        setPlaylistsLoading(true);

        fetch(
            '/api/project-player/playlists',
            {
                method: 'POST',
                body: JSON.stringify({
                    action: 'list',
                    offset: tempOffset,
                    tags: [...checkedGenres, ...checkedDecades, ...checkedMoods, ...checkedActivities].length > 0 ? [...checkedGenres, ...checkedDecades, ...checkedMoods, ...checkedActivities] : null,
                    type: checkedType,
                    rating: checkedRating,
                    limit: limit,
                    active: checkedActive === "active" && checkedActive !== null ? true : checkedActive === "inactive" && checkedActive !== null ? false : null,
                    name: searchResult ? searchResult : null
                }),
                signal: abortController.signal
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((musicPlaylists) => {
                if (musicPlaylists.total === 0) enqueueSnackbar(exception("noResultChangeFilters"), { variant: 'info' });
                setTotalPlaylists(musicPlaylists.total);
                setPlaylists(musicPlaylists.playlists);
                setPlaylistsLoading(false);
                if (searchResult) setSearchLoading(false);
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("playlistListFetchError"), { variant: "error" });
                    //console.error('The request failed');
                }
            })

        return () => {
            //setPlaylists([]);
            //abortController.abort();
        }
    }, [offset, searchResult, limit, checkedType, checkedGenres, checkedRating, checkedDecades, checkedMoods, checkedActivities, checkedActive]);

    React.useEffect(() => {
        if (typeof enumProject !== "undefined" && enumProject) {
            const tempActiveFilters: string[] = [];
            if (checkedType) tempActiveFilters.push(checkedType);
            if (checkedGenres.length > 0) {
                const tempGenres = Object.entries(enumProject?.playlist_genres).filter((genre) => checkedGenres.includes(genre[0]));
                tempGenres.forEach((genre) => tempActiveFilters.push(genre[1]));
            }
            if (checkedRating) {
                tempActiveFilters.push(checkedRating);
            }
            if (checkedDecades.length > 0) {
                const tempDecades = Object.entries(enumProject?.playlist_decades).filter((decade) => checkedDecades.includes(decade[0]));
                tempDecades.forEach((decade) => tempActiveFilters.push(decade[1]));
            }
            if (checkedMoods.length > 0) {
                const tempMoods = Object.entries(enumProject?.playlist_moods).filter((mood) => checkedMoods.includes(mood[0]));
                tempMoods.forEach((mood) => tempActiveFilters.push(mood[1]));
            }
            if (checkedActivities.length > 0) {
                const tempActivities = Object.entries(enumProject?.playlist_activities).filter((activity) => checkedActivities.includes(activity[0]));
                tempActivities.forEach((activity) => tempActiveFilters.push(activity[1]));
            }
            if (checkedActive) tempActiveFilters.push(checkedActive);
            setActiveFilters(tempActiveFilters);
        }
    }, [checkedActive, checkedType, checkedGenres, checkedRating, checkedDecades, checkedMoods, checkedActivities]);

    return (
        <TopContainerBox>
            <StyledGrid
                pageTitle={title}
                totalItems={totalPlaylists}
                limit={limit}
                offset={offset}
                setOffset={setOffset}
                setLimit={setLimit}
                items={playlists}
                itemsLoading={playlistsLoading}
                setOpenFilters={setOpenFilters}
                setArrowClicked={setArrowClicked}
                dropdownItems={
                    [
                        {
                            text: t("editPlaylist"),
                            icon: <EditOutlined />,
                            function: handleEditPlaylist,
                            addFunctionId: true,
                        },
                        {
                            text: t("deletePlaylist"),
                            icon: <DeleteOutlineOutlined />,
                            function: handleDeletePlaylist,
                            addFunctionId: true,
                        }
                    ]
                }
                editFunction={handleEditPlaylist}
                setItemId={setPlaylistId}
                activeFilters={activeFilters}
                handleFilterDelete={handleFilterDelete}
            />
            {width >= theme.breakpoints.values.md ?
                <SidebarBox sx={{ position: "relative" }}>
                    <Box ref={sidebarDomRef} id="stickyBox" sx={{ paddingBottom: "74px" }}>
                        <StyledSearchContainer>
                            <ContentSidebar
                                checkedList={
                                    [
                                        {
                                            title: genericText("filterActives"),
                                            items: active,
                                            lessItemsText: genericText("lessActives"),
                                            moreItemsText: genericText("moreActives"),
                                            itemOrder: 0,
                                            checkedItem: checkedActive,
                                            setCheckedItem: setCheckedActive,
                                            defaultExpanded: true,
                                        },
                                        {
                                            title: genericText("filterType"),
                                            items: types,
                                            lessItemsText: genericText("lessTypes"),
                                            moreItemsText: genericText("moreTypes"),
                                            itemOrder: 1,
                                            checkedItem: checkedType,
                                            setCheckedItem: setCheckedType,
                                            defaultExpanded: true,
                                        },
                                        {
                                            title: genericText("filterGenres"),
                                            items: genres,
                                            lessItemsText: genericText("lessGenres"),
                                            moreItemsText: genericText("moreGenres"),
                                            itemOrder: 2,
                                            checkedItems: checkedGenres,
                                            setCheckedItems: setCheckedGenres,
                                            defaultExpanded: true,
                                        },
                                        {
                                            title: genericText("filterRating"),
                                            items: ratings,
                                            lessItemsText: genericText("lessRatings"),
                                            moreItemsText: genericText("moreRatings"),
                                            itemOrder: 3,
                                            checkedItem: checkedRating,
                                            setCheckedItem: setCheckedRating,
                                        },
                                        {
                                            title: genericText("filterDecades"),
                                            items: decades,
                                            lessItemsText: genericText("lessDecades"),
                                            moreItemsText: genericText("moreDecades"),
                                            itemOrder: 4,
                                            checkedItems: checkedDecades,
                                            setCheckedItems: setCheckedDecades,
                                        },
                                        {
                                            title: genericText("filterMood"),
                                            items: moods,
                                            lessItemsText: genericText("lessMoods"),
                                            moreItemsText: genericText("moreMoods"),
                                            itemOrder: 5,
                                            checkedItems: checkedMoods,
                                            setCheckedItems: setCheckedMoods,
                                        },
                                        {
                                            title: genericText("filterActivities"),
                                            items: activities,
                                            lessItemsText: genericText("lessActivities"),
                                            moreItemsText: genericText("moreActivities"),
                                            itemOrder: 6,
                                            checkedItems: checkedActivities,
                                            setCheckedItems: setCheckedActivities,
                                        },
                                    ]
                                }
                            />
                        </StyledSearchContainer>
                    </Box>
                </SidebarBox>
                :
                <FixedFilterBox
                    sx={{
                        visibility: openFilters ? "visible" : "hidden",
                        opacity: openFilters ? 1 : 0,
                        pointerEvents: openFilters ? "all" : "none",
                    }}
                >
                    <SidebarBox sx={{ zIndex: theme.zIndex.drawer + 1003 }}>
                        <ContentSidebar
                            checkedList={
                                [
                                    {
                                        title: genericText("filterActives"),
                                        items: active,
                                        lessItemsText: genericText("lessActives"),
                                        moreItemsText: genericText("moreActives"),
                                        itemOrder: 0,
                                        checkedItem: checkedActive,
                                        setCheckedItem: setCheckedActive,
                                        defaultExpanded: true,
                                    },
                                    {
                                        title: genericText("filterType"),
                                        items: types,
                                        lessItemsText: genericText("lessTypes"),
                                        moreItemsText: genericText("moreTypes"),
                                        itemOrder: 1,
                                        checkedItem: checkedType,
                                        setCheckedItem: setCheckedType,
                                        defaultExpanded: true,
                                    },
                                    {
                                        title: genericText("filterGenres"),
                                        items: genres,
                                        lessItemsText: genericText("lessGenres"),
                                        moreItemsText: genericText("moreGenres"),
                                        itemOrder: 2,
                                        checkedItems: checkedGenres,
                                        setCheckedItems: setCheckedGenres,
                                        defaultExpanded: true,
                                    },
                                    {
                                        title: genericText("filterRating"),
                                        items: ratings,
                                        lessItemsText: genericText("lessRatings"),
                                        moreItemsText: genericText("moreRatings"),
                                        itemOrder: 3,
                                        checkedItem: checkedRating,
                                        setCheckedItem: setCheckedRating,
                                    },
                                    {
                                        title: genericText("filterDecades"),
                                        items: decades,
                                        lessItemsText: genericText("lessDecades"),
                                        moreItemsText: genericText("moreDecades"),
                                        itemOrder: 4,
                                        checkedItems: checkedDecades,
                                        setCheckedItems: setCheckedDecades,
                                    },
                                    {
                                        title: genericText("filterMood"),
                                        items: moods,
                                        lessItemsText: genericText("lessMoods"),
                                        moreItemsText: genericText("moreMoods"),
                                        itemOrder: 5,
                                        checkedItems: checkedMoods,
                                        setCheckedItems: setCheckedMoods,
                                    },
                                    {
                                        title: genericText("filterActivities"),
                                        items: activities,
                                        lessItemsText: genericText("lessActivities"),
                                        moreItemsText: genericText("moreActivities"),
                                        itemOrder: 6,
                                        checkedItems: checkedActivities,
                                        setCheckedItems: setCheckedActivities,
                                    },
                                ]
                            }
                        />
                    </SidebarBox>
                    <Backdrop
                        open={openFilters}
                        onClick={() => setOpenFilters(false)}
                        sx={{
                            zIndex: theme.zIndex.drawer + 1002,
                        }}
                    />
                </FixedFilterBox>
            }
            <StyledPlayVideoOverlay
                id={contentId}
                setId={setPlaylistId}
                open={openPlaylist}
                setOpen={setOpenPlaylist}
            />
        </TopContainerBox>
    )
}

export default MusicPlaylistsComponent;