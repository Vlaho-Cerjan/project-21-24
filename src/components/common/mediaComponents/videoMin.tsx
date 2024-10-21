import { PictureInPicture } from "@mui/icons-material"
import { Box, Button, styled } from "@mui/material"
import ReactPlayer from "react-player"
import { IconContainerWhite } from "../iconContainer/iconContainer"

const StyledButtonTransparent = styled(Button)(({ theme }) => ({
    backgroundColor: (theme.palette.mode==="dark")?"rgba(255,255,255, 0.48)":"rgba(0, 0, 0, 0.32)",
    padding: "6px 8px",
    borderRadius: "12px !important",
    border: "2px solid rgba(255,255,255,0.32)",
    minWidth: 0,
    fontSize: "24px",

    '&:hover': {
        backgroundColor: (theme.palette.mode==="dark")?"rgba(255,255,255, 0.64)":"rgba(0, 0, 0, 0.24)",
    },
}))

interface VideoMinProps {
    playing: boolean;
    setMaxTime: React.Dispatch<React.SetStateAction<number>>;
    setPlayedSeconds: React.Dispatch<React.SetStateAction<number>>;
    setBufferSeconds: React.Dispatch<React.SetStateAction<number>>;
}

const VideoMin = ({
    playing,
    setMaxTime,
    setPlayedSeconds,
    setBufferSeconds
}: VideoMinProps) => {

    return (
        <Box sx={{ width: "100%", height: "100%", position: "relative", '& .pip': { opacity: 0, visibility: "hidden", transition: "opacity ease 0.2s, visibility ease 0.2s" }, '&:hover .pip': { opacity: 1, visibility: "visible", transition: "opacity ease 0.2s, visibility ease 0.2s" } }}>
            <ReactPlayer
                url="https://media.project-api.tv/api/stream/fd919380-dd77-11eb-b856-35e5097ccc20/?mode=mp4&profile=1300"
                width={164}
                controls={false}
                height={92}
                playing={playing}
                onDuration={(duration) => setMaxTime(duration)}
                onProgress={(state) => {
                    setPlayedSeconds(state.playedSeconds)
                    setBufferSeconds(state.loadedSeconds)
                }}
            />
            <IconContainerWhite className="pip" sx={{ position: "absolute", top: "8px", right: "8px" }}>
                <StyledButtonTransparent>
                    <PictureInPicture />
                </StyledButtonTransparent>
            </IconContainerWhite>
        </Box>
    )
}

export default VideoMin;