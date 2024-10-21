import { History, LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PlaylistPlayIcon from '@mui/icons-material/PlaylistPlay';
import { Box, Menu, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { ExceptionStrings } from "../../../../../lang/common/exceptions";
import { GenericText } from "../../../../../lang/common/genericText";
import SecondsToTimeFormat from "../../../../../utility/secondsToTimeFormat";
import useTranslation from "../../../../../utility/useTranslation";
import { StyledButton } from "../../../../common/buttons/styledButton";
import { IconContainerGrey } from "../../../../common/iconContainer/iconContainer";
import { StyledMenuItem } from "../../../../common/menu/styledMenu";
import { TextBold14, TextMedium16 } from "../../../../common/styledText/styledText";
import CategoryDropdown from "../../categoryDropdown/categoryDropdown";
import { RowLimit } from "../../constants/rowLimit";
import { CarouselContentContainer, CarouselTitleContainer } from "../../styledComponents/carouselStyledComponents";
import { FeaturedCarouselStrings } from "../lang/featuredCarouselStrings";

interface CarouselHeaderProps {
    type: string | null,
    itemsLength: number | null,
    setDeletePromptOpen: React.Dispatch<React.SetStateAction<boolean>>,
    setOpenAddItem: React.Dispatch<React.SetStateAction<boolean>>,
    isRowLocked: boolean,
    remainingTime: number | null,
    rowLockedBy: string,
    handleTimeExtend: () => Promise<void>,
    handleLock: () => Promise<"locked" | "unlocked" | false>,
    handleCategoryChange: (category: string) => void,
}

const CarouselHeader = ({
    type,
    itemsLength,
    setDeletePromptOpen,
    setOpenAddItem,
    isRowLocked,
    remainingTime,
    rowLockedBy,
    handleTimeExtend,
    handleLock,
    handleCategoryChange
}: CarouselHeaderProps) => {
    const exceptionTranslation = useTranslation(ExceptionStrings).t;
    const featuredCarouselTranslation = useTranslation(FeaturedCarouselStrings).t;
    const genericTranslation = useTranslation(GenericText).t;
    const { enqueueSnackbar } = useSnackbar();
    const [anchorEl, setAnchorEl] = React.useState<any>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () => {
        setAnchorEl(null);
    }

    return (
        <CarouselContentContainer>
            <CarouselTitleContainer>
                <TextMedium16
                    containerSx={{
                        lineHeight: "19px"
                    }}
                    text={featuredCarouselTranslation("featuredCarousel")}
                />
                {
                    isRowLocked ?
                        <>
                            <TextMedium16
                                containerSx={{
                                    lineHeight: "19px",
                                    margin: "0 6px",
                                    color: "error.main"
                                }}
                                text="/"
                            />
                            <TextMedium16
                                containerSx={{
                                    lineHeight: "19px",
                                    color: "error.main"
                                }}
                                text={
                                    (rowLockedBy.toLowerCase() === "you")
                                        ?
                                        genericTranslation("rowLockedByYou") + " " + (remainingTime ? (genericTranslation("for") + " " + SecondsToTimeFormat(remainingTime ? remainingTime : 0)) : "")
                                        :
                                        genericTranslation("rowLockedBy") + " " + rowLockedBy
                                }
                            />
                        </>
                        : null
                }
            </CarouselTitleContainer>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",

                    '& > *':{
                        flexShrink: 0,
                    }
                }}
            >
                <CategoryDropdown
                itemLockedFunction={async () => {
                    if (!isRowLocked) {
                        const tempLocked = await handleLock();
                        if (tempLocked !== "locked") {
                            return "locked";
                        }
                        return "unlocked";
                        }
                        return "locked";
                    }}
                    disabled={(isRowLocked && rowLockedBy.toLowerCase() !== "you")}
                    defaultCat={type ? type : ""}
                    handleChange={(e) => handleCategoryChange(e.target.value || '')}
                />
                {isRowLocked ?
                    <Tooltip
                        disableFocusListener={(isRowLocked && rowLockedBy.toLowerCase() !== "you")}
                        disableHoverListener={(isRowLocked && rowLockedBy.toLowerCase() !== "you")}
                        disableInteractive={(isRowLocked && rowLockedBy.toLowerCase() !== "you")}
                        disableTouchListener={(isRowLocked && rowLockedBy.toLowerCase() !== "you")}
                        title={genericTranslation("resetTimer")}
                        placement="top-end"
                    >
                        <span>
                            <StyledButton
                                disabled={(isRowLocked && rowLockedBy.toLowerCase() !== "you")}
                                onClick={handleTimeExtend}
                                variant="contained"
                                sx={{ marginRight: "10px" }}
                            >
                                <IconContainerGrey className={"darker locked"} sx={{ fontSize: "24px", pointerEvents: "none" }}>
                                    <History />
                                </IconContainerGrey>
                            </StyledButton>
                        </span>
                    </Tooltip>
                    : null}
                <StyledButton
                    disabled={(isRowLocked && rowLockedBy.toLowerCase() !== "you")}
                    onClick={handleLock}
                    variant="contained"
                    sx={{ marginRight: "10px" }}
                >
                    <IconContainerGrey className={"darker " + (isRowLocked ? "locked" : undefined)} sx={{ fontSize: "24px", pointerEvents: "none" }}>
                        {isRowLocked ? <LockOutlined /> : <LockOpenOutlined />}
                    </IconContainerGrey>
                </StyledButton>
                <StyledButton
                    disabled={(isRowLocked && rowLockedBy.toLowerCase() !== "you")}
                    id='carouselEditButton'
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    variant="contained"
                >
                    <IconContainerGrey className="darker" sx={{ fontSize: "24px", pointerEvents: "none" }}>
                        <EditOutlinedIcon />
                    </IconContainerGrey>
                </StyledButton>
                <Menu
                    id="carouselEditMenu"
                    anchorEl={anchorEl}
                    open={open}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'carouselEditButton',
                        sx: { borderRadius: "16px", fontSize: "24px", minWidth: "230px" }
                    }}
                    slotProps={{
                        paper: {
                            sx:{
                                mt: "6px",
                            }
                        }
                    }}
                >
                    {itemsLength !== null ?
                        <Tooltip
                            disableFocusListener={itemsLength < RowLimit}
                            disableHoverListener={itemsLength < RowLimit}
                            disableInteractive={itemsLength < RowLimit}
                            disableTouchListener={itemsLength < RowLimit}
                            title={exceptionTranslation("rowLimitReached")}
                            placement="top-end"
                        >
                            <span>
                                <StyledMenuItem
                                    onClick={async () => {
                                        if (!isRowLocked) {
                                            const tempLocked = await handleLock();
                                            if (tempLocked !== "locked") {
                                                handleClose();
                                                return;
                                            }
                                        }
                                        setOpenAddItem(true);
                                        handleClose();
                                    }}
                                    disabled={itemsLength >= RowLimit}
                                >
                                    <Box sx={{ display: "flex" }}>
                                        <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                                            <PlaylistPlayIcon sx={{ mr: "12px" }} />
                                        </IconContainerGrey>
                                        <TextBold14
                                            text={featuredCarouselTranslation("addItem")}
                                        />
                                    </Box>
                                </StyledMenuItem>
                            </span>
                        </Tooltip>
                        : null}
                    <StyledMenuItem onClick={async () => {
                        if (!isRowLocked) {
                            const tempLocked = await handleLock();
                            if (tempLocked !== "locked") {
                                handleClose();
                                return;
                            }
                        }
                        if (itemsLength && itemsLength < 1) {
                            enqueueSnackbar(exceptionTranslation("rowAlreadyEmpty"), { variant: "error" });
                        }
                        else setDeletePromptOpen(true);
                        handleClose();
                    }
                    }>
                        <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                            <CloseRoundedIcon sx={{ mr: "12px" }} />
                        </IconContainerGrey>
                        <TextBold14
                            text={featuredCarouselTranslation("clearCarousel")}
                        />
                    </StyledMenuItem>
                </Menu>
            </Box>
        </CarouselContentContainer>
    )
}

export default CarouselHeader;