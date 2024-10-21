import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Box } from "@mui/material";
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect } from "react";
import "swiper/css";
import { Keyboard, Mousewheel, Navigation, Scrollbar } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { RowItem } from "../../../../interfaces/projectPlayer/rowItem";
import { ExceptionStrings } from '../../../../lang/common/exceptions';
import { GenericText } from '../../../../lang/common/genericText';
import { RefreshIfLoggedOut } from "../../../../lib/refreshIfLoggedOut";
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import { LoadingContext } from "../../../../store/providers/loadingProvider";
import { LockContext } from "../../../../store/providers/lockProvider";
import utf8ToB64 from '../../../../utility/stringToBase64';
import useTranslation from '../../../../utility/useTranslation';
import useWindowSize from '../../../../utility/windowSize';
import StyledArrowButton from "../../../common/buttons/arrowButton";
import StyledDeletePrompt from '../../../common/deletePrompt/deletePrompt';
import { RowBgGray } from "../../../common/rowBackgrounds/rowBackgrounds";
import LayoutActionComponent from "../../action/layout/layoutActionComponent";
import { CarouselContainerBox, CarouselItemBox } from '../styledComponents/carouselStyledComponents';
import CarouselHeader from "./carouselHeader/carouselHeader";
import CarouselItemContent from "./carouselItemContent/carouselItemContent";
import CarouselSliderMenu from "./carouselSliderMenu/carouselSliderMenu";

interface FeaturedCarouselProps {
    featuredRowProp: {
        id: string,
        type: string,
        items: RowItem[],
        locked: string | null,
    },
    setFeaturedRowProp: (featuredRowProp: FeaturedCarouselProps['featuredRowProp']) => void,
}

const FeaturedCarousel = ({ featuredRowProp, setFeaturedRowProp }: FeaturedCarouselProps) => {
    const exception = useTranslation(ExceptionStrings).t;
    const genericText = useTranslation(GenericText).t;
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { width } = useWindowSize();
    const { theme } = React.useContext(AccessibilityContext);
    const prevRef = React.useRef<HTMLButtonElement>(null);
    const nextRef = React.useRef<HTMLButtonElement>(null);
    const [rowItem, setRowItem] = React.useState<typeof featuredRowProp.items[number]>();
    const [openAddItem, setOpenAddItem] = React.useState(false);
    const [openEditItem, setOpenEditItem] = React.useState(false);
    const [prevEl, setPrevEl] = React.useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = React.useState<HTMLButtonElement | null>(null);
    const [isSlideAdded, setIsSlideAdded] = React.useState(false);
    const { setLoading } = React.useContext(LoadingContext);
    const [isRowLocked, setIsRowLocked] = React.useState(false);
    const [rowLockedBy, setRowLockedBy] = React.useState('');
    const [remainingTime, setRemainingTime] = React.useState<null | number>(null);
    const [slideNumber, setSlideNumber] = React.useState(0);
    const [slideLength, setSlideLength] = React.useState(featuredRowProp?.items.length);

    const [dateOfLock, setDateOfLock] = React.useState<Date | null>(null);

    const [deletePromptOpen, setDeletePromptOpen] = React.useState(false);

    const { lockEntity, lockedEntities } = React.useContext(LockContext);

    const abortController = new AbortController();

    const bgColors = {
        light: "rgba(255,255,255,0.6)",
        dark: "rgba(0,0,0,0.6)"
    }

    async function fetchData() {
        try {
            const response = await fetch('/api/project-player/layout', {
                method: 'POST',
                body: JSON.stringify({
                    action: 'layoutRows',
                    id: router.query.layoutId,
                }),
                signal: abortController.signal,
            })

            if (!response.ok) {
                throw new Error(await response.json())
            }

            const data = await response.json()
            const featuredRowProp = data.find((row: any) => row.featured === true)
            setFeaturedRowProp(featuredRowProp)
        } catch (err: any) {
            if (abortController.signal.aborted) {
                console.log('The user aborted the request')
            } else {
                if (err.message) RefreshIfLoggedOut(err.message)
                enqueueSnackbar(exception('noLayoutItemFound'), { variant: 'error' })
            }
        }
    }

    function orderRowItems(rowIds: string[]) {
        fetch('/api/project-player/layout/row', {
            method: "POST",
            body: JSON.stringify({
                action: "orderRowItems",
                id: featuredRowProp?.id,
                layoutItemIds: rowIds,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    enqueueSnackbar(exception("rowItemReorderSuccess"), { variant: 'success' });
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception('couldntReorderItems'), { variant: 'error' });
                    //console.error('The request failed');
                }
            });
    }

    function deleteRowItem(id: string) {
        setLoading(true);
        fetch('/api/project-player/layout/rowItem', {
            method: "POST",
            body: JSON.stringify({
                action: "delete",
                id: id,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    enqueueSnackbar(exception("rowItemDeleted"), { variant: 'success' });
                    fetchData();
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("rowItemNotDeleted"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleLock = async (action?: string) => {
        setLoading(true);
        let apiAction = "";
        if (action === "lock" || action === "unlock") {
            apiAction = action;
        }
        else if (!isRowLocked) apiAction = "lock";
        else apiAction = "unlock";
        if (featuredRowProp?.id) {
            const lockSuccess = await lockEntity("layout_row", featuredRowProp.id, apiAction);
            if (lockSuccess && apiAction === "lock") {
                setDateOfLock(new Date());
                setIsRowLocked(true);
                setRowLockedBy("you");
                enqueueSnackbar(exception("rowLockSuccess"), { variant: 'success' });
                setLoading(false);
                return "locked";
            }
            else if (lockSuccess && apiAction === "unlock") {
                setIsRowLocked(false);
                setRemainingTime(null);
                setRowLockedBy("");
                enqueueSnackbar(exception("rowUnlockSuccess"), { variant: 'success' });
                setLoading(false);
                return "unlocked";
            }
            else if (!lockSuccess && apiAction === "lock") {
                fetchData();
            }
            else if (!lockSuccess && apiAction === "unlock") {
                setIsRowLocked(true);
            }
            setLoading(false);
            return false;
        }
        setLoading(false);
        return false;
    }

    const handleTimeExtend = async () => {
        setLoading(true);
        if (featuredRowProp?.id) {
            const lockSuccess = await lockEntity("layout_row", featuredRowProp.id, "lock");
            if (lockSuccess) {
                setRemainingTime(600);
                setIsRowLocked(true);
                setRowLockedBy("you");
                enqueueSnackbar(exception("timeExtendSuccess"), { variant: 'success' });
            }
        }
        setLoading(false);
    }

    const handleEditItem = async (itemId: string) => {
        setLoading(true);
        fetch('/api/project-player/layout/rowItem', {
            method: "POST",
            body: JSON.stringify({
                action: "get",
                id: itemId,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data: RowItem) => {
                if (data) setRowItem(data);
                setTimeout(() => {
                    setOpenEditItem(true);
                }, 100);
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("noRowItemFound"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
            });

    }

    const clearCarousel = (id: string) => {
        setLoading(true);
        fetch('/api/project-player/layout/row', {
            method: "POST",
            body: JSON.stringify({
                action: "clearLayoutItems",
                id: id,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    enqueueSnackbar(exception("rowCleared"), { variant: 'success' });
                    fetchData();
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("rowAlreadyEmpty"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
                setDeletePromptOpen(false);
            });
    }

    const moveLeft = async (index: number) => {
        if (index > 0) {
            _swap(index, index - 1);
        } else {
            enqueueSnackbar(exception("cannotMoveLeft"), { variant: "error", autoHideDuration: 2000 });
        }
    }

    const moveRight = async (index: number) => {
        if (featuredRowProp && index < featuredRowProp.items.length - 1) {
            _swap(index, index + 1);
        } else {
            enqueueSnackbar(exception("cannotMoveRight"), { variant: "error", autoHideDuration: 2000 });
        }
    }

    const _swap = (prop1: number, prop2: number) => {
        var tmpArray = featuredRowProp ? featuredRowProp.items : [];
        var tmp = tmpArray[prop1];
        tmpArray[prop1] = tmpArray[prop2];
        tmpArray[prop2] = tmp;

        const featuredRowIdsTemp = tmpArray.map((item: any) => item.id);
        orderRowItems(featuredRowIdsTemp);
    }

    const removeItem = async (id: string) => {
        if (featuredRowProp && featuredRowProp.items.length > 0) {
            deleteRowItem(id);
        } else {
            enqueueSnackbar(exception("rowItemNotDeleted"), { variant: "error", autoHideDuration: 2000 });
        }
    }


    useEffect(() => {
        if (openAddItem && typeof window !== "undefined") {
            if (!document.getElementsByTagName("html")[0].classList.contains("locked")) document.getElementsByTagName("html")[0].classList.add("locked");
        }

        return () => {
            if (typeof window !== "undefined") {
                if (document.getElementsByTagName("html")[0].classList.contains("locked")) document.getElementsByTagName("html")[0].classList.remove("locked");
            }
        }
    }, [openAddItem])

    useEffect(() => {
        if (prevRef.current) setPrevEl(prevRef.current);
        if (nextRef.current) setNextEl(nextRef.current);

        return () => {
            if (prevRef.current) setPrevEl(null);
            if (nextRef.current) setNextEl(null);
        }
    }, [prevRef, nextRef])

    useEffect(() => {
        if (typeof featuredRowProp !== "undefined" && featuredRowProp && featuredRowProp.id) {
            // check if item is locked in lockedEntities
            if (typeof lockedEntities !== "undefined" && featuredRowProp.locked && featuredRowProp.locked.toLowerCase() === "you") {
                setIsRowLocked(true);
                setRowLockedBy("you");

            }
            else if (featuredRowProp.locked) {
                setIsRowLocked(true);
                setRowLockedBy(featuredRowProp.locked);
            } else {
                setIsRowLocked(false);
                setRemainingTime(null);
                setRowLockedBy("");
            }
        }
    }, [featuredRowProp])

    useEffect(() => {
        if (lockedEntities && lockedEntities.layout_row && featuredRowProp) {
            const layoutRow: {
                [key: string]: string
            } = lockedEntities.layout_row;

            if (layoutRow[featuredRowProp.id]) {
                const date = new Date(layoutRow[featuredRowProp.id]);
                setDateOfLock(date);
            }
        }
    }, []);

    useEffect(() => {
        // set countdown timer remaining time based on dateOfLock + 600 seconds as a countdown timer with timeout
        const timer = setInterval(() => {
            if (dateOfLock) {
                const now = new Date();
                const diff = now.getTime() - dateOfLock.getTime();
                const remaining = 600 - Math.floor(diff / 1000);
                if (remaining > 0) {
                    setRemainingTime(remaining);
                } else {
                    setRemainingTime(null);
                    handleLock("unlock");
                    clearInterval(timer);
                }
            }
            else {
                clearInterval(timer);
            }
        }, 100);

        return () => {
            clearInterval(timer);
        }

    }, [dateOfLock]);

    const handleCategoryChange = (category: string) => {
        setLoading(true);
        fetch('/api/project-player/layout/row', {
            method: "POST",
            body: JSON.stringify({
                action: "update",
                id: featuredRowProp?.id,
                type: category
            }),
        })
            .then(async (response) => {
                if (response.ok) {
                    fetchData();
                    enqueueSnackbar(exception('updateCategorySuccess'), { variant: 'success' });
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("couldntUpdateRow"), { variant: "error" });
                    //console.error('The request failed');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <RowBgGray>
            <CarouselContainerBox>
                <CarouselHeader
                    type={featuredRowProp ? featuredRowProp.type : null}
                    itemsLength={featuredRowProp ? featuredRowProp.items.length : null}
                    setDeletePromptOpen={setDeletePromptOpen}
                    setOpenAddItem={setOpenAddItem}
                    isRowLocked={isRowLocked}
                    rowLockedBy={rowLockedBy}
                    remainingTime={remainingTime}
                    handleTimeExtend={handleTimeExtend}
                    handleLock={handleLock}
                    handleCategoryChange={handleCategoryChange}
                />
                <Swiper
                    slidesPerView={"auto"}
                    centeredSlides={true}
                    spaceBetween={0}
                    threshold={10}
                    scrollbar={true}
                    freeMode={{
                        enabled: true,
                        momentum: true,
                    }}
                    mousewheel={true}
                    keyboard={true}
                    draggable={false}
                    className="mySwiper"
                    navigation={{
                        prevEl: prevEl,
                        nextEl: nextEl
                    }}
                    modules={[Navigation, Scrollbar, Mousewheel, Keyboard]}
                    onSlidesLengthChange={(swiper) => {
                        setSlideLength(swiper.slides.length);
                        if (isSlideAdded) {
                            swiper.slideTo(swiper.slides.length - 1);
                            setSlideNumber(swiper.slides.length - 1);
                            setIsSlideAdded(false);
                        }
                    }}
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
                            disabled: slideNumber === (slideLength ? slideLength - 1 : 0),
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
                    {(typeof featuredRowProp !== "undefined" && featuredRowProp && featuredRowProp.items.length > 0) ? featuredRowProp.items.map((item, index: number) => {
                        const imageUrl = process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + item.id + "/image.jpg?width=700&height=394&cache=" + utf8ToB64(item.updated_at);
                        return (
                            <SwiperSlide style={{ width: (width < theme.breakpoints.values["sm"]) ? "100%" : "68.24%", aspectRatio: "16/9" }} key={index}>
                                <CarouselItemBox
                                    width="inherit"
                                    height="inherit"
                                    maxHeight={"100%"}
                                    sx={{
                                        [theme.breakpoints.up("lg")]: {
                                            maxWidth: "650px",
                                            maxHeight: "366px"
                                        }
                                    }}
                                >
                                    <Image
                                        src={imageUrl}
                                        alt={item.description}
                                        sizes="100vw"
                                        fill
                                    />
                                    <CarouselItemContent
                                        item={item}
                                        bgColors={bgColors}
                                    />
                                    <CarouselSliderMenu
                                        item={item}
                                        sliderLength={featuredRowProp.items.length}
                                        index={index}
                                        isRowLocked={isRowLocked}
                                        rowLockedBy={rowLockedBy}
                                        handleLock={handleLock}
                                        handleEditItem={handleEditItem}
                                        moveLeft={moveLeft}
                                        moveRight={moveRight}
                                        removeItem={removeItem}
                                    />
                                </CarouselItemBox>
                            </SwiperSlide>
                        )
                    }) : null}
                </Swiper>
            </CarouselContainerBox>
            {
                (typeof featuredRowProp !== "undefined" && featuredRowProp && featuredRowProp.id) ?
                    <Box>
                        <LayoutActionComponent
                            action={"add"}
                            type={"carousel"}
                            fetchRowData={fetchData}
                            rowId={featuredRowProp.id}
                            open={openAddItem}
                            setOpen={setOpenAddItem}
                            setIsSlideAdded={setIsSlideAdded}
                        />
                        {(typeof rowItem !== "undefined" && rowItem.id) ?
                            <LayoutActionComponent
                                action={"edit"}
                                type={"carousel"}
                                setRowItem={setRowItem}
                                fetchRowData={fetchData}
                                open={openEditItem}
                                setOpen={setOpenEditItem}
                                rowItem={rowItem}
                            />
                            : null}
                    </Box>
                    : null
            }
            <StyledDeletePrompt
                open={deletePromptOpen}
                setOpen={setDeletePromptOpen}
                confirmFunction={clearCarousel}
                cancelFunction={() => setDeletePromptOpen(false)}
                id={featuredRowProp ? featuredRowProp.id : ''}
                title={genericText("clearRowPrompt")}
            />
        </RowBgGray>
    )
}

export default FeaturedCarousel;