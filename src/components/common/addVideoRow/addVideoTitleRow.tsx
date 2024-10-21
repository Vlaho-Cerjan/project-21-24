import { Box, styled } from '@mui/material';
import { TextBlack10 } from '../styledText/styledText';
import useTranslation from '../../../utility/useTranslation';
import { GenericText } from '../../../lang/common/genericText';

const StyledContainer = styled(Box)(({theme}) => ({
    minWidth: 0,
    height: "60px",
    padding: "8px 15px 8px 25px",
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

const AddVideoTitleRow = () => {
    const genericText = useTranslation(GenericText).t;

    return (
        <StyledContainer>
            <Box sx={{ display: "flex", alignItems: "center", width: "30%" }}>
                <Box
                    sx={{
                        width: "103px"
                    }}
                ></Box>
                <TextBlack10
                    text={genericText("name")}
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
                    width: "calc((100% - 30% - 258px)/2)"
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
                    width: "calc((100% - 30% - 258px)/2)"
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
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <TextBlack10
                    text={genericText("featured")}
                    containerSx={{
                        lineHeight: "11px",
                        width: "100px",
                        textAlign: "center"
                    }}
                    textProps={{
                        sx:{
                            textTransform: "uppercase"
                        }
                    }}
                />
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
        </StyledContainer>
    )
}

export default AddVideoTitleRow;