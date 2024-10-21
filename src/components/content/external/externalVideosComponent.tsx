import { Backdrop, Box } from '@mui/material';
import useTranslation from "../../../utility/useTranslation";
import { VideosStrings } from "../lang/videosStrings";
import React from "react";
import { SidebarBox } from '../../common/sidebarComponents/sidebarBox';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import useWindowSize from '../../../utility/windowSize';
import { EditOutlined, PushPinOutlined, PlaylistPlayOutlined } from '@mui/icons-material';
import Sticky from 'react-stickynode';
import { GenericText } from '../../../lang/common/genericText';
import StyledPlayVideoOverlay from '../../common/playVideoOverlay/playVideoOverlay';
import { FixedFilterBox, TopContainerBox, StyledSearchContainer } from '../../common/styledComponents/styledComponents';
import { ExceptionStrings } from '../../../lang/common/exceptions';
import { useSnackbar } from 'notistack';
import StyledGrid from '../../common/gridComponents/styledGrid';
import ExternalVideoSidebar from './externalVideosSidebar';
import { Video } from '../../../interfaces/content/video';
import { Error } from '../../../interfaces/error/error';
import { RefreshIfLoggedOut } from '../../../lib/refreshIfLoggedOut';

interface MusicVideosProps {
    searchResult: string | null;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const MusicVideosComponent = ({ searchResult, setSearchLoading }: MusicVideosProps) => {
    const { t } = useTranslation(VideosStrings);
    const genericText = useTranslation(GenericText).t;
    const exception = useTranslation(ExceptionStrings).t;

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

    React.useEffect(() => {
        if (videoId) setOpenVideo(true);

        return () => {
            setOpenVideo(false);
        }
    }, [videoId]);

    React.useEffect(() => {
        const abortController = new AbortController();
        const FetchData = () => {
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
                '/api/content/videos/external',
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
                    if (abortController.signal.aborted) {
                        console.log('The user aborted the request');
                    } else {
                        RefreshIfLoggedOut(err.message);
                        enqueueSnackbar(exception("noArtistsFound"), { variant: "error" });
                        //console.error('The request failed');
                    }
                })
                .finally(() => {
                    setVideosLoading(false);
                    if (searchResult) setSearchLoading(false);
                });
        }

        FetchData();

        return () => {
            setVideos([]);
        }
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
                dropdownItems={
                    [
                        {
                            text: t("editVideo"),
                            icon: <EditOutlined />,
                            href: "/content/videos/music/edit/",
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
                    <Sticky enabled={true} top={0}>
                        <Box sx={{ paddingBottom: "74px" }}>
                            <StyledSearchContainer>
                                <ExternalVideoSidebar
                                    currentArtists={currentArtists}
                                    setCurrentArtists={setCurrentArtists}
                                    selectedArtists={selectedArtists}
                                    setSelectedArtists={setSelectedArtists}
                                    setOffset={setOffset}
                                    checkedGenres={checkedGenres}
                                    setCheckedGenres={setCheckedGenres}
                                    checkedRating={checkedRating}
                                    setCheckedRating={setCheckedRating}
                                    checkedDecades={checkedDecades}
                                    setCheckedDecades={setCheckedDecades}
                                    checkedOwner={checkedOwner}
                                    setCheckedOwner={setCheckedOwner}
                                />
                            </StyledSearchContainer>
                        </Box>
                    </Sticky>
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
                        <ExternalVideoSidebar
                            currentArtists={currentArtists}
                            setCurrentArtists={setCurrentArtists}
                            selectedArtists={selectedArtists}
                            setSelectedArtists={setSelectedArtists}
                            setOffset={setOffset}
                            checkedGenres={checkedGenres}
                            setCheckedGenres={setCheckedGenres}
                            checkedRating={checkedRating}
                            setCheckedRating={setCheckedRating}
                            checkedDecades={checkedDecades}
                            setCheckedDecades={setCheckedDecades}
                            checkedOwner={checkedOwner}
                            setCheckedOwner={setCheckedOwner}
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