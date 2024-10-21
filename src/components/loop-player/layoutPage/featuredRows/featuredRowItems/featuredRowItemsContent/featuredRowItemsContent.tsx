import { DeleteOutlined, EditOutlined, KeyboardArrowLeftRounded, KeyboardArrowRightRounded, MoreVert } from "@mui/icons-material";
import { Box, Menu } from "@mui/material";
import Image from "next/image";
import { useContext } from "react";
import { RowItem } from "../../../../../../interfaces/projectPlayer/rowItem";
import { AccessibilityContext } from "../../../../../../store/providers/accessibilityProvider";
import { getBgColor } from "../../../../../../utility/getContrastBgColor";
import utf8ToB64 from "../../../../../../utility/stringToBase64";
import useTranslation from "../../../../../../utility/useTranslation";
import { StyledButton } from "../../../../../common/buttons/styledButton";
import { IconContainerGrey } from "../../../../../common/iconContainer/iconContainer";
import { StyledMenuItem } from "../../../../../common/menu/styledMenu";
import { TextBold14, TextMedium12, TextMedium14 } from "../../../../../common/styledText/styledText";
import { SliderItemBox } from "../../../styledComponents/rowsStyledComponents";
import { FeaturedRowItemsStrings } from "../lang/featuredRowItemsStrings";

interface FeaturedRowItemsContentProps {
    slider: RowItem;
    sliderIndex: number;
    index: number;
    bgColors: {
        light: string;
        dark: string;
    };
    handleEditClick: (id: string) => void;
    handleItemLock: (id: string) => Promise<false | "locked" | "unlocked" | undefined>;
    handleItemClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    handleItemClose: () => void;
    anchorItemEl: {
        [key: string]: HTMLElement | null;
    };
    isItemLocked: {
        id: string;
        locked: boolean;
        lockedBy: string;
    }[];
    moveLeft: (id: string, index: number) => void;
    moveRight: (id: string, index: number) => void;
    itemId: string;
    deleteRowItem: (id: string, itemId: string) => void;
}

const FeaturedRowItemsContent = ({
    slider,
    sliderIndex,
    index,
    bgColors,
    handleEditClick,
    handleItemLock,
    handleItemClick,
    handleItemClose,
    anchorItemEl,
    isItemLocked,
    moveLeft,
    moveRight,
    itemId,
    deleteRowItem,
}:
FeaturedRowItemsContentProps
) => {
    const featuredRowItemsStrings = useTranslation(FeaturedRowItemsStrings).t;
    const { theme } = useContext(AccessibilityContext);

    return (
        <SliderItemBox height={"100%"} maxHeight={"100%"} key="1" >
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "16/9",

                    [theme.breakpoints.up("lg")]: {
                        maxWidth: "230px",
                        maxHeight: "130px",
                    }
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
                            : "transparent",
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
            <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                <Box
                    sx={{ position: "absolute", top: "14px", right: "14px" }}
                >
                    <StyledButton
                        disabled={(isItemLocked.find(tempItem => tempItem.id === itemId)?.locked && isItemLocked.find(tempItem => tempItem.id === itemId)?.lockedBy.toLowerCase() !== "you")}
                        id={'sliderItem_' + index + '_' + sliderIndex}
                        aria-controls={(anchorItemEl && anchorItemEl['sliderItem_' + index + '_' + sliderIndex]) ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={(anchorItemEl && anchorItemEl['sliderItem_' + index + '_' + sliderIndex]) ? 'true' : undefined}
                        onClick={(event) => handleItemClick(event)}
                        variant="contained"
                    >
                        <IconContainerGrey className="darker" sx={{ pointerEvents: "none" }}>
                            <MoreVert />
                        </IconContainerGrey>
                    </StyledButton>
                </Box>
                <Menu
                    id={"sliderEditMenu_" + index + "_" + sliderIndex}
                    anchorEl={(anchorItemEl) ? anchorItemEl['sliderItem_' + index + '_' + sliderIndex] : null}
                    open={(anchorItemEl && anchorItemEl['sliderItem_' + index + '_' + sliderIndex]) ? true : false}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={handleItemClose}
                    MenuListProps={{
                        'aria-labelledby': 'sliderItem_' + index + '_' + sliderIndex,
                        sx: { borderRadius: "16px", fontSize: "24px", minWidth: "230px" }
                    }}
                    PaperProps={{
                        sx: { mt: "6px" }
                    }}
                >
                    <StyledMenuItem onClick={async () => {
                        if (!isItemLocked.find(tempItem => tempItem.id === itemId)?.locked) {
                            const tempLocked = await handleItemLock(itemId);
                            if (tempLocked !== "locked") {
                                handleItemClose();
                                return;
                            }
                        }
                        handleItemClose();
                        handleEditClick(slider.id);
                    }
                    }>
                        <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                            <EditOutlined sx={{ mr: "12px" }} />
                        </IconContainerGrey>
                        <TextBold14
                            text={featuredRowItemsStrings("editItem")}
                        />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={async () => {
                        if (!isItemLocked.find(tempItem => tempItem.id === itemId)?.locked) {
                            const tempLocked = await handleItemLock(itemId);
                            if (tempLocked !== "locked") {
                                handleItemClose();
                                return;
                            }
                        }
                        moveLeft(itemId, sliderIndex);
                        handleItemClose();
                    }
                    }>
                        <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                            <KeyboardArrowLeftRounded sx={{ mr: "12px" }} />
                        </IconContainerGrey>
                        <TextBold14
                            text={featuredRowItemsStrings("moveLeft")}
                        />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={async () => {
                        if (!isItemLocked.find(tempItem => tempItem.id === itemId)?.locked) {
                            const tempLocked = await handleItemLock(itemId);
                            if (tempLocked !== "locked") {
                                handleItemClose();
                                return;
                            }
                        }
                        moveRight(itemId, sliderIndex);
                        handleItemClose();
                    }
                    }>
                        <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                            <KeyboardArrowRightRounded sx={{ mr: "12px" }} />
                        </IconContainerGrey>
                        <TextBold14
                            text={featuredRowItemsStrings("moveRight")}
                        />
                    </StyledMenuItem>
                    <StyledMenuItem onClick={async () => {
                        if (!isItemLocked.find(tempItem => tempItem.id === itemId)?.locked) {
                            const tempLocked = await handleItemLock(itemId);
                            if (tempLocked !== "locked") {
                                handleItemClose();
                                return;
                            }
                        }
                        deleteRowItem(slider.id, itemId);
                        handleItemClose();
                    }
                    }>
                        <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                            <DeleteOutlined sx={{ mr: "12px" }} />
                        </IconContainerGrey>
                        <TextBold14
                            text={featuredRowItemsStrings("deleteItem")}
                        />
                    </StyledMenuItem>
                </Menu>
            </Box>
        </SliderItemBox>
    )
}

export default FeaturedRowItemsContent;