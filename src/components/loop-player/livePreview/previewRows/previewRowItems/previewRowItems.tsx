import { Box } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { FreeMode, Keyboard, Mousewheel, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { RowItem } from '../../../../../interfaces/projectPlayer/rowItem';
import { AccessibilityContext } from "../../../../../store/providers/accessibilityProvider";
import { getBgColor } from '../../../../../utility/getContrastBgColor';
import utf8ToB64 from '../../../../../utility/stringToBase64';
import useWindowSize from '../../../../../utility/windowSize';
import { TextMedium12, TextMedium14 } from '../../../../common/styledText/styledText';
import { SliderItemBox } from '../../../layoutPage/styledComponents/rowsStyledComponents';

interface PreviewRowItemsProps {
    slideItems: RowItem[];
    index: number;
}

const PreviewRowItems = ({ slideItems, index }: PreviewRowItemsProps) => {
    const { width } = useWindowSize();

    const { theme } = React.useContext(AccessibilityContext);

    const bgColors = {
        light: index % 2 === 0 ? theme.palette.background.paper : "transparent",
        dark: index % 2 === 0 ? theme.palette.background.paper : "transparent",
    }

    return (
        <Swiper
            slidesPerView={"auto"}
            scrollbar={true}
            mousewheel={true}
            spaceBetween={20}
            threshold={10}
            freeMode={{
                enabled: true,
                momentum: true,
            }}
            keyboard={true}
            modules={[Scrollbar, Mousewheel, Keyboard, FreeMode]}
        >
            {slideItems.map((slider, sliderIndex) => {
                return (
                    <SwiperSlide
                        style={{
                            width: (width < 410) ? "100%" : (width < theme.breakpoints.values["sm"]) ? "80%" : (width < theme.breakpoints.values["md"]) ? "40%" : "23.5%",
                            height: "100%"
                        }}
                        key={"swiper_slider_" + index + "_" + sliderIndex}>
                        <SliderItemBox height={"100%"} maxHeight={"100%"} key="1" >
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "100%",
                                    aspectRatio: "16/9",
                                }}
                            >
                                <Image
                                    src={process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + slider.id + "/image.jpg?width=350&height=197&cache=" + utf8ToB64(slider.updated_at)}
                                    alt="placeholder"
                                    fill
                                    style={{
                                        objectFit: "cover",
                                        objectPosition: "center"
                                    }}
                                    sizes="100%"
                                />
                            </Box>
                            <Box
                                sx={{
                                    borderRadius: "4px",
                                    padding: "0 2px",
                                    backgroundColor: slider.data.text_color ?
                                        getBgColor(slider.data.text_color)
                                        : slider.data.description_color ?
                                            getBgColor(slider.data.description_color)
                                            : getBgColor(theme.palette.text.primary, bgColors),
                                }}
                            >
                                {slider.data.hide_title ? null :
                                    <TextMedium14
                                        containerSx={{
                                            marginTop: "15px",
                                            lineHeight: "17px"
                                        }}
                                        text={slider.title}
                                        textComponent="h4"
                                        textProps={{
                                            sx: {
                                                color: slider.data.text_color ? slider.data.text_color : undefined,
                                            }
                                        }}
                                    />
                                }
                                {slider.data.hide_description ? null :
                                    <TextMedium12
                                        containerSx={{
                                            marginTop: "5px",
                                            lineHeight: "15px"
                                        }}
                                        text={slider.description}
                                        textComponent="h5"
                                        textProps={{
                                            sx: {
                                                color: slider.data.description_color ? slider.data.description_color : "text.secondary"
                                            }
                                        }}
                                    />
                                }
                            </Box>
                        </SliderItemBox>
                    </SwiperSlide>
                )
            })}
        </Swiper>
    )
}

export default PreviewRowItems;