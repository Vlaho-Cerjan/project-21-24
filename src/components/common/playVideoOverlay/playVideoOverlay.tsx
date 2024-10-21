import { Backdrop, Box, styled } from '@mui/material';
import React from 'react';
import ReactPlayer from 'react-player';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";

interface PlayVideoOverlayProps {
    id: string | null,
    setId: React.Dispatch<React.SetStateAction<string | null>>,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const StyledContainer = styled(Box)(({theme}) => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.drawer + 1010,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
}))

const StyledVideoBox = styled(Box)(({theme}) => ({
    display: "inline-block",
    zIndex: theme.zIndex.drawer + 1030,
    background: "linear-gradient(to right, #db36a4, #f7ff00)",
    boxShadow: "0px 0px 16px 8px rgba(255,255,255,0.5)",
    padding: "6px 6px 0 6px",
}))

const PlayVideoOverlay = ({id, setId, open, setOpen}: PlayVideoOverlayProps) => {
    const { theme } = React.useContext(AccessibilityContext);

    return (
        <StyledContainer sx={{
            visibility: open? "visible" : "hidden",
            opacity: open? 1 : 0,
            transition: "visibility 0.5s, opacity 0.5s",
        }}>
            <StyledVideoBox>
                {id?
                <ReactPlayer
                    url={id?"https://media.project-api.tv/api/stream/"+id+"/?mode=mp4&profile=1000":""}
                    controls={true}
                    height={"60%"}
                    playing={true}
                    config={{
                        file: {
                            forceAudio: true,
                            forceVideo: true,
                        }
                    }}
                    width="100%"
                />
                :null}
            </StyledVideoBox>
            <Backdrop
                open={open}
                sx={{
                    backgroundColor: "rgba(0,0,0,0.7)",
                    zIndex: theme.zIndex.drawer + 1020,
                }}
                onClick={() => {
                    setOpen(false);
                    setId(null);
                }}
            />
        </StyledContainer>
    )
}

export default PlayVideoOverlay;