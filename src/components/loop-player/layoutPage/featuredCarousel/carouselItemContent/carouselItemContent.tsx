import { Box } from "@mui/material";
import Image from "next/image";
import { RowItem } from "../../../../../interfaces/projectPlayer/rowItem";
import { getBgColor } from "../../../../../utility/getContrastBgColor";
import { TextMedium14, TextMedium18 } from "../../../../common/styledText/styledText";
import { CarouselItemContentContainer } from "../../styledComponents/carouselStyledComponents";

interface CarouselItemContentProps {
    item: RowItem,
    bgColors: {
        light: string,
        dark: string
    }
}

const CarouselItemContent = ({
    item,
    bgColors
} : CarouselItemContentProps
) => {

    return (
        <CarouselItemContentContainer>
            <Box sx={{ position: "relative", textAlign: "left", height: "64px", width: "192px", '& *': { borderRadius: 0 } }}>
                {item.logo ?
                    <Image
                        src={item.logo}
                        alt={item.title + " logo"}
                        style={{
                            objectFit: "contain",
                            objectPosition: "left"
                        }}
                        sizes="192px"
                        fill
                    />
                    : null}
            </Box>
            <Box
                sx={{
                    borderRadius: "4px",
                    padding: "0 2px",
                    marginTop: "10px",
                    backgroundColor: item.data.text_color ?
                        getBgColor(item.data.text_color, bgColors)
                        : item.data.description_color ?
                            getBgColor(item.data.description_color, bgColors)
                            :
                            getBgColor("#ffffff", bgColors),
                }}
            >
                {item.data.hide_title ? null :
                    <TextMedium18
                        text={item.title}
                        containerSx={{
                            lineHeight: "21px",
                        }}
                        textProps={{
                            variant: "h3",
                            color: item.data.text_color ? item.data.text_color : "#fff",
                        }}
                    />
                }
                {item.data.hide_description ? null :
                    <TextMedium14
                        text={item.description}
                        containerSx={{
                            lineHeight: "16px",
                            marginTop: "10px"
                        }}
                        textProps={{
                            sx: {
                                color: item.data.description_color ? item.data.description_color : "#fff",
                            }
                        }}
                    />
                }
            </Box>
        </CarouselItemContentContainer>
    )
}

export default CarouselItemContent