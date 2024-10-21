import { ArrowBack, ArrowForward, FilterAltOutlined } from "@mui/icons-material";
import { Box } from "@mui/material";
import React from "react";
import { GenericText } from '../../../lang/common/genericText';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import useTranslation from '../../../utility/useTranslation';
import useWindowSize from '../../../utility/windowSize';
import { ArrowButton } from "../../project-player/layoutPage/styledComponents/carouselStyledComponents";
import { StyledButton } from "../buttons/styledButton";
import { IconContainerDarkModeDark, IconContainerGrey } from "../iconContainer/iconContainer";
import { ItemsHeaderBox, ItemsHeaderTitleBox, StyledTitleContainer, VideosHeaderActionBox } from "../styledComponents/styledComponents";
import { StyledText, TextBold20, TextMedium14 } from '../styledText/styledText';

interface ItemHeaderBoxProps {
    title: string,
    items: any[],
    totalItems: number,
    offset: number,
    setOffset: (offset: number) => void,
    limit: number,
}

const ItemHeaderBox = ({title, totalItems, offset, setOffset, limit}: ItemHeaderBoxProps) => {
    const genericText = useTranslation(GenericText).t;
    const { width } = useWindowSize();
    const { theme } = React.useContext(AccessibilityContext);

    const [openFilters, setOpenFilters] = React.useState(false);

    return (
        <ItemsHeaderBox>
            <ItemsHeaderTitleBox>
                <StyledTitleContainer>
                    <TextBold20
                        text={title}
                        containerSx={{
                            lineHeight: "24px"
                        }}
                    />
                </StyledTitleContainer>
                <TextMedium14
                    text={["/",totalItems.toLocaleString()].join(" ")+" "+genericText("results")}
                    containerSx={{
                        lineHeight: "22px"
                    }}
                />
            </ItemsHeaderTitleBox>
            <VideosHeaderActionBox>
                {width<theme.breakpoints.values.md?
                    <Box sx={{ marginRight: "16px" }}>
                        <StyledButton onClick={() => setOpenFilters(true)} variant="contained" sx={{ padding: width>450?"6px 6px 6px 12px":"6px" }}>
                            {width>450?<StyledText text={genericText("filters")} sx={{ fontSize: "17px", marginRight: "4px" }} />
                            :null}
                            <IconContainerGrey>
                                <FilterAltOutlined  />
                            </IconContainerGrey>
                        </StyledButton>
                    </Box>
                :
                null}
                <Box sx={{ position: "relative" }}>
                    <ArrowButton
                        disabled={offset === 0}
                        onClick={() => {if(limit)setOffset((offset - limit) < 0 ? 0 : offset - limit)}}
                        variant="contained"
                        sx={{
                            position: "relative",
                            top: 0,
                            transform: "none",
                            marginRight: "15px",

                            [theme.breakpoints.down('md')]: {
                                marginRight: "8px",
                            }
                        }}
                    >
                        <IconContainerDarkModeDark className="darker" sx={{ fontSize: "24px" }}>
                            <ArrowBack />
                        </IconContainerDarkModeDark>
                    </ArrowButton>
                    <ArrowButton
                        disabled={limit?offset + limit >= totalItems:false}
                        onClick={() => {if(limit)setOffset((offset + limit) > totalItems ? offset : offset + limit)}}
                        variant="contained"
                        sx={{
                            position: "relative",
                            top: 0,
                            transform: "none"
                        }}
                    >
                        <IconContainerDarkModeDark className="darker" sx={{ fontSize: "24px" }}>
                            <ArrowForward />
                        </IconContainerDarkModeDark>
                    </ArrowButton>
                </Box>
            </VideosHeaderActionBox>
        </ItemsHeaderBox>
    )
}

export default ItemHeaderBox;