import { EditOutlined, PlaylistPlayOutlined, PushPinOutlined } from '@mui/icons-material';
import { Backdrop, Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import React from "react";
import { useAppSelector } from '../../../hooks';
import { Video } from '../../../interfaces/content/video';
import { ExceptionStrings } from '../../../lang/common/exceptions';
import { GenericText } from '../../../lang/common/genericText';
import { fetchArtists } from '../../../lib/fetchArtists';
import { RefreshIfLoggedOut } from '../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { setSidebarItems } from '../../../utility/setSidebarItems';
import useTranslation from "../../../utility/useTranslation";
import useWindowSize from '../../../utility/windowSize';
import ContentSidebar from '../../common/contentSidebar/contentSidebar';
import StyledGrid from '../../common/gridComponents/styledGrid';
import StyledPlayVideoOverlay from '../../common/playVideoOverlay/playVideoOverlay';
import { SidebarBox } from '../../common/sidebarComponents/sidebarBox';
import { FixedFilterBox, StyledSearchContainer, TopContainerBox } from '../../common/styledComponents/styledComponents';
import { VideosStrings } from "../lang/videosStrings";

interface MusicVideosProps {
    searchResult: string | null;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MusicVideosComponent = ({ searchResult, setSearchLoading }: MusicVideosProps) => {
    const { t } = useTranslation(VideosStrings);
    const genericText = useTranslation(GenericText).t;
    const exception = useTranslation(ExceptionStrings).t;
    const { enumProject } = useAppSelector(state => state.enum);

    const { enqueueSnackbar } = useSnackbar();
    const [offset, setOffset] = React.useState(0);
    const { theme } = React.useContext(AccessibilityContext);
    const { width } = useWindowSize();
    const [openFilters, setOpenFilters] = React.useState(false);

    const [currentArtists, setCurrentArtists] = React.useState<any[]>([]);
    const [selectedArtists, setSelectedArtists] = React.useState<typeof currentArtists>([]);
    const [videosLoading, setVideosLoading] = React.useState(false);
    const [totalVideos, setTotalVideos] = React.useState(0);
    const [videoId, setVideoId] = React.useState<string | null>(null);
    const [openVideo, setOpenVideo] = React.useState(false);
    const [videos, setVideos] = React.useState<Video[]>([]);
    const [checkedGenres, setCheckedGenres] = React.useState<string[]>([]);
    const [checkedRating, setCheckedRating] = React.useState<string | null>(null);
    const [checkedDecades, setCheckedDecades] = React.useState<string[]>([]);
    const [checkedOwner, setCheckedOwner] = React.useState<string | null>(null);
    const [title, setTitle] = React.useState<string>(genericText("videos"));
    const [limit, setLimit] = React.useState<number | null>(null);
    const [arrowClicked, setArrowClicked] = React.useState(false);

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

    React.useEffect(() => {
        if (videoId) setOpenVideo(true);
    }, [videoId]);

    React.useEffect(() => {
        // get genres, ratings and decades from enumProject and set them in the state
        if (enumProject) {
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
        }
    }, [enumProject]);

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
            setTitle(genericText("videos"));
        }
        if (!limit) return;
        setVideosLoading(true);

        fetch(
            '/api/content/videos/music',
            {
                method: 'POST',
                body: JSON.stringify({
                    action: 'list',
                    offset: tempOffset,
                    genres: checkedGenres,
                    rating: checkedRating,
                    decades: checkedDecades,
                    owner: checkedOwner,
                    limit: limit,
                    search: searchResult ? searchResult + " " + (selectedArtists ? selectedArtists.map(artist => artist.name).join(' ') : '') : (selectedArtists ? selectedArtists.map(artist => artist.name).join(' ') : ''),
                })
            }
        )
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data: { total: number, videos: Video[] }) => {
                if (data.total === 0) enqueueSnackbar(exception("noResultChangeFilters"), { variant: 'info' });
                setTotalVideos(data.total);
                setVideos(data.videos);
            })
            .catch((err: Error) => {
                RefreshIfLoggedOut(err.message);
                enqueueSnackbar(exception("noArtistsFound"), { variant: "error" });
                //console.error('The request failed');
            })
            .finally(() => {
                setVideosLoading(false);
                if (searchResult) setSearchLoading(false);
            });
    }, [offset, selectedArtists, searchResult, limit, checkedGenres, checkedRating, checkedDecades, checkedOwner]);

    return (
        <TopContainerBox>
            <StyledGrid
                pageTitle={title}
                totalItems={totalVideos}
                limit={limit}
                offset={offset}
                setOffset={setOffset}
                setLimit={setLimit}
                items={videos}
                itemsLoading={videosLoading}
                setOpenFilters={setOpenFilters}
                setArrowClicked={setArrowClicked}
                editHref='/content/videos/music/edit'
                dropdownItems={
                    [
                        {
                            text: t("editVideo"),
                            icon: <EditOutlined />,
                            href: "/content/videos/music/edit",
                            addHrefId: true,
                        },
                        {
                            text: t("pinVideo"),
                            icon: <PushPinOutlined />,
                            function: () => { }
                        },
                        {
                            text: t("addToPlaylist"),
                            icon: <PlaylistPlayOutlined />,
                            function: () => { }
                        }
                    ]
                }
                setItemId={setVideoId}
            />
            {width >= theme.breakpoints.values.md ?
                <SidebarBox>
                    <Box sx={{ paddingBottom: "74px" }}>
                        <StyledSearchContainer>
                            <ContentSidebar
                                autocompleteSearchList={
                                    [
                                        {
                                            title: genericText("artists"),
                                            fetchItems: fetchArtists,
                                            currentItems: currentArtists,
                                            setCurrentItems: setCurrentArtists,
                                            selectedItems: selectedArtists,
                                            setSelectedItems: setSelectedArtists,
                                            setOffset: setOffset,
                                            searchPlaceholder: genericText("findArtist"),
                                            itemOrder: 1
                                        }
                                    ]
                                }
                                checkedList={
                                    [
                                        {
                                            title: genericText("genres"),
                                            items: genres,
                                            lessItemsText: genericText("lessGenres"),
                                            moreItemsText: genericText("moreGenres"),
                                            checkedItems: checkedGenres,
                                            setCheckedItems: setCheckedGenres,
                                            itemOrder: 2,
                                            defaultExpanded: true
                                        },
                                        {
                                            title: genericText("rating"),
                                            items: ratings,
                                            lessItemsText: genericText("lessRatings"),
                                            moreItemsText: genericText("moreRatings"),
                                            checkedItem: checkedRating,
                                            setCheckedItem: setCheckedRating,
                                            itemOrder: 3,
                                            defaultExpanded: false
                                        },
                                        {
                                            title: genericText("decades"),
                                            items: decades,
                                            lessItemsText: genericText("lessDecades"),
                                            moreItemsText: genericText("moreDecades"),
                                            checkedItems: checkedDecades,
                                            setCheckedItems: setCheckedDecades,
                                            itemOrder: 4,
                                            defaultExpanded: false
                                        }
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
                            autocompleteSearchList={
                                [
                                    {
                                        title: genericText("artists"),
                                        fetchItems: fetchArtists,
                                        currentItems: currentArtists,
                                        setCurrentItems: setCurrentArtists,
                                        selectedItems: selectedArtists,
                                        setSelectedItems: setSelectedArtists,
                                        setOffset: setOffset,
                                        searchPlaceholder: genericText("findArtist"),
                                        itemOrder: 1
                                    }
                                ]
                            }
                            checkedList={
                                [
                                    {
                                        title: genericText("genres"),
                                        items: genres,
                                        lessItemsText: genericText("lessGenres"),
                                        moreItemsText: genericText("moreGenres"),
                                        checkedItems: checkedGenres,
                                        setCheckedItems: setCheckedGenres,
                                        itemOrder: 2,
                                        defaultExpanded: true
                                    },
                                    {
                                        title: genericText("rating"),
                                        items: ratings,
                                        lessItemsText: genericText("lessRatings"),
                                        moreItemsText: genericText("moreRatings"),
                                        checkedItem: checkedRating,
                                        setCheckedItem: setCheckedRating,
                                        itemOrder: 3,
                                        defaultExpanded: false
                                    },
                                    {
                                        title: genericText("decades"),
                                        items: decades,
                                        lessItemsText: genericText("lessDecades"),
                                        moreItemsText: genericText("moreDecades"),
                                        checkedItems: checkedDecades,
                                        setCheckedItems: setCheckedDecades,
                                        itemOrder: 4,
                                        defaultExpanded: false
                                    }
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
                id={videoId}
                setId={setVideoId}
                open={openVideo}
                setOpen={setOpenVideo}
            />
        </TopContainerBox>
    )
}

export default MusicVideosComponent;