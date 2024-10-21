import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box } from "@mui/material";
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from "react";
import "swiper/css";
import { Keyboard, Mousewheel, Navigation, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Error } from "../../../../interfaces/error/error";
import { RowItem } from '../../../../interfaces/projectPlayer/rowItem';
import { RefreshIfLoggedOut } from '../../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import { getBgColor } from "../../../../utility/getContrastBgColor";
import utf8ToB64 from "../../../../utility/stringToBase64";
import useTranslation from "../../../../utility/useTranslation";
import useWindowSize from '../../../../utility/windowSize';
import StyledArrowButton from "../../../common/buttons/arrowButton";
import { RowBgGray } from "../../../common/rowBackgrounds/rowBackgrounds";
import { TextMedium14, TextMedium16, TextMedium18 } from "../../../common/styledText/styledText";
import { FeaturedCarouselStrings } from "../../layoutPage/featuredCarousel/lang/featuredCarouselStrings";
import {
    CarouselContainerBox,
    CarouselContentContainer,
    CarouselItemBox,
    CarouselItemContentContainer,
} from '../../layoutPage/styledComponents/carouselStyledComponents';

interface PreviewCarouselProps {
    previewRowProp: {
        id: string,
        items: RowItem[]
    }
}

const PreviewCarousel = ({ previewRowProp }: PreviewCarouselProps) => {
    const { t } = useTranslation(FeaturedCarouselStrings);

    const prevRef = React.useRef<HTMLButtonElement>(null);
    const nextRef = React.useRef<HTMLButtonElement>(null);

    const [featuredRow, setFeaturedRow] = React.useState<typeof previewRowProp | null>(previewRowProp);
    const [prevEl, setPrevEl] = React.useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = React.useState<HTMLButtonElement | null>(null);
    const [slideNumber, setSlideNumber] = React.useState(0);
    const [slideLength, setSlideLength] = React.useState(previewRowProp.items.length);


    const bgColors = {
        light: "rgba(255,255,255,0.6)",
        dark: "rgba(0,0,0,0.6)"
    }


    React.useEffect(() => {
        if (prevRef.current) setPrevEl(prevRef.current);
        if (nextRef.current) setNextEl(nextRef.current);

        return () => {
            setPrevEl(null);
            setNextEl(null);
        }
    }, [prevRef, nextRef])

    const { width } = useWindowSize();
    const router = useRouter();
    const { theme } = React.useContext(AccessibilityContext);

    const abortController = new AbortController();

    function fetchData() {
        fetch('/api/project-player/layout', {
            method: "POST",
            body: JSON.stringify({
                action: "getPreview",
                id: router.query.layoutId,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data) => {
                if (data.rows) setFeaturedRow(data.rows.find((row: any) => row.featured === true));
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                }
                else RefreshIfLoggedOut(err.message);
            })

    }

    React.useEffect(() => {
        if (router.query.layoutId) fetchData();
    }, [router]);

    return (
        <RowBgGray>
            <CarouselContainerBox>
                <CarouselContentContainer>
                    <TextMedium16
                        containerSx={{
                            display: "flex"
                        }}
                        text={t("featuredCarousel")}
                    />
                </CarouselContentContainer>
                <Swiper
                    slidesPerView={"auto"}
                    centeredSlides={true}
                    spaceBetween={0}
                    threshold={10}
                    draggable={false}
                    scrollbar={true}
                    freeMode={{
                        enabled: true,
                        momentum: true,
                    }}
                    mousewheel={true}
                    keyboard={true}
                    className="mySwiper"
                    navigation={{
                        prevEl: prevEl,
                        nextEl: nextEl
                    }}
                    modules={[Navigation, Scrollbar, Mousewheel, Keyboard]}
                    onSlideChange={(swiper) => {
                        setSlideNumber(swiper.activeIndex);
                    }}
                >
                    <StyledArrowButton
                        icon={<ArrowBackIcon />}
                        buttonProps={{
                            disabled: slideNumber === 0,
                            ref: prevRef,
                        }}
                        props={{
                            sx: {
                                zIndex: 10,
                                position: "absolute",
                                top: "50%",
                                transform: "translateY(-50%)",
                                left: "40px",

                                [theme.breakpoints.down("lg")]: {
                                    left: "30px",
                                },

                                [theme.breakpoints.down("md")]: {
                                    left: "20px",
                                }

                            }
                        }}
                    />
                    <StyledArrowButton
                        icon={<ArrowForwardIcon />}
                        buttonProps={{
                            ref: nextRef,
                            disabled: slideNumber === slideLength - 1,
                        }}
                        props={{
                            sx: {
                                zIndex: 10,
                                position: "absolute",
                                top: "50%",
                                transform: "translateY(-50%)",
                                right: "40px",

                                [theme.breakpoints.down("lg")]: {
                                    right: "30px",
                                },

                                [theme.breakpoints.down("md")]: {
                                    right: "20px",
                                }
                            }
                        }}
                    />
                    {(typeof featuredRow !== "undefined" && featuredRow && featuredRow.items.length > 0) ? featuredRow.items.map((item: any, index: number) => {
                        const imageUrl = process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + item.id + "/image.jpg?width=650&height=366&cache=" + utf8ToB64(item.updated_at);
                        return (
                            <SwiperSlide style={{ width: (width < theme.breakpoints.values["sm"]) ? "100%" : "68.24%" }} key={index}>
                                <CarouselItemBox maxHeight={"100%"} key="1" >
                                    <Image
                                        src={imageUrl}
                                        alt="placeholder"
                                        width={1040}
                                        height={560}
                                        sizes="(max-width: 640px) 70vw, 1040px"
                                        quality="90"
                                    />
                                    <CarouselItemContentContainer>
                                        <Box sx={{ position: "relative", textAlign: "left", height: "64px", width: "192px", '& *': { borderRadius: 0 } }}>
                                            {item.logo ?
                                                <Image
                                                    src={item.logo}
                                                    alt="placeholder"
                                                    style={{
                                                        objectFit: "contain",
                                                        objectPosition: "left",
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
                                                    containerSx={{
                                                        lineHeight: "21px"
                                                    }}
                                                    textProps={{
                                                        variant: "h3",
                                                        sx: {
                                                            color: "#fff"
                                                        }
                                                    }}
                                                    text={item.title}
                                                />
                                            }
                                            {item.data.hide_description ? null :
                                                <TextMedium14
                                                    containerSx={{
                                                        marginTop: "10px",
                                                        lineHeight: "16px"
                                                    }}
                                                    text={item.description}
                                                    textProps={{
                                                        sx: {
                                                            color: "#fff"
                                                        }
                                                    }}
                                                />
                                            }
                                        </Box>
                                    </CarouselItemContentContainer>
                                    {//<Backdrop sx={{ position: "absolute", zIndex: 0, backgroundColor: "rgba(0,0,0,0.15)" }} open={true} />
                                    }
                                </CarouselItemBox>
                            </SwiperSlide>
                        )
                    }) : null}
                </Swiper>
            </CarouselContainerBox>
        </RowBgGray>
    )
}

export default PreviewCarousel;