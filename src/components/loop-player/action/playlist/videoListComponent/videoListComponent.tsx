import { DndContext, DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Add, Delete, Shuffle } from "@mui/icons-material";
import { Box, Checkbox, CircularProgress } from "@mui/material";
import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Video } from "../../../../../interfaces/content/video";
import { SinglePlaylist } from "../../../../../interfaces/projectPlayer/playlists/singlePlaylist";
import { GenericText } from "../../../../../lang/common/genericText";
import SecondsToFullTime from "../../../../../utility/secondsToFullTime";
import { shuffleArray } from "../../../../../utility/shuffleArray";
import useTranslation from "../../../../../utility/useTranslation";
import { StyledButton } from "../../../../common/buttons/styledButton";
import { IconContainerGrey } from "../../../../common/iconContainer/iconContainer";
import StyledPlaylistTitleRow from "../../../../common/playlistRow/playlistTitleRow";
import StyledSubsection from "../../../../common/styledSubsection/styledSubsection";
import { TextBlack12, TextMedium14 } from "../../../../common/styledText/styledText";
import { StyledSubsectionContainer } from "../../../../content/styledComponents/actionStyledComponents";
import VideoItem from "./videoItem/videoItem";

interface VideoListProps {
    playlist: SinglePlaylist | null;
    videos: Video[];
    setVideos: React.Dispatch<React.SetStateAction<Video[]>>;
    setSelectedVideos: React.Dispatch<React.SetStateAction<string[]>>;
    selectedVideos: string[];
    setAddVideosOpen: React.Dispatch<React.SetStateAction<boolean>>;
    action: "add" | "edit";
    setItemId: React.Dispatch<React.SetStateAction<string | null>>;
}

const VideoListComponent = ({ setItemId, playlist, videos, setVideos, setAddVideosOpen, setSelectedVideos, selectedVideos, action }: VideoListProps) => {
    const genericText = useTranslation(GenericText).t;
    const [hasMore, setHasMore] = React.useState(true);
    const [videoList, setVideoList] = React.useState<Video[]>(videos);

    const handleFetchMoreData = () => {
        setHasMore(false);
        return;
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;
        if (checked) {
            setSelectedVideos((prevState) => [...prevState, value]);
        } else {
            setSelectedVideos((prevState) => prevState.filter(video => video !== value));
        }
    }

    const handleDeleteVideo = async (videoId: string) => {
        setVideos((prevState) => prevState.filter(video => video.id !== videoId));
        setSelectedVideos((prevState) => prevState.filter(video => video !== videoId));
    }

    const handleDeleteMultipleVideos = async () => {
        setVideos((prevState) => prevState.filter(video => !selectedVideos.includes(video.id)));
        setSelectedVideos([]);
    }

    const handleSelectAllVideos = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedVideos(videoList.map((video) => video.id));
        } else {
            setSelectedVideos([]);
        }
    }

    const handleShuffleVideos = () => {
        const shuffledVideos = shuffleArray([...videoList]);
        setVideos(shuffledVideos);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setVideoList((rows) => {
                if (rows) {
                    const oldIndex = rows.findIndex((item: any) => item.id === active.id);
                    const newIndex = rows.findIndex((item: any) => item.id === over.id);

                    return arrayMove(rows, oldIndex, newIndex);
                }
                return rows;
            });
            setVideos((rows) => {
                if (rows) {
                    const oldIndex = rows.findIndex((item: any) => item.id === active.id);
                    const newIndex = rows.findIndex((item: any) => item.id === over.id);

                    return arrayMove(rows, oldIndex, newIndex);
                }
                return rows;
            });
            /*
                    let tempRowIds = tempItems.map((row: any) => row.id);
            
                    const areArraysEqual = rowIds.every((element, index) => {
                        if (element === tempRowIds[index]) {
                            return true;
                        }
                        return false;
                    });
            
                    if (areArraysEqual) {
                        return;
                    }
                    */
        }
    }

    React.useEffect(() => {
        setVideoList(videos);
    }, [videos]);

    const sensors = useSensors(
        useSensor(MouseSensor, {
            // Require the mouse to move by 10 pixels before activating
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(TouchSensor, {
            // Press delay of 250ms, with tolerance of 5px of movement
            activationConstraint: {
                delay: 100,
                tolerance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <StyledSubsectionContainer
            sx={{
                display: "flex",
            }}
        >
            <StyledSubsection
                containerSx={{
                    padding: "0",
                }}
                title={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ marginLeft: "-11px", marginRight: "7px" }}>
                            <Checkbox
                                onChange={handleSelectAllVideos}
                                checked={(selectedVideos.length === videoList.length && videoList.length !== 0) ? true : false}
                                name="select-all-videoList-radio-button"
                            />
                        </Box>
                        <TextMedium14
                            text={videoList.length + " " + genericText("videos")}
                        />
                        {typeof playlist !== "undefined" && playlist && playlist.duration && videoList.length === playlist.video_count ?

                            <TextMedium14
                                text="/"
                                containerSx={{
                                    margin: "0 6px"
                                }}
                                textProps={{
                                    sx: {
                                        color: "text.secondary"
                                    }
                                }}
                            />

                            :
                            null
                        }
                        <TextMedium14
                            text={SecondsToFullTime((typeof playlist !== "undefined" && playlist) ? playlist.duration : 0)}
                            containerSx={{
                                margin: "8px 0",
                                display: (typeof playlist !== "undefined" && playlist && playlist.duration && videoList.length === playlist.video_count) ? "block" : "none"
                            }}
                            textProps={{
                                sx: {
                                    color: "text.secondary"
                                }
                            }}
                        />
                    </Box>
                }
                rightContainer={
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <StyledButton sx={{ marginRight: "15px" }} onClick={handleDeleteMultipleVideos}>
                            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                                <Delete />
                            </IconContainerGrey>
                        </StyledButton>
                        <StyledButton sx={{ marginRight: "15px" }} onClick={handleShuffleVideos}>
                            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                                <Shuffle />
                            </IconContainerGrey>
                        </StyledButton>
                        <StyledButton onClick={() => setAddVideosOpen(true)}>
                            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                                <Add />
                            </IconContainerGrey>
                        </StyledButton>
                    </Box>
                }
            >
                {
                    videoList.length > 0 ?
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            modifiers={[restrictToVerticalAxis]}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={videoList}
                                strategy={verticalListSortingStrategy}

                            >
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
                                    <StyledPlaylistTitleRow />
                                    <InfiniteScroll
                                        dataLength={0}
                                        next={handleFetchMoreData}
                                        //style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                                        //inverse={true} //
                                        hasMore={false}
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
                                                text={videoList.length > 0 ? "" : genericText("noResults")}
                                            />
                                        }
                                    >
                                        <Box
                                        >
                                            {videoList.map((video: Video, index: number) => {
                                                return (
                                                    <VideoItem
                                                        key={video.id}
                                                        video={video}
                                                        index={index}
                                                        selectedVideos={selectedVideos}
                                                        handleChange={handleChange}
                                                        handleDeleteVideo={handleDeleteVideo}
                                                        setItemId={setItemId}
                                                    />
                                                )
                                            })
                                            }
                                        </Box>
                                    </InfiniteScroll>
                                </Box>
                            </SortableContext>
                        </DndContext>
                        :
                        null
                }
            </StyledSubsection >
        </StyledSubsectionContainer >
    )
}

export default VideoListComponent;