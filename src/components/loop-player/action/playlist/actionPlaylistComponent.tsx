import { Box, Divider } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { langs } from '../../../../constants/languages';
import { useAppSelector } from '../../../../hooks';
import { Video } from '../../../../interfaces/content/video';
import { Error } from '../../../../interfaces/error/error';
import { SinglePlaylist } from '../../../../interfaces/projectPlayer/playlists/singlePlaylist';
import { ExceptionStrings } from '../../../../lang/common/exceptions';
import { GenericText } from '../../../../lang/common/genericText';
import apiRequest from '../../../../lib/apiRequest';
import { RefreshIfLoggedOut } from '../../../../lib/refreshIfLoggedOut';
import { LoadingContext } from '../../../../store/providers/loadingProvider';
import { RemoveNullValues } from '../../../../utility/removeNullValues';
import utf8ToB64 from '../../../../utility/stringToBase64';
import useTranslation from '../../../../utility/useTranslation';
import StyledPlayVideoOverlay from '../../../common/playVideoOverlay/playVideoOverlay';
import SearchVideosOverlay from '../../../common/searchVideosOverlay/searchVideosOverlay';
import StyledSubsection from '../../../common/styledSubsection/styledSubsection';
import { StyledTabs } from '../../../common/styledTabs/styledTabs';
import StyledUpload from '../../../common/styledUpload/styledUpload';
import { StyledActionContainer, StyledSubsectionContainer } from '../../../content/styledComponents/actionStyledComponents';
import { ActionPlaylistStrings } from '../lang/actionPlaylistStrings';
import ActionPlaylistHeader from './actionPlaylistHeader';
import ActionPlaylistSidebar from './actionPlaylistSidebar';
import VideoListComponent from './videoListComponent/videoListComponent';


interface ActionPlaylistProps {
    action: "edit" | "add";
}

const ActionPlaylistComponent = ({ action }: ActionPlaylistProps) => {
    const { t } = useTranslation(ActionPlaylistStrings);
    const genericText = useTranslation(GenericText).t;
    const exception = useTranslation(ExceptionStrings).t;
    const { enqueueSnackbar } = useSnackbar();
    const { setLoading } = React.useContext(LoadingContext);
    const router = useRouter();

    const [playlistNames, setPlaylistNames] = React.useState<
        {
            [key: string]: string | null
        }
    >({
        en: "",
        es: "",
        fr: "",
    });
    const [playlistDescriptions, setPlaylistDescriptions] = React.useState<
        {
            [key: string]: string | null
        }
    >({
        en: "",
        es: "",
        fr: "",
    });
    const [playlistImage, setPlaylistImage] = React.useState<string>("");
    const [playlistType, setPlaylistType] = React.useState("");
    const [selectedVideos, setSelectedVideos] = React.useState<string[]>([]);
    const [free, setFree] = React.useState(false);
    const [videos, setVideos] = React.useState<Video[]>([]);
    const [playlist, setPlaylist] = React.useState<SinglePlaylist | null>(null);
    const ses = useSession();
    const [addVideosOpen, setAddVideosOpen] = React.useState(false);
    const [selectedSearchVideos, setSelectedSearchVideos] = React.useState<Video[]>([]);
    const { enumProject } = useAppSelector(state => state.enum);
    const [genres, setGenres] = React.useState<{ [key: string]: string } | null>(null);
    const [moods, setMoods] = React.useState<{ [key: string]: string } | null>(null);
    const [eras, setEras] = React.useState<{ [key: string]: string } | null>(null);
    const [activities, setActivities] = React.useState<{ [key: string]: string } | null>(null);
    const [tags, setTags] = React.useState<string[] | null>(null);
    const [isActivePlaylist, setIsActivePlaylist] = React.useState(false);
    const [selectedGenres, setSelectedGenres] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [selectedMoods, setSelectedMoods] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [selectedEras, setSelectedEras] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [selectedActivities, setSelectedActivities] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);

    const [videoId, setVideoId] = React.useState<string | null>(null);
    const [openVideo, setOpenVideo] = React.useState(false);

    React.useEffect(() => {
        if (videoId) {
            setOpenVideo(true);
        }
    }, [videoId]);

    React.useEffect(() => {
        if (enumProject) {
            setGenres(enumProject.playlist_genres);
            setMoods(enumProject.playlist_moods);
            setEras(enumProject.playlist_decades);
            setActivities(enumProject.playlist_activities);
        }

        return () => {
            setGenres(null);
            setMoods(null);
            setEras(null);
            setActivities(null);
        }
    }, [enumProject]);

    React.useEffect(() => {
        const abortController = new AbortController();
        const FetchPlaylist = () => {
            setLoading(true);
            fetch('/api/project-player/playlists',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        action: "get",
                        id: router.query.playlistId
                    })
                }
            )
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(await response.json());
                })
                .then((data: SinglePlaylist) => {
                    setPlaylist(data);
                    setPlaylistNames((oldTitles) => {
                        return {
                            ...oldTitles,
                            en: data.name
                        }
                    })
                    setPlaylistDescriptions((oldDescriptions) => {
                        return {
                            ...oldDescriptions,
                            en: data.description
                        }
                    })
                    /*
                    setPlaylistSocialMedia((oldSocialMedia) => {
                        return {
                            ...oldSocialMedia,
                            [socialMedia.ig]: data.instagram
                    })
                    */
                    setPlaylistImage(process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + data.id + "/image.jpg?width=1100&height=618.75&cache=" + utf8ToB64(data.updated_at));
                    setVideos(data.videos);
                    //setDisplayedVideos(data.videos.slice(0, Limit));
                    setPlaylistType(data.type);
                    setIsActivePlaylist(data.active);
                    setFree(data.free);
                    setTags(data.tags.map((tag) => {
                        return tag.id;
                    }));
                    setSelectedGenres(
                        data.tags.filter((tag) => tag.tag.group.toLowerCase() === "genre").map((tag) => {
                            return {
                                id: tag.id,
                                name: tag.tag.name,
                                label: tag.tag.name
                            };
                        })
                    );
                    setSelectedMoods(
                        data.tags.filter((tag) => tag.tag.group.toLowerCase() === "mood").map((tag) => {
                            return {
                                id: tag.id,
                                name: tag.tag.name,
                                label: tag.tag.name
                            };
                        }
                        )
                    );
                    setSelectedEras(
                        data.tags.filter((tag) => tag.tag.group.toLowerCase() === "era").map((tag) => {
                            return {
                                id: tag.id,
                                name: tag.tag.name,
                                label: tag.tag.name
                            };
                        }
                        )
                    );
                    setSelectedActivities(
                        data.tags.filter((tag) => tag.tag.group.toLowerCase() === "activity").map((tag) => {
                            return {
                                id: tag.id,
                                name: tag.tag.name,
                                label: tag.tag.name
                            };
                        }
                        )
                    );
                })
                .catch((err: Error) => {
                    if (abortController.signal.aborted) {
                        console.log('The user aborted the request');
                    } else {
                        RefreshIfLoggedOut(err.message);
                        enqueueSnackbar(exception("playlistNotFound"), { variant: "error" });
                        //console.error('The request failed');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        if (action === "edit" && router.query.playlistId) FetchPlaylist();
    }, [router.query.playlistId, action]);

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        const abortController = new AbortController();
        setLoading(true);
        let apiUrl = "";
        if (action == "add") apiUrl = "player/playlist/music";
        else if (action === "edit") apiUrl = 'player/playlist/' + playlistType + '/' + playlist?.id;
        const data = RemoveNullValues({
            name: playlistNames.en,
            description: playlistDescriptions.en,
            active: isActivePlaylist,
            image_data: playlistImage.includes('base64') ? playlistImage : null,
            videos: ((videos.length > 0) ? videos.map((video) => video.id) : null),
        })

        apiRequest(
            apiUrl,
            action === "add" ? "POST" : "PUT",
            data,
            true,
            true,
            ses.data?.user.token,
            undefined
        )
            .then((data: { success: boolean, data: SinglePlaylist }) => {
                if (data.success) {
                    enqueueSnackbar(exception("playlistCreateSuccess"), { variant: "success" });
                    const newTags = [selectedGenres?.map((genre) => genre.id), selectedMoods?.map((mood) => mood.id), selectedEras?.map((era) => era.id), selectedActivities?.map((activity) => activity.id)].flat();
                    if (newTags && newTags.length > 0) {
                        if (tags === newTags) return;
                        fetch('/api/project-player/playlists', {
                            method: 'POST',
                            body: JSON.stringify({
                                action: "addTags",
                                id: (action === "add" && data.data.id) ? data.data.id : playlist?.id,
                                type: "music",
                                tags: newTags
                            }),
                            signal: abortController.signal
                        })
                            .then(async (response) => {
                                if (response.ok) {
                                    return response.json();
                                }
                                return Promise.reject(await response.json());
                            })
                            .then(() => {
                                enqueueSnackbar(exception("playlistUpdateTagsSuccess"), { variant: "success" });
                            })
                            .catch((err: Error) => {
                                if (abortController.signal.aborted) {
                                    console.log('The user aborted the request');
                                } else {
                                    RefreshIfLoggedOut(err.message);
                                    enqueueSnackbar(exception("errorUpdatingTags"), { variant: "error" });
                                    //console.error('The request failed');
                                }
                            })
                    }
                }
                else return Promise.reject(data);
            })
            .catch((error: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(error.message);
                    enqueueSnackbar(exception(action === "add" ? "errorCreatingPlaylist" : "errorUpdatingPlaylist"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
                if(action === "add") router.push("/project-player/playlists");
            });
    }

    const handleAddVideo = () => {
        setVideos((prevState) => [...prevState, ...selectedSearchVideos]);
        setAddVideosOpen(false);
        setSelectedSearchVideos([]);
    }

    const handleActiveChange = () => {
        setIsActivePlaylist(!isActivePlaylist);
    }

    return (
        <StyledActionContainer>
            <Box component={"form"}>
                <ActionPlaylistHeader id={playlist?.id} action={action} handleSubmit={handleSubmit} />
                <Divider sx={{ borderBottomWidth: "2px" }} />
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ width: "100%" }}>
                        <StyledSubsectionContainer>
                            <StyledSubsection title={genericText("name")}>
                                <StyledTabs
                                    tabs={langs}
                                    ariaLabel='language tabs'
                                    items={playlistNames}
                                    setItems={setPlaylistNames}
                                    textPlaceholder={t("enterPlaylistName")}
                                    textfieldProps={{
                                        inputProps: {
                                            style: {
                                                fontWeight: 500
                                            }
                                        },
                                        InputProps: {
                                            sx: {
                                                fontSize: "14px",
                                                lineHeight: "20px"
                                            }
                                        }
                                    }}
                                    tabPanelProps={{
                                        sx: {
                                            padding: "20.5px 25px"
                                        }
                                    }}
                                />
                            </StyledSubsection>
                        </StyledSubsectionContainer>
                        <StyledSubsectionContainer>
                            <StyledSubsection title={genericText("description")}>
                                <StyledTabs
                                    tabs={langs}
                                    ariaLabel='language tab description'
                                    items={playlistDescriptions}
                                    setItems={setPlaylistDescriptions}
                                    textPlaceholder={t("enterDescription")}
                                    textfieldProps={{
                                        inputProps: {
                                            style: {
                                                fontWeight: 400
                                            }
                                        },
                                        InputProps: {
                                            sx: {
                                                lineHeight: "22px",
                                                fontSize: "14px",
                                            }
                                        },
                                        multiline: true,
                                        type: "textarea",
                                        rows: 6
                                    }}
                                    tabPanelProps={{
                                        sx: {
                                            padding: "20px 25px"
                                        }
                                    }}
                                />
                            </StyledSubsection>
                        </StyledSubsectionContainer>
                        <StyledSubsectionContainer
                            sx={{
                                display: "flex"
                            }}
                        >
                            <StyledSubsection
                                containerSx={{
                                    padding: "25px 25px 21px",
                                }}
                                title={genericText("uploadFile")}
                            >
                                <Box sx={{ position: "relative" }}>
                                    <StyledUpload
                                        aspectRatio={16 / 9}
                                        file={playlistImage}
                                        setFile={setPlaylistImage}
                                        type="image"
                                    />
                                </Box>
                            </StyledSubsection>
                        </StyledSubsectionContainer>
                    </Box>
                    <Divider orientation='vertical' flexItem sx={{ borderRightWidth: "2px" }} />
                    {enumProject && genres && moods && activities && eras ?
                        <ActionPlaylistSidebar
                            genres={genres}
                            moods={moods}
                            activities={activities}
                            eras={eras}
                            selectedGenres={selectedGenres}
                            setSelectedGenres={setSelectedGenres}
                            selectedMoods={selectedMoods}
                            setSelectedMoods={setSelectedMoods}
                            selectedActivities={selectedActivities}
                            setSelectedActivities={setSelectedActivities}
                            selectedEras={selectedEras}
                            setSelectedEras={setSelectedEras}
                            isActivePlaylist={isActivePlaylist}
                            handleActiveChange={handleActiveChange}
                        />
                        : null}
                </Box>
                <Divider sx={{ borderBottomWidth: "2px" }} />
                <Box>
                    <VideoListComponent
                        playlist={playlist}
                        videos={videos}
                        setVideos={setVideos}
                        setAddVideosOpen={setAddVideosOpen}
                        setSelectedVideos={setSelectedVideos}
                        selectedVideos={selectedVideos}
                        action={action}
                        setItemId={setVideoId}
                    />
                </Box>
            </Box>
            <SearchVideosOverlay
                videos={videos}
                addVideosOpen={addVideosOpen}
                setAddVideosOpen={setAddVideosOpen}
                handleAddVideo={handleAddVideo}
                selectedSearchVideos={selectedSearchVideos}
                setSelectedSearchVideos={setSelectedSearchVideos}
                action={action}
                setItemId={setVideoId}
            />
            <StyledPlayVideoOverlay
                id={videoId}
                setId={setVideoId}
                open={openVideo}
                setOpen={setOpenVideo}
            />
        </StyledActionContainer >
    )
}

export default ActionPlaylistComponent;