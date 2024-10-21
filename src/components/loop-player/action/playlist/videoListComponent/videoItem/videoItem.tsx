import { useSortable } from "@dnd-kit/sortable";
import { DeleteOutlineOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import StyledPlaylistRow from "../../../../../common/playlistRow/playlistRow";
import { Video } from "../../../../../../interfaces/content/video";
import { GenericText } from "../../../../../../lang/common/genericText";
import { AccessibilityContext } from "../../../../../../store/providers/accessibilityProvider";
import useTranslation from "../../../../../../utility/useTranslation";
import { useContext } from "react";
import { CSS } from '@dnd-kit/utilities';
import { DragHandle } from "../../../../../common/dragHandle/dragHandle";

interface VideoItemProps {
    video: Video;
    index: number;
    selectedVideos: string[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDeleteVideo: (id: string) => void;
    setItemId?: React.Dispatch<React.SetStateAction<string | null>>;
}

const VideoItem = ({
    video,
    index,
    selectedVideos,
    handleChange,
    handleDeleteVideo,
    setItemId
}: VideoItemProps) => {
    const genericText = useTranslation(GenericText).t;
    const { theme, accessibility } = useContext(AccessibilityContext);

    const {
        attributes,
        isDragging,
        listeners,
        transform,
        transition,
        setNodeRef } = useSortable({
            id: video.id,
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        position: 'relative' as const,
        zIndex: isDragging ? 100 : undefined,
        opacity: isDragging ? 0.6 : undefined,
    };

    return (
        <Box
            ref={setNodeRef}
            style={style}
        >
            <Box
                sx={{
                    backgroundColor: accessibility.isDark ? ((index % 2) ? theme.palette.background.paper : "#1b1b1b") : ((index % 2) ? "rgba(0,0,32,0.08)" : theme.palette.background.paper),
                    position: "relative",
                    paddingTop: "12px"
                }}
            >
                <Box
                    sx={{
                        cursor: "grab",
                        top: 0,
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "12px 4px"
                    }}
                >
                    <DragHandle
                        {...attributes}
                        {...listeners}
                    />
                </Box>
                <StyledPlaylistRow
                    key={"videoRow" + video.id + "_" + index}
                    video={video}
                    selectedValues={selectedVideos}
                    handleChange={handleChange}
                    dropdownMenuItems={[
                        /*{
                            text: genericText("edit"),
                            icon: <EditOutlined />,
                            href: "/content/videoList/music/edit/" + video.id,
                        },*/
                        {
                            text: genericText("delete"),
                            icon: <DeleteOutlineOutlined />,
                            function: handleDeleteVideo,
                            addFunctionId: true
                        }
                    ]}
                    setItemId={setItemId}
                />
            </Box>
        </Box>
    )
};

export default VideoItem;