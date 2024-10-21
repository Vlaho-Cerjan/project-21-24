import React from 'react';
import { Box, CircularProgress, Divider, Grid } from '@mui/material';
import StyledSubsection from '../../../common/styledSubsection/styledSubsection';
import { StyledSubsectionContainer, StyledActionContainer } from '../../styledComponents/actionStyledComponents';
import { langs } from '../../../../constants/languages';
import { ActionArtistStrings } from '../lang/actionArtistStrings';
import useTranslation from '../../../../utility/useTranslation';
import { GenericText } from '../../../../lang/common/genericText';
import { useRouter } from 'next/router';
import utf8ToB64 from '../../../../utility/stringToBase64';
import { LoadingContext } from '../../../../store/providers/loadingProvider';
import ActionArtistHeader from './actionArtistHeader';
import StyledUpload from '../../../common/styledUpload/styledUpload';
import { StyledTabs } from '../../../common/styledTabs/styledTabs';
import { socialMedia } from '../../../../constants/socialMedia';
import { Add, DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import StyledAddVideoRow from '../../../common/addVideoRow/addVideoRow';
import { TextBlack12 } from '../../../common/styledText/styledText';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SingleArtist } from '../../../../interfaces/content/artists/singleArtist';
import { Video } from '../../../../interfaces/content/video';
import StyledAddVideoTitleRow from '../../../common/addVideoRow/addVideoTitleRow';
import { StyledButton } from '../../../common/buttons/styledButton';
import { IconContainerGrey } from '../../../common/iconContainer/iconContainer';
import { ExceptionStrings } from '../../../../lang/common/exceptions';
import { useSnackbar } from 'notistack';
import { RefreshIfLoggedOut } from '../../../../lib/refreshIfLoggedOut';


interface ActionArtistProps {
    action: "edit" | "add";
}

const Limit = 20;

const ActionArtistComponent = ({ action }: ActionArtistProps) => {
    const { t } = useTranslation(ActionArtistStrings);
    const exception = useTranslation(ExceptionStrings).t;
    const genericText = useTranslation(GenericText).t;

    const { enqueueSnackbar } = useSnackbar();
    const { setLoading } = React.useContext(LoadingContext);
    const router = useRouter();

    React.useEffect(() => {
        const abortController = new AbortController();

        const FetchArtist = () => {
            setLoading(true);
            fetch('/api/content/artists',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        action: "get",
                        id: router.query.artistId
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
                .then((data: SingleArtist) => {
                    setArtistNames((oldTitles) => {
                        return {
                            ...oldTitles,
                            en: data.name
                        }
                    })
                    setArtistBiographies((oldBiographies) => {
                        return {
                            ...oldBiographies,
                            en: data.biography
                        }
                    })
                    /*
                    setArtistSocialMedia((oldSocialMedia) => {
                        return {
                            ...oldSocialMedia,
                            [socialMedia.ig]: data.instagram
                    })
                    */
                    setArtistImage(process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + data.id + "/image.jpg?width=1100&height=1100&cache=" + utf8ToB64(data.updated_at));
                    fetch('/api/content/videos/music', {
                        method: 'POST',
                        body: JSON.stringify({
                            action: "list",
                            search: data.name,
                            limit: Limit,
                            offset: 0,
                        }),
                        signal: abortController.signal
                    })
                        .then(async (response) => {
                            if (response.ok) {
                                return response.json();
                            }
                            return Promise.reject(await response.json());
                        })
                        .then((data: { total: number, videos: Video[] }) => {
                            if (data.total > 0) {
                                setVideos(data.videos);
                            }
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
                })
                .catch((err: Error) => {
                    if (abortController.signal.aborted) {
                        console.log('The user aborted the request');
                    } else {
                        RefreshIfLoggedOut(err.message);
                        enqueueSnackbar(exception("noArtistFound"), { variant: "error" });
                        //console.error('The request failed');
                    }
                })
                .finally(() => {
                    setLoading(false);
                })
        }

        if (action === "edit") {
            if (router.query.artistId) FetchArtist();
        }

    }, [router.query.artistId]);

    const [artistNames, setArtistNames] = React.useState<
        {
            [key: string]: string | null
        }
    >({
        en: "",
        es: "",
        fr: "",
    });
    const [artistBiographies, setArtistBiographies] = React.useState<
        {
            [key: string]: string | null
        }
    >({
        en: "",
        es: "",
        fr: "",
    });
    const [artistSocialMedia, setArtistSocialMedia] = React.useState<
        {
            [key: string]: string | null
        }
    >({
        ig: "",
        fb: "",
        tw: "",
    });
    const [artistImage, setArtistImage] = React.useState<string>("");
    const [selectedVideoId, setSelectedVideoId] = React.useState<string | null>(null);
    const [videos, setVideos] = React.useState<Video[]>([]);
    const [hasMore, setHasMore] = React.useState(true);
    const [offset, setOffset] = React.useState(0);
    const [fetchingItems, setFetchingItems] = React.useState(false);

    const abortController = new AbortController();

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedVideoId(event.target.value);
    }

    const handleFetchMoreData = () => {
        const currentOffset = offset + Limit;
        setOffset((prevState) => prevState + Limit);
        fetch("/api/content/videos/music", {
            method: "POST",
            body: JSON.stringify({
                action: "list",
                limit: Limit,
                offset: currentOffset,
                search: artistNames.en
            }),
            signal: abortController.signal
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data: { total: number, videos: Video[] }) => {
                if (data.videos && data.videos.length > 0) setVideos((prevState) => [...prevState, ...data.videos]);
                else setHasMore(false);
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

    const handleDeleteVideo = (videoId: string) => {
        fetch("/api/content/videos/music", {
            method: "POST",
            body: JSON.stringify({
                action: "delete",
                id: videoId,
            }),
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data: { success: boolean }) => {
                if (data.success) {
                    setVideos((prevState) => prevState.filter((video) => video.id !== videoId));
                }
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("videoDeleteError"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
    }

    return (
        <StyledActionContainer>
            <Box component={"form"}>
                <ActionArtistHeader action={action} handleSubmit={handleSubmit} />
                <Divider sx={{ borderBottomWidth: "2px" }} />
                <Grid container>
                    <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                        <StyledSubsectionContainer className='columnLeft'>
                            <StyledSubsection title={genericText("name")}>
                                <StyledTabs
                                    tabs={langs}
                                    ariaLabel='language tabs'
                                    items={artistNames}
                                    setItems={setArtistNames}
                                    textPlaceholder={t("enterArtistName")}
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
                        <StyledSubsectionContainer className='columnLeft'>
                            <StyledSubsection title={genericText("biography")}>
                                <StyledTabs
                                    tabs={langs}
                                    ariaLabel='language tab biography'
                                    items={artistBiographies}
                                    setItems={setArtistBiographies}
                                    textPlaceholder={t("enterBiography")}
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
                                        rows: 14
                                    }}
                                    tabPanelProps={{
                                        sx: {
                                            padding: "20px 25px"
                                        }
                                    }}
                                />
                            </StyledSubsection>
                        </StyledSubsectionContainer>
                        <StyledSubsectionContainer className='columnLeft'>
                            <StyledSubsection title={genericText("socialMedia")}>
                                <StyledTabs
                                    tabs={socialMedia}
                                    ariaLabel='language tab social media'
                                    items={artistSocialMedia}
                                    setItems={setArtistSocialMedia}
                                    textPlaceholder={t("enterSocialMediaLink")}
                                    textfieldProps={{
                                        inputProps: {
                                            style: {
                                                fontWeight: 500
                                            }
                                        },
                                        InputProps: {
                                            sx: {
                                                lineHeight: "16px",
                                                fontSize: "14px",
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
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ width: "100%" }}>
                        <StyledSubsectionContainer
                            sx={{
                                display: "flex",
                                alignSelf: artistImage ? "stretch" : undefined,
                                height: artistImage ? "100%" : "auto"
                            }}
                            className='columnRight'
                        >
                            <StyledSubsection
                                containerSx={{
                                    padding: "25px 25px 21px",
                                }}
                                title={genericText("uploadFile")}
                            >
                                <Box sx={{ position: "relative" }}>
                                    <StyledUpload
                                        aspectRatio={1}
                                        file={artistImage}
                                        setFile={setArtistImage}
                                        type="image"
                                    />
                                </Box>
                            </StyledSubsection>
                        </StyledSubsectionContainer>
                    </Grid>
                    <Grid item xs={12} sx={{ width: "100%" }}>
                        <StyledSubsectionContainer
                            sx={{
                                display: "flex",
                                paddingTop: "0 !important"
                            }}
                        >
                            <StyledSubsection
                                containerSx={{
                                    padding: "0"
                                }}
                                title={genericText("videos")}
                                rightContainer={
                                    <Box>
                                        <StyledButton onClick={() => { }}>
                                            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                                                <Add />
                                            </IconContainerGrey>
                                        </StyledButton>
                                    </Box>
                                }
                            >
                                {typeof videos !== "undefined" && videos.length > 0 ?
                                    <Box
                                        id={"addScrollableDiv_" + action}
                                        sx={{
                                            height: "306px",
                                            overflowY: "auto",
                                            overflowX: "hidden",
                                            display: "block",
                                            position: "relative"
                                        }}
                                    >
                                        <StyledAddVideoTitleRow />
                                        <InfiniteScroll
                                            dataLength={videos.length}
                                            next={handleFetchMoreData}
                                            //style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                                            //inverse={true} //
                                            hasMore={(videos.length > 0 || fetchingItems) ? hasMore : false}
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
                                            scrollableTarget={"addScrollableDiv_" + action}
                                            endMessage={
                                                <TextBlack12
                                                    containerSx={{
                                                        padding: "24px 0",
                                                        textAlign: "center"
                                                    }}
                                                    text={videos.length > 0 ? genericText("seenItAll") : genericText("noResults")}
                                                />
                                            }
                                        >

                                            {videos.map((video: Video, index: number) => {
                                                return (
                                                    <StyledAddVideoRow
                                                        key={"addPlaylistRow_" + video.id + "_" + index}
                                                        selectedValue={selectedVideoId}
                                                        video={video}
                                                        required={true}
                                                        handleChange={handleChange}
                                                        dropdownMenuItems={[
                                                            {
                                                                text: genericText("edit"),
                                                                icon: <EditOutlined />,
                                                                href: "/content/videos/music/" + video.id,
                                                            },
                                                            {
                                                                text: genericText("delete"),
                                                                icon: <DeleteOutlineOutlined />,
                                                                function: handleDeleteVideo,
                                                            }
                                                        ]}
                                                    />
                                                )
                                            })}
                                        </InfiniteScroll>
                                    </Box>
                                    : null}
                            </StyledSubsection>
                        </StyledSubsectionContainer>
                    </Grid>
                </Grid>
            </Box>
        </StyledActionContainer>
    )
}

export default ActionArtistComponent;