import {
    CloseRounded,
    DeleteOutlineOutlined,
    EditOutlined,
    History,
    LockOpenOutlined,
    LockOutlined,
    PlaylistPlayOutlined,
} from "@mui/icons-material";
import { Box, Menu, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { RowItem } from "../../../../interfaces/projectPlayer/rowItem";
import { ExceptionStrings } from "../../../../lang/common/exceptions";
import { GenericText } from "../../../../lang/common/genericText";
import { LockContext } from "../../../../store/providers/lockProvider";
import SecondsToTimeFormat from "../../../../utility/secondsToTimeFormat";
import useTranslation from "../../../../utility/useTranslation";
import { StyledButton } from "../../../common/buttons/styledButton";
import { IconContainerGrey } from "../../../common/iconContainer/iconContainer";
import { StyledMenuItem } from "../../../common/menu/styledMenu";
import {
    TextBold14,
    TextMedium16,
} from "../../../common/styledText/styledText";
import CategoryDropdown from "../categoryDropdown/categoryDropdown";
import { RowLimit } from "../constants/rowLimit";
import {
    ContentBox,
    ContentBoxTitleContainer,
} from "../styledComponents/rowsStyledComponents";

interface Props {
  item: {
    id: string;
    title?: string;
    type?: string;
    items: RowItem[];
    locked: string | null;
  };
  index: number;
  isItemLocked?: { id: string; locked: boolean; lockedBy: string };
  handleItemLock: (
    id: string,
    type?: "lock" | "unlock"
  ) => Promise<false | "locked" | "unlocked" | undefined>;
  handleTimeExtend: (id: string) => void;
  handleEditClick: (id: string, title: string) => void;
  editRowTitle: string;
  addItemText: string;
  clearRowText: string;
  deleteRowText: string;
  handleAddItemToRow: (id: string) => void;
  setDeleteId: (id: string) => void;
  setDeleteType: (type: string) => void;
  setDeleteTitle: (title: string) => void;
  setDeletePromptOpen: (open: boolean) => void;
  handleCategoryChange: (id: string, category: string) => void;
}

const FeaturedRowContent = ({
  item,
  index,
  isItemLocked,
  handleItemLock,
  handleTimeExtend,
  handleEditClick,
  editRowTitle,
  handleAddItemToRow,
  addItemText,
  setDeleteId,
  setDeleteType,
  setDeleteTitle,
  setDeletePromptOpen,
  clearRowText,
  deleteRowText,
  handleCategoryChange,
}: Props) => {
  const genericText = useTranslation(GenericText).t;
  const exception = useTranslation(ExceptionStrings).t;
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [remainingTime, setRemainingTime] = React.useState<number | null>(null);
  const [dateOfLock, setDateOfLock] = React.useState<Date | null>(null);

  const handleItemClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleItemClose = () => {
    setAnchorEl(null);
  };

  const { lockedEntities } = React.useContext(LockContext);

  useEffect(() => {
    if (lockedEntities && lockedEntities.layout_row) {
      const layoutRow: {
        [key: string]: string;
      } = lockedEntities.layout_row;

      if (layoutRow[item.id]) {
        const date = new Date(layoutRow[item.id]);
        setDateOfLock(date);
      }
    }

    return () => {
      setDateOfLock(null);
    };
  }, [lockedEntities]);

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
          handleItemLock(item.id, "unlock");
          clearInterval(timer);
        }
      } else {
        setRemainingTime(null);
        clearInterval(timer);
      }
    }, 100);

    return () => {
      setRemainingTime(null);
      clearInterval(timer);
    };
  }, [dateOfLock]);

  return (
    <ContentBox>
      <ContentBoxTitleContainer>
        <TextMedium16
          containerSx={{
            lineHeight: "19px",
          }}
          text={item.title ? item.title : ""}
        />
        {isItemLocked?.locked ? (
          <>
            <TextMedium16
              containerSx={{
                lineHeight: "19px",
                margin: "0 6px",
                color: "error.main",
              }}
              text="/"
            />
            <TextMedium16
              containerSx={{
                lineHeight: "19px",
                color: "error.main",
              }}
              text={
                isItemLocked.lockedBy.toLowerCase() === "you"
                  ? genericText("rowLockedByYou") +
                    " " +
                    (remainingTime
                      ? genericText("for") +
                        " " +
                        SecondsToTimeFormat(remainingTime)
                      : "")
                  : genericText("rowLockedBy") + " " + isItemLocked.lockedBy
              }
            />
          </>
        ) : null}
      </ContentBoxTitleContainer>
      <Box
        sx={{
            display: "flex",
            alignItems: "center"
        }}
      >
        {isItemLocked && (
          <CategoryDropdown
            itemLockedFunction={async () => {
              if (isItemLocked && !isItemLocked.locked) {
                const tempLocked = await handleItemLock(item.id);
                if (tempLocked !== "locked") {
                  return "locked";
                }
                return "unlocked";
              }
              return "locked";
            }}
            disabled={
              isItemLocked.locked &&
              isItemLocked.lockedBy.toLowerCase() !== "you"
            }
            defaultCat={item.type ? item.type : null}
            handleChange={ async (e) => {
              if (isItemLocked && !isItemLocked.locked) {
                const tempLocked = await handleItemLock(item.id);
                if (tempLocked !== "locked") {
                  return;
                }
              }
              if(e.target.value) handleCategoryChange(item.id, e.target.value);
            }}
          />
          )}
        {isItemLocked?.locked ? (
          <Tooltip
            disableFocusListener={
              isItemLocked.locked &&
              isItemLocked.lockedBy.toLowerCase() !== "you"
            }
            disableHoverListener={
              isItemLocked.locked &&
              isItemLocked.lockedBy.toLowerCase() !== "you"
            }
            disableInteractive={
              isItemLocked.locked &&
              isItemLocked.lockedBy.toLowerCase() !== "you"
            }
            disableTouchListener={
              isItemLocked.locked &&
              isItemLocked.lockedBy.toLowerCase() !== "you"
            }
            title={genericText("resetTimer")}
            placement="top-end"
          >
            <span>
              <StyledButton
                disabled={
                  isItemLocked.locked &&
                  isItemLocked.lockedBy.toLowerCase() !== "you"
                }
                onClick={() => handleTimeExtend(item.id)}
                variant="contained"
                sx={{ marginRight: "10px" }}
              >
                <IconContainerGrey
                  className={"darker locked"}
                  sx={{ fontSize: "24px", pointerEvents: "none" }}
                >
                  <History />
                </IconContainerGrey>
              </StyledButton>
            </span>
          </Tooltip>
        ) : null}
        <StyledButton
          disabled={
            isItemLocked &&
            isItemLocked.locked &&
            isItemLocked.lockedBy.toLowerCase() !== "you"
          }
          onClick={() => handleItemLock(item.id)}
          variant="contained"
          sx={{ marginRight: "10px" }}
        >
          <IconContainerGrey
            className={
              "darker " +
              (isItemLocked && isItemLocked.locked ? "locked" : undefined)
            }
            sx={{ fontSize: "24px", pointerEvents: "none" }}
          >
            {isItemLocked && isItemLocked.locked ? (
              <LockOutlined />
            ) : (
              <LockOpenOutlined />
            )}
          </IconContainerGrey>
        </StyledButton>
        <StyledButton
          disabled={
            isItemLocked &&
            isItemLocked.locked &&
            isItemLocked.lockedBy.toLowerCase() !== "you"
          }
          id={"editButton_" + index}
          aria-controls={anchorEl ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={anchorEl ? "true" : undefined}
          onClick={handleItemClick}
          variant="contained"
        >
          <IconContainerGrey className="darker" sx={{ pointerEvents: "none" }}>
            <EditOutlined />
          </IconContainerGrey>
        </StyledButton>
        <Menu
          id={"editMenu_" + index}
          anchorEl={anchorEl ? anchorEl : null}
          open={anchorEl ? true : false}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={handleItemClose}
          MenuListProps={{
            "aria-labelledby": "editButton_" + index,
            sx: { borderRadius: "16px", fontSize: "24px", minWidth: "230px" },
          }}
          slotProps={{
            paper:{
            sx: { mt: "6px" },
            }
          }}
        >
          <StyledMenuItem
            onClick={async () => {
              if (isItemLocked && !isItemLocked.locked) {
                const tempLocked = await handleItemLock(item.id);
                if (tempLocked !== "locked") {
                  handleItemClose();
                  return;
                }
              }
              handleEditClick(item.id, item.title ? item.title : "");
              handleItemClose();
            }}
          >
            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
              <EditOutlined sx={{ mr: "12px" }} />
            </IconContainerGrey>
            <TextBold14 text={editRowTitle} />
          </StyledMenuItem>
          <Tooltip
            disableFocusListener={item.items.length < RowLimit}
            disableHoverListener={item.items.length < RowLimit}
            disableInteractive={item.items.length < RowLimit}
            disableTouchListener={item.items.length < RowLimit}
            title={exception("rowLimitReached")}
            placement="top-end"
          >
            <span>
              <StyledMenuItem
                onClick={async () => {
                  if (isItemLocked && !isItemLocked.locked) {
                    const tempLocked = await handleItemLock(item.id);
                    if (tempLocked !== "locked") {
                      handleItemClose();
                      return;
                    }
                  }
                  handleAddItemToRow(item.id);
                  handleItemClose();
                }}
                disabled={item.items.length >= RowLimit}
              >
                <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                  <PlaylistPlayOutlined sx={{ mr: "12px" }} />
                </IconContainerGrey>
                <TextBold14 text={addItemText} />
              </StyledMenuItem>
            </span>
          </Tooltip>
          <StyledMenuItem
            onClick={async () => {
              if (isItemLocked && !isItemLocked.locked) {
                const tempLocked = await handleItemLock(item.id);
                if (tempLocked !== "locked") {
                  handleItemClose();
                  return;
                }
              }
              if (item.items.length < 1) {
                enqueueSnackbar(exception("rowAlreadyEmpty"), {
                  variant: "error",
                });
              }
              setDeleteId(item.id);
              setDeleteType("clear");
              setDeleteTitle(genericText("clearRowPrompt"));
              setDeletePromptOpen(true);
              handleItemClose();
            }}
          >
            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
              <CloseRounded sx={{ mr: "12px" }} />
            </IconContainerGrey>
            <TextBold14 text={clearRowText} />
          </StyledMenuItem>
          <StyledMenuItem
            onClick={() => {
              setDeleteId(item.id);
              setDeleteType("delete");
              setDeleteTitle(genericText("deleteRowPrompt"));
              setDeletePromptOpen(true);
              handleItemClose();
            }}
          >
            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
              <DeleteOutlineOutlined sx={{ mr: "12px" }} />
            </IconContainerGrey>
            <TextBold14 text={deleteRowText} />
          </StyledMenuItem>
        </Menu>
      </Box>
    </ContentBox>
  );
};

export default FeaturedRowContent;
