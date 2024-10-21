import { Box, styled } from '@mui/material';
import { TextBlack10 } from '../styledText/styledText';
import useTranslation from '../../../utility/useTranslation';
import { GenericText } from '../../../lang/common/genericText';

const StyledContainer = styled(Box)(({theme}) => ({
    minWidth: 0,
    height: "60px",
    padding: "8px 15px 8px 9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 0,
    color: theme.palette.text.primary,
    textTransform: "none",
    boxShadow: "none !important",
    position: "sticky",
    top: 0,
    borderBottom: "2px solid "+theme.palette.divider,
    backgroundColor: theme.palette.background.paper,
    zIndex: 2,
    '& > div': { paddingRight: "4px", paddingLeft: "4px" }
}))

const PlaylistTitleRow = ({noEdit}: { noEdit?: boolean }) => {
    const genericText = useTranslation(GenericText).t;

    return (
        <StyledContainer>
            <Box sx={{ display: "flex", alignItems: "center", width: "35%" }}>
                <TextBlack10
                    text={genericText("select")}
                    containerSx={{
                        lineHeight: "11px",
                    }}
                    textProps={{
                        sx:{
                            textTransform: "uppercase"
                        }
                    }}
                />
                <Box
                    sx={{
                        width: "113px"
                    }}
                ></Box>
                <TextBlack10
                    text={genericText("title")}
                    containerSx={{
                        lineHeight: "11px",
                    }}
                    textProps={{
                        sx:{
                            textTransform: "uppercase"
                        }
                    }}
                />
            </Box>
            <TextBlack10
                text={genericText("artists")}
                containerSx={{
                    lineHeight: "11px",
                    width: "calc((100% - 35% - 243px)/2)"
                }}
                textProps={{
                    sx:{
                        textTransform: "uppercase"
                    }
                }}
            />
            <TextBlack10
                text={genericText("owner")}
                containerSx={{
                    lineHeight: "11px",
                    width: "calc((100% - 35% - 243px)/2)"
                }}
                textProps={{
                    sx:{
                        textTransform: "uppercase"
                    }
                }}
            />
            <TextBlack10
                text={genericText("release")}
                containerSx={{
                    lineHeight: "11px",
                    width: "50px"
                }}
                textProps={{
                    sx:{
                        textTransform: "uppercase"
                    }
                }}
            />
            <TextBlack10
                text={genericText("version")}
                containerSx={{
                    lineHeight: "11px",
                    width: "75px"
                }}
                textProps={{
                    sx:{
                        textTransform: "uppercase"
                    }
                }}
            />
            {typeof noEdit === "undefined" || !noEdit ?
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <TextBlack10
                    text={genericText("rating")}
                    containerSx={{
                        lineHeight: "11px",
                        width: "53px"
                    }}
                    textProps={{
                        sx:{
                            textTransform: "uppercase"
                        }
                    }}
                />
                <Box
                    sx={{
                        width: "47px"
                    }}
                ></Box>
            </Box>
            : null}
        </StyledContainer>
    )
}

export default PlaylistTitleRow;