import { Backdrop, Button, CircularProgress } from "@mui/material";
import { Box } from "@mui/system";
import { useSnackbar } from "notistack";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Video } from "../../../interfaces/content/video";
import { Error } from "../../../interfaces/error/error";
import { ExceptionStrings } from "../../../lang/common/exceptions";
import { GenericText } from "../../../lang/common/genericText";
import { RefreshIfLoggedOut } from '../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from '../../../store/providers/accessibilityProvider';
import useTranslation from "../../../utility/useTranslation";
import { CoreBg } from "../../core/coreBackground";
import { ActionPlaylistStrings } from "../../project-player/action/lang/actionPlaylistStrings";
import StyledSearchInput from '../inputs/searchInput';
import StyledPlaylistRow from "../playlistRow/playlistRow";
import StyledPlaylistTitleRow from "../playlistRow/playlistTitleRow";
import { TextBlack12, TextBlack18 } from "../styledText/styledText";
import { StyledTitle } from "../styledTitle/styledTitle";

const Limit = 20;

interface SearchVideosOverlayProps {
    videos: Video[];
    addVideosOpen: boolean;
    setAddVideosOpen: (open: boolean) => void;
    selectedSearchVideos: Video[];
    setSelectedSearchVideos: React.Dispatch<React.SetStateAction<Video[]>>;
    handleAddVideo: () => void;
    action: string;
    setItemId?: React.Dispatch<React.SetStateAction<string | null>>;
}

const SearchVideosOverlay = ({ setItemId, videos, addVideosOpen, setAddVideosOpen, handleAddVideo, action, selectedSearchVideos, setSelectedSearchVideos }: SearchVideosOverlayProps) => {
    const { t } = useTranslation(ActionPlaylistStrings);
    const genericText = useTranslation(GenericText).t;
    const exception = useTranslation(ExceptionStrings).t;
    const { theme } = React.useContext(AccessibilityContext);
    const { enqueueSnackbar } = useSnackbar();
    const [searchVideos, setSearchVideos] = React.useState<Video[]>([]);
    const [searchLoading, setSearchLoading] = React.useState(false);
    const [searchOffset, setSearchOffset] = React.useState(0);
    const [searchHasMore, setSearchHasMore] = React.useState(true);
    const [searchValue, setSearchValue] = React.useState("");
    const abortController = new AbortController();

    React.useEffect(() => {
        if (!addVideosOpen) {
            setSearchOffset(0);
            setSearchHasMore(true);
        }
    }, [addVideosOpen]);

    const handleSearch = (search: string) => {
        setSearchLoading(true);
        fetch("/api/content/videos/music", {
            method: "POST",
            body: JSON.stringify({
                action: "list",
                search: search,
                offset: 0,
                limit: Limit,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data) => {
                const tempSearchFilteredVideos = data.videos.filter((video: Video) => {
                    return !videos.some((v) => v.id === video.id);
                });
                setSearchVideos(tempSearchFilteredVideos);
                setSearchOffset(Limit);
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("noSearchResults"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setSearchLoading(false);
            });
    }

    const handleFetchSearchVideos = () => {
        fetch("/api/content/videos/music", {
            method: "POST",
            body: JSON.stringify({
                action: "list",
                offset: 0,
                limit: Limit,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data) => {
                const tempSearchFilteredVideos = data.videos.filter((video: Video) => {
                    return !videos.some((v) => v.id === video.id);
                });
                setSearchVideos(tempSearchFilteredVideos);
                setSearchHasMore(data.videos.length > 0);
                setSearchOffset(Limit);
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("noVideosFound"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
    }

    const handleFetchMoreSearchVideos = () => {
        fetch("/api/content/videos/music", {
            method: "POST",
            body: JSON.stringify({
                action: "list",
                search: searchValue,
                offset: searchOffset,
                limit: Limit,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data) => {
                if (data.videos.length > 0) {
                    const tempSearchFilteredVideos = data.videos.filter((video: Video) => {
                        return !videos.some((v) => v.id === video.id);
                    });
                    setSearchVideos((prevState) => [...prevState, ...tempSearchFilteredVideos]);
                    setSearchOffset((prevState) => prevState + Limit);
                }
                else setSearchHasMore(false);
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("noVideosFound"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
    }

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            const video = searchVideos.find(video => video.id === value);
            if (video) setSelectedSearchVideos((prevState) => [...prevState, video]);
            else enqueueSnackbar(exception("videoNotFound"), { variant: "error" });
        }
        else {
            setSelectedSearchVideos((prevState) => prevState.filter(video => video.id !== value));
        }
    }


    React.useEffect(() => {
        handleFetchSearchVideos();
    }, []);

    React.useEffect(() => {
        if (typeof searchValue === "string") handleSearch(searchValue);
        else handleFetchSearchVideos();
    }, [searchValue])

    return (
        <Box>
            <Box
                sx={{
                    zIndex: theme.zIndex.drawer + 101,
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    maxWidth: "960px",
                    maxHeight: "100vh",
                    opacity: addVideosOpen ? 1 : 0,
                    visibility: addVideosOpen ? "visible" : "hidden",
                    transition: "all 0.3s ease-in-out",
                }}
            >
                <CoreBg sx={{ padding: 0, width: "100%", maxWidth: "960px" }}>
                    <StyledTitle
                        title={t("addVideoToPlaylist")}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            padding: "0 25px"
                        }}
                    >
                        <StyledSearchInput
                            searchPlaceholder={t("searchMusicVideos")}
                            searchLoading={searchLoading}
                            abortController={abortController}
                            setSearchValue={setSearchValue}
                            addVideosOpen={addVideosOpen}
                        />
                    </Box>
                    <Box sx={{ padding: "15px 25px 25px" }}>
                        <Box
                            id={"addSearchScrollableDiv_" + action}
                            sx={{
                                height: "100%",
                                maxHeight: "306px",
                                overflowY: "auto",
                                overflowX: "hidden",
                                display: "block",
                                position: "relative",
                                border: "2px solid rgba(0,0,32,0.08)",
                                borderRadius: "10px"
                            }}
                        >
                            <StyledPlaylistTitleRow noEdit />
                            <InfiniteScroll
                                dataLength={searchVideos.length}
                                next={handleFetchMoreSearchVideos}
                                //style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                                //inverse={true} //
                                hasMore={(searchVideos.length > 0) ? searchHasMore : false}
                                loader={
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent: "center",
                                        width: "100%",
                                        overflow: "hidden",
                                        padding: "24px 0",
                                    }}>
                                        <CircularProgress />
                                    </Box>
                                }
                                scrollableTarget={"addSearchScrollableDiv_" + action}
                                endMessage={
                                    <TextBlack12
                                        containerSx={{
                                            padding: "24px 0",
                                            textAlign: "center"
                                        }}
                                        text={searchVideos.length > 0 ? genericText("seenItAll") : genericText("noResults")}
                                    />
                                }
                            >

                                {typeof searchVideos !== "undefined" ? searchVideos.map((video: Video, index: number) => {
                                    return (
                                        <StyledPlaylistRow
                                            key={"searchVideoRow" + video.id + "_" + index}
                                            video={video}
                                            selectedValues={selectedSearchVideos.map((video: Video) => video.id)}
                                            handleChange={handleSearchChange}
                                            noEdit
                                            setItemId={setItemId}
                                        />
                                    )
                                })
                                    :
                                    null
                                }
                            </InfiniteScroll>
                        </Box>
                    </Box>
                    <Button
                        variant='contained'
                        sx={{
                            width: "100%",
                            borderRadius: "0 0 16px 16px",
                            py: "17px",
                        }}

                        onClick={() => {
                            handleAddVideo();
                            handleFetchSearchVideos();
                        }}
                    >
                        <TextBlack18
                            textProps={{
                                sx: {
                                    textTransform: "uppercase"
                                }
                            }}
                            text={t("addVideos")}
                        />
                    </Button>
                </CoreBg>
            </Box>
            <Backdrop open={addVideosOpen} onClick={() => setAddVideosOpen(false)} sx={{ zIndex: theme.zIndex.drawer + 100 }} />
        </Box>
    )
}

export default SearchVideosOverlay;