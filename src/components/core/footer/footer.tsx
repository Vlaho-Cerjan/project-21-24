import { SkipNextSharp, SkipPreviousSharp } from '@mui/icons-material';
import { Box, LinearProgress, styled } from '@mui/material';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import useWindowSize from '../../../utility/windowSize';
import { useContext, useState } from 'react';
import { IconContainerDarkModeDark } from '../../common/iconContainer/iconContainer';
import { StyledButton } from '../../common/buttons/styledButton';
import SecondsToTimeFormat from '../../../utility/secondsToTimeFormat';
import { TextBold14, TextRegular14 } from '../../common/styledText/styledText';
import PauseButton from '../../common/mediaComponents/buttons/pauseButton';
import VideoMin from '../../common/mediaComponents/videoMin';

const FooterBox = styled(Box)(({ theme }) => ({
    display: "flex",
    position: "fixed",
    bottom: 0,
    left: 0,
    width: "100%",
    zIndex: theme.zIndex.drawer + 1,
    height: "92px",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,

    '> div': {
        flex: "1 1 auto",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    }
}))

const VideoFooter = () => {
    const { theme } = useContext(AccessibilityContext);

    const { width } = useWindowSize();

    const [maxTime, setMaxTime] = useState(0.0);

    const [playing, setPlaying] = useState(false);

    const [playedSeconds, setPlayedSeconds] = useState(0.0);

    const [bufferSeconds, setBufferSeconds] = useState(0.0);

    const normalise = (value: number) => ((value) * 100) / (maxTime);

    return (
        <FooterBox component="footer">
            <Box
                maxWidth={(width > theme.breakpoints.values.md)?260:"100%"}
                sx={{
                    padding: "0 40px",
                    justifyContent: "space-between !important",
                    alignItems: "center",

                    [theme.breakpoints.down("lg")]: {
                        padding: "0 20px",
                    },

                    [theme.breakpoints.down("md")]: {
                        padding: "0 16px",
                    }
                }}
            >
                <StyledButton>
                    <IconContainerDarkModeDark sx={{ fontSize: "24px" }}>
                        <SkipPreviousSharp />
                    </IconContainerDarkModeDark>
                </StyledButton>
                <PauseButton onClick={() => setPlaying(!playing)} isPlaying={playing} />
                <StyledButton>
                    <IconContainerDarkModeDark sx={{ fontSize: "24px" }}>
                        <SkipNextSharp />
                    </IconContainerDarkModeDark>
                </StyledButton>
            </Box>
            <Box sx={{ textAlign: "center", flexDirection: "column" }}>
                <TextBold14
                    text={"Dua Lipa / Break My Heart"}
                    textProps={{
                        sx: {
                            color: "text.secondary"
                        }
                    }}
                />
                <TextRegular14
                    text={SecondsToTimeFormat(playedSeconds)+ " / " +SecondsToTimeFormat(maxTime)}
                    textProps={{
                        sx: {
                            color: "text.secondary"
                        }
                    }}
                />
            </Box>
            <Box maxWidth={164} sx={{ flexGrow:(width < theme.breakpoints.values.sm)?"0 !important":1, position: "relative" }}>
                <VideoMin
                    playing={playing}
                    setMaxTime={setMaxTime}
                    setPlayedSeconds={setPlayedSeconds}
                    setBufferSeconds={setBufferSeconds}
                />
            </Box>
            <Box sx={{ display: "block !important", width: "100%", position: "absolute", bottom: 0, left: 0 }}>
                <LinearProgress
                    variant="determinate"
                    value={normalise(playedSeconds)}
                />
            </Box>
        </FooterBox>
    )
}

export default VideoFooter;