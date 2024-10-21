import { DeleteOutlined, EditOutlined, KeyboardArrowLeftRounded, KeyboardArrowRightRounded, MoreVert } from "@mui/icons-material";
import { Menu } from "@mui/material";
import { useState } from "react";
import { RowItem } from "../../../../../interfaces/projectPlayer/rowItem";
import useTranslation from '../../../../../utility/useTranslation';
import { StyledButton } from "../../../../common/buttons/styledButton";
import { IconContainerGrey } from "../../../../common/iconContainer/iconContainer";
import { StyledMenuItem } from "../../../../common/menu/styledMenu";
import { TextBold14 } from "../../../../common/styledText/styledText";
import { CarouselSliderButtonContainer, CarouselSliderMenuContainer } from "../../styledComponents/carouselStyledComponents";
import { FeaturedCarouselStrings } from '../lang/featuredCarouselStrings';


interface CarouselSliderMenuProps {
    item: RowItem,
    index: number,
    isRowLocked: boolean,
    rowLockedBy: string,
    handleLock: () => Promise<false | "locked" | "unlocked">,
    handleEditItem: (id: string) => void,
    moveLeft: (index: number) => void,
    moveRight: (index: number) => void,
    removeItem: (id: string) => void,
    sliderLength?: number
}

const CarouselSliderMenu = ({
    item,
    index,
    isRowLocked,
    rowLockedBy,
    handleLock,
    handleEditItem,
    moveLeft,
    moveRight,
    removeItem,
    sliderLength
}: CarouselSliderMenuProps) => {

    const featuredCarouselStrings = useTranslation(FeaturedCarouselStrings).t;

    const [anchorItemEl, setAnchorItemEl] = useState<any | null>(null);

    const handleEditItemClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

    return (
        <CarouselSliderMenuContainer>
            <CarouselSliderButtonContainer>
                <StyledButton
                    disabled={isRowLocked && rowLockedBy.toLowerCase() !== "you"}
                    id={`carouselEditItemButton_${index}`}
                    aria-controls={anchorItemEl?.[`carouselEditItemButton_${index}`] ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={anchorItemEl?.[`carouselEditItemButton_${index}`] ? "true" : undefined}
                    onClick={handleEditItemClick}
                    variant="contained"
                >
                    <IconContainerGrey className="darker" sx={{ fontSize: "24px", pointerEvents: "none" }}>
                        <MoreVert />
                    </IconContainerGrey>
                </StyledButton>
            </CarouselSliderButtonContainer>
            <Menu
                id={`carouselEditItemMenu_${index}`}
                anchorEl={anchorItemEl?.[`carouselEditItemButton_${index}`]}
                open={!!anchorItemEl?.[`carouselEditItemButton_${index}`]}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                onClose={handleItemClose}
                MenuListProps={{
                    "aria-labelledby": "carouselEditItemButton",
                    sx: { borderRadius: "16px", fontSize: "24px", minWidth: "230px" },
                }}
                PaperProps={{ sx: { mt: "6px" } }}
            >
                <StyledMenuItem onClick={async () => {
                    if (!isRowLocked) {
                        const tempLocked = await handleLock();
                        if (tempLocked !== "locked") {
                            handleItemClose();
                            return;
                        }
                    }
                    handleEditItem(item.id);
                    handleItemClose();
                }}
                >
                    <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                        <EditOutlined sx={{ mr: "12px" }} />
                    </IconContainerGrey>
                    <TextBold14 text={featuredCarouselStrings("editItem")} />
                </StyledMenuItem>
                <StyledMenuItem
                    disabled={index === 0}
                    onClick={async () => {
                        if (!isRowLocked) {
                            const tempLocked = await handleLock();
                            if (tempLocked !== "locked") {
                                handleItemClose();
                                return;
                            }
                        }
                        moveLeft(index);
                        handleItemClose();
                    }
                    }
                >
                    <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                        <KeyboardArrowLeftRounded sx={{ mr: "12px" }} />
                    </IconContainerGrey>
                    <TextBold14 text={featuredCarouselStrings("moveLeft")} />
                </StyledMenuItem>
                <StyledMenuItem
                    disabled={typeof sliderLength !== "undefined" && (index === sliderLength - 1)}
                    onClick={async () => {
                        if (!isRowLocked) {
                            const tempLocked = await handleLock();
                            if (tempLocked !== "locked") {
                                handleItemClose();
                                return;
                            }
                        }
                        moveRight(index);
                        handleItemClose();
                    }
                    }
                >
                    <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                        <KeyboardArrowRightRounded sx={{ mr: "12px" }} />
                    </IconContainerGrey>
                    <TextBold14 text={featuredCarouselStrings("moveRight")} />
                </StyledMenuItem>
                <StyledMenuItem onClick={async () => {
                    if (!isRowLocked) {
                        const tempLocked = await handleLock();
                        if (tempLocked !== "locked") {
                            handleItemClose();
                            return;
                        }
                    }
                    removeItem(item.id);
                    handleItemClose();
                }
                }>
                    <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                        <DeleteOutlined sx={{ mr: "12px" }} />
                    </IconContainerGrey>
                    <TextBold14 text={featuredCarouselStrings("deleteItem")} />
                </StyledMenuItem>
            </Menu>
        </CarouselSliderMenuContainer>
    )
}

export default CarouselSliderMenu;