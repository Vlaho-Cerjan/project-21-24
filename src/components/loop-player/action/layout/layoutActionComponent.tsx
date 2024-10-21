import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';
import { MuiColorInputFormat, MuiColorInputValue } from 'mui-color-input';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import React from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { useAppSelector } from '../../../../hooks';
import { Error } from '../../../../interfaces/error/error';
import { Mixer } from '../../../../interfaces/projectPlayer/mixer';
import { Playlist } from '../../../../interfaces/projectPlayer/playlist';
import { RowItem } from '../../../../interfaces/projectPlayer/rowItem';
import { Schedule } from '../../../../interfaces/projectPlayer/schedule';
import { ExceptionStrings } from '../../../../lang/common/exceptions';
import { GenericText } from '../../../../lang/common/genericText';
import apiRequest from '../../../../lib/apiRequest';
import { RefreshIfLoggedOut } from '../../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import { HexToRgba } from '../../../../utility/hex8ToRgba';
import { RemoveNullValues } from '../../../../utility/removeNullValues';
import { RgbaToHex8 } from '../../../../utility/rgbaToHex';
import utf8ToB64 from '../../../../utility/stringToBase64';
import useTranslation from '../../../../utility/useTranslation';
import StyledAddPlaylistRow from '../../../common/addPlaylistRow/addPlaylistRow';
import StyledColorInput from '../../../common/inputs/colorInput';
import StyledCheckbox from '../../../common/inputs/styledCheckbox';
import StyledInput from '../../../common/inputs/styledInput';
import { StyledLabel } from '../../../common/styledLabel/styledLabel';
import { TextBlack12, TextBlack18, TextMedium14 } from '../../../common/styledText/styledText';
import { StyledTitle } from "../../../common/styledTitle/styledTitle";
import StyledUpload16_9 from '../../../common/styledUpload/styledUpload16_9';
import { ActionItemContainer, ActionItemOverlayContainer, ItemsContainer, StyledActionButton, StyledActionContentBox, UploadFileContainer, UploadFileFormLabel } from '../../layoutPage/styledComponents/actionsStyledComponents';
import StyledLogoUpload from '../../layoutPage/styledComponents/styledLogoUpload';
import { ActionPagesStrings } from '../lang/actionPagesStrings';

const Limit = 20;

interface LayoutActionComponentProps {
    action: "edit" | "add",
    type: "carousel" | "row",
    open: boolean,
    setOpen: (open: boolean) => void,
    setIsSlideAdded?: React.Dispatch<React.SetStateAction<boolean>>
    rowId?: string,
    fetchRowData?: () => void,
    rowItem?: RowItem,
    setRowItem?: (rowItem: RowItem | undefined) => void
}

const LayoutActionComponent = ({ action, type, rowItem, setRowItem, fetchRowData, rowId, open, setOpen, setIsSlideAdded }: LayoutActionComponentProps) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const { theme, accessibility: { isDark } } = React.useContext(AccessibilityContext);

    const exception = useTranslation(ExceptionStrings).t;
    const genericText = useTranslation(GenericText).t;
    const { t } = useTranslation(ActionPagesStrings);

    const sessionData = useSession().data;

    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<Playlist | Schedule | Mixer | null>(null);
    const [selectedItemId, setSelectedItemId] = React.useState("");
    const [title, setTitle] = React.useState<string | null>("");
    const [description, setDescription] = React.useState<string | null>("");
    const [longDescription, setLongDescription] = React.useState<string | null>("");
    const [bgImage, setBgImage] = React.useState<string>("");
    const [logoImage, setLogoImage] = React.useState<string>("");
    const [selectType, setSelectType] = React.useState<string>("");
    const [items, setItems] = React.useState<any[]>([]);
    const [offset, setOffset] = React.useState(0);
    const [hasMore, setHasMore] = React.useState(true);
    const [clearInput, setClearInput] = React.useState(false);
    const [fetchingItems, setFetchingItems] = React.useState(false);
    const [hideTitle, setHideTitle] = React.useState(false);
    const [hideDescription, setHideDescription] = React.useState(false);
    const [itemType, setItemType] = React.useState<string>("");
    const actionContainerRef = React.useRef<HTMLFormElement>(null);
    const [contentType, setContentType] = React.useState<string>("");
    const [titleColor, setTitleColor] = React.useState<MuiColorInputValue>(type === "row" ? RgbaToHex8(theme.palette.text.primary) : "#ffffffff");
    const [descriptionColor, setDescriptionColor] = React.useState<MuiColorInputValue>(type === "row" ? RgbaToHex8(theme.palette.text.secondary) : "#ffffffff");
    const isMounted = React.useRef(false);

    const format: MuiColorInputFormat = 'hex8';

    const enumData = useAppSelector(state => state.enum).enumProject;

    const [itemTypes, setItemTypes] = React.useState<string[]>([]);

    React.useEffect(() => {
        const abortController = new AbortController();
        const FetchData = () => {
            setFetchingItems(true);
            let itemTypesLocal: string[] = [];
            if (typeof enumData !== "undefined" && enumData) {
                const tempItemTypes = Object.values(enumData.layout_item_type).map((item: string) => {
                    // add s to the end of the item type to match the api
                    if (item === "playlist") {
                        item = "playlists";
                    }
                    else if (item === "schedule") {
                        item = "schedules";
                    }
                    else if (item === "mixer") {
                        item = "mixers";
                    }
                    return item;
                });
                setItemTypes(tempItemTypes);
                itemTypesLocal = tempItemTypes;
            }

            if (typeof rowItem === "undefined") {
                fetch("/api/project-player/playlists", {
                    method: "POST",
                    body: JSON.stringify({
                        action: "list",
                        limit: Limit,
                        offset: 0,
                    }),
                    signal: abortController.signal
                })
                    .then(async (response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        return Promise.reject(await response.json());
                    })
                    .then((data: { total: number, [key: string]: any }) => {
                        // get the correct array of items
                        const dataItems = data.playlists;
                        if (dataItems) {
                            setItems(dataItems);
                        }
                        else {
                            enqueueSnackbar(exception("noLayoutItemsFound"), { variant: "error" });
                        }
                        setFetchingItems(false);
                    })
                    .catch((err: Error) => {
                        if (abortController.signal.aborted) {
                            console.log('The user aborted the request');
                        } else {
                            RefreshIfLoggedOut(err.message);
                            enqueueSnackbar(exception("noLayoutItemsFound"), { variant: "error" });
                            //console.error('The request failed');
                        }
                        setFetchingItems(false);
                    })
            }
            else {
                const apiUrl = "/api/project-player/" + itemTypesLocal.find(item => item.includes(rowItem.type));
                fetch(apiUrl, {
                    method: "POST",
                    body: JSON.stringify({
                        action: "list",
                        limit: Limit,
                        offset: 0,
                    }),
                    signal: abortController.signal
                })
                    .then(async (response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        return Promise.reject(await response.json());
                    })
                    .then((data: { total: number, [key: string]: any }) => {
                        // get the correct array of items
                        let dataItems = data[itemTypesLocal.find((itemType) => itemType === itemTypesLocal.find(item => item.includes(rowItem.type))) || ""];
                        setItemType(rowItem.type);
                        if (dataItems) {
                            const tempDataItems = dataItems.filter((item: any) => item.id !== rowItem.content_id);
                            /*if (tempDataItems.length === dataItems.length && tempSelectType !== "") {
                                setItems(dataItems);
                                setFetchingItems(false);
                            }*/
                            dataItems = tempDataItems;

                            const apiUrl = "/api/project-player/" + itemTypesLocal.find(item => item.includes(rowItem.type));

                            fetch(apiUrl, {
                                method: "POST",
                                body: JSON.stringify({
                                    action: "get",
                                    id: rowItem.content_id,
                                }),
                                signal: abortController.signal
                            })
                                .then(async (response) => {
                                    if (response.ok) {
                                        return response.json();
                                    }
                                    return Promise.reject(await response.json());
                                })
                                .then((item) => {
                                    dataItems.unshift(item);
                                    setSelectedItemId(item.id);
                                    if (rowItem.data && rowItem.data.content_type) setSelectType(itemTypesLocal.find(item => item.toLowerCase().includes(rowItem.data.content_type.toLowerCase())) || rowItem.data.content_type);
                                    else setSelectType(itemTypesLocal.find(item => item.toLowerCase().includes(rowItem.type.toLowerCase())) || "");
                                    setItems(dataItems);
                                    setFetchingItems(false);
                                })
                                .catch((err: Error) => {
                                    if (abortController.signal.aborted) {
                                        console.log('The user aborted the request');
                                    } else {
                                        RefreshIfLoggedOut(err.message);
                                        setSelectedItemId("");
                                        enqueueSnackbar(exception("noLayoutItemFound"), { variant: "error" });
                                        //console.error('The request failed');
                                    }
                                    setFetchingItems(false);
                                })

                        }
                        else {
                            setItems(dataItems);
                            setFetchingItems(false);
                        }
                    })
                    .catch((err: Error) => {
                        if (abortController.signal.aborted) {
                            console.log('The user aborted the request');
                        } else {
                            RefreshIfLoggedOut(err.message);
                            enqueueSnackbar(exception("noLayoutItemsFound"), { variant: "error" });
                            //console.error('The request failed');
                        }
                        setFetchingItems(false);
                    })
            }
        }

        if (open) FetchData();
    }, [open])

    React.useEffect(() => {
        const abortController = new AbortController();
        const FetchData = () => {
            setFetchingItems(true);
            const playitemTypes = Object.values(enumData ? enumData.playlist_categories : {});
            let apiUrl: string | null = null;

            if (selectType) {
                let tempApiUrl = "";
                if (enumData) {
                    let tempUrl = "";
                    if (playitemTypes.includes(selectType)) {
                        tempUrl = "/api/project-player/playlists";
                    }
                    else {
                        tempUrl = "/api/project-player/" + itemTypes.find(item => item.includes(selectType));
                    }
                    tempApiUrl = tempUrl;
                } else {
                    tempApiUrl = "/api/project-player/" + itemTypes.find(item => item.includes(selectType));
                }

                apiUrl = tempApiUrl;
            }

            if (!apiUrl) {
                enqueueSnackbar(exception("noLayoutItemsFound"), { variant: "error" });
                setItems([]);
                setFetchingItems(false);
            }
            else {
                fetch(apiUrl, {
                    method: "POST",
                    body: JSON.stringify({
                        action: "list",
                        type: selectType,
                        limit: Limit,
                        offset: 0,
                    }),
                    signal: abortController.signal
                })
                    .then(async (response) => {
                        if (response.ok) {
                            return response.json();
                        }
                        return Promise.reject(await response.json());
                    })
                    .then((data) => {
                        let dataItems: any = null;
                        // get the correct array of items
                        if (playitemTypes.includes(selectType)) {
                            dataItems = data.playlists;
                            setItemType("playlist");
                        } else {
                            dataItems = data[itemTypes.find((itemType) => itemType === itemTypes.find(item => item === selectType)) || ""];
                            // if not found by name get second element of data object that consist of success and list of items
                            if (!dataItems) dataItems = data[Object.keys(data)[1]];
                            setItemType(selectType.slice(0, -1));
                        }
                        if (dataItems) {
                            const tempDataItems = dataItems.filter((item: any) => item.id !== rowItem?.content_id);
                            /*if (tempDataItems.length === dataItems.length && tempSelectType !== "") {
                                setItems(dataItems);
                                setFetchingItems(false);
                            }*/
                            dataItems = tempDataItems;

                            if (typeof rowItem === "undefined") {
                                setItems(dataItems);
                                setFetchingItems(false);
                                if (selectType) {
                                    if (playitemTypes.includes(selectType)) {
                                        setItemType("playlist");
                                        setContentType(selectType);
                                    }
                                    else {
                                        setItemType(selectType.slice(0, -1));
                                        setContentType(selectType.slice(0, -1));
                                    }
                                }
                                return;
                            } else {
                                const apiUrl = "/api/project-player/" + itemTypes.find(item => item.includes(rowItem.type));

                                fetch(apiUrl, {
                                    method: "POST",
                                    body: JSON.stringify({
                                        action: "get",
                                        id: rowItem.content_id,
                                    }),
                                    signal: abortController.signal
                                })
                                    .then(async (response) => {
                                        if (response.ok) {
                                            return response.json();
                                        }
                                        return Promise.reject(await response.json());
                                    })
                                    .then((item) => {
                                        dataItems.unshift(item);
                                        setSelectedItemId(item.id);
                                        if (!selectType) {
                                            if (rowItem?.data.content_type) {
                                                setSelectType(rowItem.data.content_type);
                                                setContentType(rowItem.data.content_type);
                                            }
                                            else {
                                                setSelectType(itemTypes.find(item => item.includes(rowItem.type)) || "");
                                                setContentType(rowItem.type);
                                            }
                                        } else {
                                            if (playitemTypes.includes(selectType)) setContentType(selectType);
                                            else setContentType(selectType.slice(0, -1));
                                        }
                                        setItems(dataItems);
                                        setFetchingItems(false);
                                    })
                                    .catch((err: Error) => {
                                        if (abortController.signal.aborted) {
                                            console.log('The user aborted the request');
                                        } else {
                                            RefreshIfLoggedOut(err.message);
                                            setSelectedItemId("");
                                            enqueueSnackbar(exception("noLayoutItemFound"), { variant: "error" });
                                            //console.error('The request failed');
                                        }
                                        setFetchingItems(false);
                                    })
                            }
                        }
                        else {
                            setItems(dataItems);
                            setFetchingItems(false);
                            if (selectType && enumData) {
                                if (playitemTypes.includes(selectType)) {
                                    setItemType("playlist");
                                    setContentType(selectType);
                                }
                                else {
                                    setItemType(selectType.slice(0, -1));
                                    setContentType(selectType.slice(0, -1));
                                }
                            }
                        }
                    })
                    .catch((err: Error) => {
                        if (abortController.signal.aborted) {
                            console.log('The user aborted the request');
                        } else {
                            RefreshIfLoggedOut(err.message);
                            enqueueSnackbar(exception("noLayoutItemsFound"), { variant: "error" });
                            //console.error('The request failed');
                        }
                    })
            }
        }

        if (isMounted.current) {
            if (open) FetchData();
        } else {
            isMounted.current = true;
        }
    }, [selectType])

    React.useEffect(() => {
        if (typeof rowItem !== "undefined") {
            setSelectedItemId(rowItem.content_id);
            setTitle(rowItem.title);
            if (rowItem.description) setDescription(rowItem.description);
            if (rowItem.data.long_description) setLongDescription(rowItem.data.long_description)
            setBgImage(process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + rowItem.id + "/image.jpg?width=1040&height=560&cache=" + (rowItem.updated_at ? utf8ToB64(rowItem.updated_at) : ""));
            setLogoImage(rowItem.logo);
            setHideTitle(rowItem.data.hide_title);
            setHideDescription(rowItem.data.hide_description);
            if (itemTypes.length > 0) setItemType(rowItem.type);
            setContentType(rowItem.data.content_type);
            if (rowItem.data.text_color) setTitleColor(RgbaToHex8(rowItem.data.text_color));
            if (rowItem.data.description_color) setDescriptionColor(RgbaToHex8(rowItem.data.description_color));
        }
    }, [rowItem])



    React.useEffect(() => {
        if (selectedItem && action === "add") {
            setTitle(selectedItem.name);
            if (typeof selectedItem.description !== "undefined" && selectedItem.description) setDescription(selectedItem.description);
            else setDescription("");
            setBgImage(process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + selectedItem.id + "/image.jpg?width=1040&height=560&cache=" + (selectedItem?.updated_at ? utf8ToB64(selectedItem.updated_at) : ""));
            if (selectedItem.type) setContentType(selectedItem.type);
            if (selectedItem.type) {
                if (itemTypes.filter((item) => item !== "playlist").includes(selectedItem.type)) {
                    setItemType(selectedItem.type);
                } else {
                    setItemType("playlist");
                }
            }
        } else if (selectedItem && selectedItem.type) {
            if (itemTypes.filter((item) => item !== "playlist").includes(selectedItem.type)) {
                setContentType(selectedItem.type);
                setItemType(selectedItem.type);
            } else {
                setContentType(selectedItem.type);
                setItemType("playlist");
            }
        }
    }, [selectedItem])


    const handleChange = (event: SelectChangeEvent<string | null>) => {
        setSelectType(event.target.value as string);
        setHasMore(true);
        setOffset(0);
    }

    const abortController = new AbortController();

    const handleFetchMoreData = async () => {
        const currentOffset = offset + Limit;
        setOffset((prevState) => prevState + Limit);
        let apiUrl = "";
        if (itemTypes.filter((item) => item !== "playlist").includes(selectType)) apiUrl = "/api/project-player/" + selectType;
        else apiUrl = "/api/project-player/playlists";
        fetch(apiUrl, {
            method: "POST",
            body: JSON.stringify({
                action: "list",
                type: selectType,
                limit: Limit,
                offset: currentOffset,
            }),
            signal: abortController.signal
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data) => {
                if (data.playlists && data.playlists.length > 0) {
                    const tempItems = [...data.playlists];
                    if (selectedItem && selectedItem.type === selectType) {
                        tempItems.filter((item) => item.id !== selectedItem.id);
                        setItems((prevState) => [...prevState, ...tempItems]);
                    } else if (typeof rowItem !== "undefined") {
                        const filteredItems = tempItems.filter((item) => item.id !== rowItem.content_id);
                        setItems((prevState) => [...prevState, ...filteredItems]);
                    }
                    else {
                        setItems((prevState) => [...prevState, ...tempItems]);
                    }
                }
                else if (data[Object.keys(data)[1]] && data[Object.keys(data)[1]].length > 0) {
                    const tempItems = [...data[Object.keys(data)[1]]];
                    if (selectedItem && selectedItem.type === selectType) {
                        tempItems.filter((item) => item.id !== selectedItem.id);
                        setItems((prevState) => [...prevState, ...tempItems]);
                    } else if (typeof rowItem !== "undefined") {
                        const filteredItems = tempItems.filter((item) => item.id !== rowItem.content_id);
                        setItems((prevState) => [...prevState, ...filteredItems]);
                    }
                    else {
                        setItems((prevState) => [...prevState, ...tempItems]);
                    }
                }
                else setHasMore(false);
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    setSelectedItemId("");
                    enqueueSnackbar(exception("noLayoutItemFound"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        let tokenData: string | null = null;
        if (sessionData) tokenData = sessionData.user.token;
        const tempData: {
            title: string;
            description: string;
            long_description?: string;
            type: string;
            row_id?: string;
            hide_title?: boolean;
            hide_description?: boolean;
            content_type: string;
            content_id: string;
            logo_data?: string;
            image_data?: string;
        } = RemoveNullValues({
            title: (
                title
                &&
                (
                    typeof rowItem !== "undefined"
                        ?
                        (selectedItem && rowItem.id !== selectedItem?.id) ?
                            title.toLowerCase() !== selectedItem?.name.toLowerCase()
                            :
                            (rowItem.title) ?
                                title.toLowerCase() !== rowItem.title.toLowerCase()
                                :
                                true
                        :
                        title.toLowerCase() !== selectedItem?.name.toLowerCase()
                )
            ) ? title.trim() : null,
            description: (
                (selectedItem && (typeof selectedItem.description !== "undefined"))
                    ?
                    (typeof description === "string" && description)
                        &&
                        (
                            typeof rowItem !== "undefined"
                                ?
                                (selectedItem && rowItem.id !== selectedItem?.id) ?
                                    description.toLowerCase() !== selectedItem?.description?.toLowerCase()
                                    :
                                    (rowItem.description) ?
                                        description.toLowerCase() !== rowItem.description.toLowerCase()
                                        :
                                        true
                                :
                                description.toLowerCase() !== selectedItem?.description?.toLowerCase()
                        )
                        ?
                        description.trim()
                        :
                        null
                    :
                    (typeof description === "string" && description) ? description.trim() : null
            )
            ,
            long_description: (
                (typeof longDescription === "string" && longDescription)
                    ?
                    longDescription.trim()
                    :
                    (typeof longDescription === "string" && longDescription) ?
                        longDescription.trim()
                        :
                        null
            ),
            type:
                itemType
                    ?
                    // remove the "s" from the end of the itemType
                    itemType.endsWith("s") ? itemType.slice(0, -1) : itemType
                    :
                    null,
            row_id: rowId,
            content_type:
                contentType
                    ?
                    contentType
                    :
                    null,
            content_id:
                (selectedItemId)
                    ?
                    (typeof rowItem === "undefined") ?
                        selectedItemId
                        :
                        (rowItem.content_id !== selectedItemId)
                            ?
                            selectedItemId
                            :
                            null
                    :
                    null,
            logo_data:
                logoImage
                    ?
                    (typeof rowItem === "undefined")
                        ?
                        logoImage
                        :
                        (rowItem.logo !== logoImage)
                            ?
                            logoImage
                            :
                            null
                    :
                    null,
            image_data: (bgImage.includes('base64')) ? bgImage : null,
            hide_title: hideTitle,
            hide_description: hideDescription,
            text_color: (typeof rowItem !== "undefined" && rowItem.data.text_color) ?
                (titleColor !== RgbaToHex8(rowItem.data.text_color)) ? HexToRgba(titleColor.toString()) : null
                :
                HexToRgba(titleColor.toString()),
            description_color: (typeof rowItem !== "undefined" && rowItem.data.description_color) ?
                (descriptionColor !== RgbaToHex8(rowItem.data.description_color)) ? HexToRgba(descriptionColor.toString()) : null
                :
                HexToRgba(descriptionColor.toString()),
        })

        if (action === "edit") {
            delete tempData.row_id;
        }

        if (action === "add" && itemType !== "playlist" && (typeof tempData.image_data === "undefined" || !tempData.image_data)) {
            enqueueSnackbar(exception("bgImageRequired"), { variant: "error" });
            setLoading(false);
            return;
        }

        apiRequest("player/layout-item" + ((action === "edit" && typeof rowItem !== "undefined") ? "/" + rowItem.id : ""), ((action === "edit") ? 'PUT' : 'POST'),
            tempData,
            true,
            true,
            tokenData,
            undefined
        )
            .then((data) => {
                if (data.success) {
                    if (typeof fetchRowData !== "undefined") fetchRowData();
                    if (typeof setIsSlideAdded !== "undefined") setIsSlideAdded(true);
                }
                else return Promise.reject(data);
            })
            .catch((error: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request, layoutActionComponent');
                } else {
                    RefreshIfLoggedOut(error.message);
                    enqueueSnackbar(error.message, { variant: "error" });
                }
                return false;
            })
            .finally(() => {
                setLoading(false);
                handleOverlayClick();
            });
    }

    const handleHideCheckbox = (type: string) => {
        if (type === "title") setHideTitle(!hideTitle);
        else setHideDescription(!hideDescription);
    }

    const handleOverlayClick = () => {
        if (typeof rowItem !== "undefined" && typeof setRowItem !== "undefined") {
            setRowItem(undefined);
        }
        setOpen(false);
        setOffset(0);
        setLoading(false);
        setClearInput(true);
        setSelectedItemId("");
        setSelectedItem(null);
        setTitle("");
        setDescription("");
        setLongDescription("");
        setBgImage("");
        setLogoImage("");
        setSelectType("");
        setItems([]);
        setHasMore(true);
        setHideDescription(false);
        setHideTitle(false);
        setTitleColor(type === "row" ? RgbaToHex8(theme.palette.text.primary) : "#ffffffff");
        setDescriptionColor(type === "row" ? RgbaToHex8(theme.palette.text.secondary) : "#ffffffff");
        setTimeout(() => {
            setClearInput(false);
        }, 100);
        setTimeout(() => {
            if (actionContainerRef.current) actionContainerRef.current.scrollTop = 0;
        }, 500)
    }

    return (
        <ActionItemContainer
            sx={{
                opacity: open ? "1" : "0",
                visibility: open ? "visible" : "hidden",
            }}
            ref={actionContainerRef}
        >
            <StyledActionContentBox component="form" onSubmit={handleSubmit}>
                <StyledTitle title={
                    type === "carousel"
                        ?
                        action === "add"
                            ?
                            t("addItemToCarousel")
                            :
                            t("editCarouselItem")
                        :
                        action === "add"
                            ?
                            t("addItemToRow")
                            :
                            t("editRowItem")
                } />
                <FormControl fullWidth>
                    <InputLabel sx={{ fontWeight: 500 }} id="selectType-label">{genericText("item")}</InputLabel>
                    <Select
                        labelId="selectType-label"
                        id="selectType"
                        value={selectType}
                        label={genericText("item")}
                        onChange={handleChange}
                        sx={{
                            zIndex: theme.zIndex.drawer + 102,
                            textTransform: "capitalize",
                            '& fieldset': {
                                border: isDark ? "2px solid " + theme.palette.background.default : "2px solid rgba(0, 0, 32, 0.08)",
                            }
                        }}
                    >
                        {(typeof enumData !== "undefined" && enumData && enumData.playlist_categories) ? Object.values(enumData.playlist_categories).map((item: any) => (
                            <MenuItem sx={{ textTransform: "capitalize", color: theme.palette.text.secondary + " !important", fontWeight: 500 }} key={item} value={item}>{t(item)}</MenuItem>
                        )) : null}
                        {itemTypes.filter((item: string) => item !== "playlists").map((item: string) => (
                            <MenuItem sx={{ textTransform: "capitalize", color: theme.palette.text.secondary + " !important", fontWeight: 500 }} key={item} value={item}>{t(item)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <ItemsContainer
                    id={"addScrollableDiv_" + rowId + "_" + action}
                    ref={scrollRef}
                >
                    <InfiniteScroll
                        dataLength={items.length}
                        next={handleFetchMoreData}
                        //style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                        //inverse={true} //
                        hasMore={(items.length > 0 || fetchingItems) ? hasMore : false}
                        loader={
                            <Box sx={{
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "center",
                                width: "100%",
                                overflow: "hidden",
                                padding: "24px 0",
                            }}>
                                <CircularProgress />
                            </Box>
                        }
                        scrollableTarget={"addScrollableDiv_" + rowId + "_" + action}
                        endMessage={
                            <TextBlack12
                                containerSx={{
                                    padding: "24px 0",
                                    textAlign: "center"
                                }}
                                text={items.length > 0 ? t("seenItAll") : t("noResults")}
                            />
                        }
                    >
                        {!fetchingItems ?
                            items.map((playlist: Playlist | Schedule | Mixer, index: number) => {
                                return (
                                    <StyledAddPlaylistRow
                                        key={"addPlaylistRow_" + playlist.id + "_" + index}
                                        selectedValue={selectedItemId}
                                        setSelectedValue={setSelectedItemId}
                                        setSelectedItem={setSelectedItem}
                                        playlist={playlist}
                                    />
                                )
                            })
                            : null
                        }
                    </InfiniteScroll>
                </ItemsContainer>
                <FormControl sx={{ marginBottom: "20px", position: "relative" }} fullWidth>
                    {StyledLabel(genericText("title"))}
                    <StyledInput
                        inputVal={title}
                        inputPlaceholder={t("enterTitle")}
                        inputChangeFunction={setTitle}
                        clearInput={clearInput}
                        disabled={hideTitle}
                        inputStyle={{
                            fontWeight: 500,
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <StyledCheckbox
                            handleChangeFunction={() => handleHideCheckbox("title")}
                            label={t("hideTitle")}
                            defaultChecked={hideTitle}
                        />
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: "0",
                                right: "0",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <TextMedium14
                                text={genericText("textColor") + ":"}
                                containerSx={{
                                    marginTop: "-3px"
                                }}
                                textProps={{
                                    sx: {
                                        color: theme.palette.text.secondary,
                                    }
                                }}
                            />
                            <StyledColorInput
                                value={titleColor}
                                setValue={setTitleColor}
                                format={format}
                            />
                        </Box>
                    </Box>
                </FormControl>
                <FormControl sx={{ marginBottom: "20px" }} fullWidth>
                    {StyledLabel(genericText("description"))}
                    <StyledInput
                        required={itemType !== "playlist"}
                        inputVal={description}
                        inputPlaceholder={t("enterDescription")}
                        inputChangeFunction={setDescription}
                        clearInput={clearInput}
                        disabled={hideDescription}
                        type="textarea"
                        multiline={true}
                        inputStyle={{
                            fontWeight: 500,
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            position: "relative",
                        }}
                    >
                        {itemType === "playlists" || (selectedItem?.description || description?.length !== 0) ?
                            <StyledCheckbox
                                handleChangeFunction={() => handleHideCheckbox("description")}
                                label={t("hideDescription")}
                                defaultChecked={hideDescription}
                            />
                            :
                            <Box sx={{ display: "flex", padding: "4px", height: "42px" }}></Box>
                        }
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: "0",
                                right: "0",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <TextMedium14
                                text={genericText("descriptionColor") + ":"}
                                containerSx={{
                                    marginTop: "-3px"
                                }}
                                textProps={{
                                    sx: {
                                        color: theme.palette.text.secondary,
                                    }
                                }}
                            />
                            <StyledColorInput
                                value={descriptionColor}
                                setValue={setDescriptionColor}
                                format={format}
                            />
                        </Box>
                    </Box>
                </FormControl>
                <FormControl sx={{ marginBottom: "20px" }} fullWidth>
                    {StyledLabel(genericText("longDescription"))}
                    <StyledInput
                        inputVal={longDescription}
                        inputPlaceholder={t("enterLongerDescription")}
                        inputChangeFunction={setLongDescription}
                        clearInput={clearInput}
                        type="textarea"
                        multiline={true}
                        rows={10}
                    />
                </FormControl>
                <UploadFileContainer sx={{ paddingBottom: "40px" }}>
                    <UploadFileFormLabel>{t("bgImage")}</UploadFileFormLabel>
                    <StyledUpload16_9 type="image" file={bgImage} setFile={setBgImage} />
                </UploadFileContainer>
                {type === "carousel" ?
                    <UploadFileContainer sx={{ paddingBottom: "40px" }}>
                        <UploadFileFormLabel>{t("logo")}</UploadFileFormLabel>
                        <StyledLogoUpload backgroundImg={bgImage} file={logoImage} setFile={setLogoImage} />
                    </UploadFileContainer>
                    : null}
                <Box>
                    <StyledActionButton loading={loading} type="submit" variant='contained'>
                        <TextBlack18
                            containerSx={{
                                lineHeight: "20px"
                            }}
                            text={
                                action === "add"
                                    ?
                                    t("addItem")
                                    :
                                    t("editItem")
                            }
                        />
                    </StyledActionButton>
                </Box>
            </StyledActionContentBox>
            <ActionItemOverlayContainer open={open} onClick={handleOverlayClick} />
        </ActionItemContainer>
    )
}

export default LayoutActionComponent;