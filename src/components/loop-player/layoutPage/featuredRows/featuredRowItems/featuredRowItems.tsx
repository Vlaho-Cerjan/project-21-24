import { Box } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useContext } from 'react';
import { FreeMode, Keyboard, Mousewheel, Scrollbar } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { RowItem } from '../../../../../interfaces/projectPlayer/rowItem';
import { ExceptionStrings } from '../../../../../lang/common/exceptions';
import { RefreshIfLoggedOut } from '../../../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../../../store/providers/accessibilityProvider";
import { LoadingContext } from '../../../../../store/providers/loadingProvider';
import useTranslation from '../../../../../utility/useTranslation';
import useWindowSize from '../../../../../utility/windowSize';
import LayoutActionComponent from '../../../action/layout/layoutActionComponent';
import FeaturedRowItemsContent from './featuredRowItemsContent/featuredRowItemsContent';
import { FeaturedRowItemsStrings } from './lang/featuredRowItemsStrings';

interface FeaturedRowItemsProps {
    slideItems: RowItem[];
    itemId: string;
    index: number;
    items: {
        id: string;
        title?: string;
        items: RowItem[];
        type: string;
        locked: string | null;
    }[];
    setItems: (value: React.SetStateAction<{
        id: string;
        title?: string;
        items: RowItem[];
        type: string;
        locked: string | null;
    }[] | null>) => void;
    fetchData: () => void;
    isSlideAdded: boolean;
    setIsSlideAdded: React.Dispatch<React.SetStateAction<boolean>>;
    isItemLocked: {
        id: string;
        locked: boolean;
        lockedBy: string;
    }[]
    handleItemLock: (id: string) => Promise<false | "locked" | "unlocked" | undefined>;
}

const FeaturedRowItems = ({ slideItems, itemId, index, items, setItems, fetchData, isSlideAdded, setIsSlideAdded, isItemLocked, handleItemLock }: FeaturedRowItemsProps) => {
    const { width } = useWindowSize();
    const exception = useTranslation(ExceptionStrings).t;
    const { t } = useTranslation(FeaturedRowItemsStrings);
    const { theme } = useContext(AccessibilityContext);
    const [openEditRowItem, setOpenEditRowItem] = React.useState(false);
    const [rowItem, setRowItem] = React.useState<typeof slideItems[number]>();
    const [slideRowItems, setSlideRowItems] = React.useState<typeof slideItems>(slideItems);

    const bgColors = {
        light: "rgba(255,255,255,0.6)",
        dark: "rgba(0,0,0,0.6)"
    }

    React.useEffect(() => {
        setSlideRowItems(slideItems);
    }, [slideItems])

    const { enqueueSnackbar } = useSnackbar();
    const { setLoading } = React.useContext(LoadingContext);

    const [anchorItemEl, setAnchorItemEl] = React.useState<any | null>(null);

    const handleItemClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const target = event.currentTarget;

        if (target && target.id) {
            setAnchorItemEl((prevState: any) => ({
                ...prevState,
                [target.id]: target
            }));
        }
    }

    const handleItemClose = () => {
        setAnchorItemEl(null);
    }

    const abortController = new AbortController();

    const handleEditClick = (id: string) => {
        handleItemClose();
        setLoading(true);
        fetch('/api/project-player/layout/rowItem', {
            method: "POST",
            body: JSON.stringify({
                action: "get",
                id: id,
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
                setRowItem(data);
                setTimeout(() => {
                    setOpenEditRowItem(true);
                }, 100);
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("noRowItemsFound"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const moveLeft = (id: string, index: number) => {
        if (index > 0) {
            _swap(id, index, index - 1);
        } else {
            enqueueSnackbar(exception("cannotMoveLeft"), { variant: "error", autoHideDuration: 2000 });
        }
    }

    const moveRight = (id: string, index: number) => {
        const tempItem = items.find((item) => item.id === id)?.items;

        if (typeof tempItem === "undefined") return;

        if (index < tempItem.length - 1) {
            _swap(id, index, index + 1);
        } else {
            enqueueSnackbar(exception("cannotMoveRight"), { variant: "error", autoHideDuration: 2000 });
        }
    }

    const _swap = (id: string, prop1: number, prop2: number) => {
        var tmpArray = items.find((item) => item.id === id)?.items;
        if (typeof tmpArray === "undefined") return;
        var tmp = tmpArray[prop1];
        tmpArray[prop1] = tmpArray[prop2];
        tmpArray[prop2] = tmp;

        const rowIdsTemp = tmpArray.map((item: any) => item.id);
        orderRowItems(id, rowIdsTemp);
    }

    function deleteRowItem(id: string, itemId: string) {
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
                    setItems((prevState) => {
                        if (prevState === null) return prevState;
                        const tempItems = prevState.map((item) => {
                            if (item.id === itemId) {
                                const tempItems = item.items.filter((item) => item.id !== id);
                                item.items = tempItems;
                            }
                            return item;
                        });
                        return tempItems;
                    })
                    enqueueSnackbar(exception("rowItemDeleted"), { variant: 'success' });
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

    function orderRowItems(id: string, rowIds: string[]) {
        fetch('/api/project-player/layout/row', {
            method: "POST",
            body: JSON.stringify({
                action: "orderRowItems",
                id: id,
                layoutItemIds: rowIds,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
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
            })
    }

    return (
        <Box>
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
                onSlidesLengthChange={(swiper) => {
                    if (isSlideAdded) {
                        swiper.slideTo(swiper.slides.length - 1);
                        setIsSlideAdded(false);
                    }
                }}
            >
                {slideRowItems.map((slider, sliderIndex) => {
                    return (
                        <SwiperSlide
                            style={{
                                width: (width < 410) ? "100%" : (width < theme.breakpoints.values["sm"]) ? "80%" : (width < theme.breakpoints.values["md"]) ? "40%" : "23.5%",
                                height: "100%"
                            }}
                            key={"swiper_slider_" + index + "_" + sliderIndex}>
                            <FeaturedRowItemsContent
                                slider={slider}
                                sliderIndex={sliderIndex}
                                index={index}
                                bgColors={bgColors}
                                handleEditClick={handleEditClick}
                                handleItemClick={handleItemClick}
                                handleItemClose={handleItemClose}
                                handleItemLock={handleItemLock}
                                anchorItemEl={anchorItemEl}
                                isItemLocked={isItemLocked}
                                moveLeft={moveLeft}
                                moveRight={moveRight}
                                itemId={itemId}
                                deleteRowItem={deleteRowItem}
                            />
                        </SwiperSlide>
                    )
                })}
            </Swiper>
            {(typeof rowItem !== "undefined" && rowItem.id) ?
                <LayoutActionComponent
                    action="edit"
                    type="row"
                    rowId={itemId}
                    open={openEditRowItem}
                    setOpen={setOpenEditRowItem}
                    rowItem={rowItem}
                    setRowItem={setRowItem}
                    fetchRowData={fetchData}
                />
                :
                null
            }
        </Box>
    )
}

export default FeaturedRowItems;