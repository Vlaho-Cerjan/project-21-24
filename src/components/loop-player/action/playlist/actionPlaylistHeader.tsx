import { History, SaveOutlined } from "@mui/icons-material";
import { Box, Tooltip } from '@mui/material';
import { useRouter } from "next/router";
import { useSnackbar } from 'notistack';
import React from "react";
import { ExceptionStrings } from '../../../../lang/common/exceptions';
import { GenericText } from '../../../../lang/common/genericText';
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import { LoadingContext } from '../../../../store/providers/loadingProvider';
import { LockContext } from "../../../../store/providers/lockProvider";
import SecondsToTimeFormat from '../../../../utility/secondsToTimeFormat';
import useTranslation from '../../../../utility/useTranslation';
import BackButton from '../../../common/buttons/backButton';
import { IconContainerWhite } from "../../../common/iconContainer/iconContainer";
import { TextBold14, TextBold20, TextMedium18 } from '../../../common/styledText/styledText';
import { HeaderBox, HeaderButton, HeaderContainer } from "../../layoutPage/styledComponents/headerStyledComponents";
import { ActionPlaylistStrings } from "../lang/actionPlaylistStrings";

interface ActionPlaylistHeaderProps {
    handleSubmit: (event: React.MouseEvent<HTMLButtonElement>) => void,
    action: "edit" | "add",
    id?: string,
}

const ActionPlaylistHeader = ({ id, action, handleSubmit }: ActionPlaylistHeaderProps) => {
    const { theme } = React.useContext(AccessibilityContext);
    const { t } = useTranslation(ActionPlaylistStrings);
    const genericText = useTranslation(GenericText).t;
    const [remainingTime, setRemainingTime] = React.useState<null | number>(null);
    const { setLoading } = React.useContext(LoadingContext);
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const exception = useTranslation(ExceptionStrings).t;
    const [isRowLocked, setIsRowLocked] = React.useState(false);
    const { lockedEntities, lockEntity, timeLeft } = React.useContext(LockContext);

    const handleSubmitAndUnlock = (event: React.MouseEvent<HTMLButtonElement>) => {
        handleSubmit(event);
        if (action === "edit") handleLock();
    }

    const handleLock = async () => {
        setLoading(true);
        let apiAction = "";
        if (!isRowLocked) apiAction = "lock";
        else apiAction = "unlock";
        if (id) {
            const lockSuccess = await lockEntity("playlist", id, apiAction);
            if (lockSuccess && apiAction === "lock") {
                setRemainingTime(600);
                setIsRowLocked(true);
                enqueueSnackbar(exception("rowLockSuccess"), { variant: 'success' });
                setLoading(false);
            } else if(lockSuccess && apiAction === "unlock") {
                setIsRowLocked(false);
                setRemainingTime(null);
                setLoading(false);
                router.push("/project-player/playlists");
            }
        }
    }

    const handleTimeExtend = async () => {
        setLoading(true);
        if (id) {
            const timeExtendSuccess = await lockEntity("playlist", id, "lock");
            if (timeExtendSuccess) {
                setRemainingTime(600);
                setIsRowLocked(true);
                enqueueSnackbar(exception("timeExtendSuccess"), { variant: 'success' });
                setLoading(false);
            } else {
                enqueueSnackbar(exception("timeExtendError"), { variant: "error" });
                setLoading(false);
                router.push("/project-player/playlists");
            }
        }
    }

    React.useEffect(() => {
        if (typeof router === "undefined" || typeof id === "undefined") return;
        if (typeof router.query.itemLocked === "undefined" && action === "edit") {
            router.push({
                pathname: "/project-player/playlists",
                query: {
                    itemNotLocked: true,
                }
            });
        }

        // check if item is locked in lockedEntities
        if (typeof lockedEntities !== "undefined" && id) {
            if (lockedEntities["playlist"] && lockedEntities["playlist"][id]) {
                setIsRowLocked(true);
                setRemainingTime(timeLeft("playlist", id));
            }
        }
        else {
            if (router.query.itemLocked === "true" && action === "edit") {
                setIsRowLocked(true);
                setRemainingTime(600);
            }
        }
    }, [id, lockedEntities, router.query.itemLocked]);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (remainingTime) {
            if (remainingTime > 0) {
                timeout = setTimeout(() => {
                    setRemainingTime(remainingTime - 1);
                }, 1000);
            } else {
                handleLock();
            }
        }

        return () => clearTimeout(timeout);
    }, [remainingTime])

    return (
        <HeaderBox sx={{
            [theme.breakpoints.down('md')]: {
                flexDirection: "row",
                '& > div:first-of-type': {
                    marginBottom: "0"
                }
            },

            [theme.breakpoints.down('sm')]: {
                padding: "16px 24px",
            }
        }}>
            <BackButton
                buttonProps={{
                    onClick: () => {
                        if (isRowLocked) {
                            handleLock();
                        } else {
                            router.push("/project-player/playlists");
                        }
                    }
                }}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <TextBold20
                    text={action === "edit" ? t("editPlaylist") : t("createPlaylist")}
                    textComponent="h2"
                    containerSx={{
                        lineHeight: "24px",
                    }}
                    textProps={{
                        sx: {
                            textTransform: "capitalize",
                        }
                    }}
                />
                {action === "edit" ?
                    <>
                        <TextMedium18
                            containerSx={{
                                lineHeight: "19px",
                                margin: "0 8px",
                                color: "error.main"
                            }}
                            text="|"
                        />
                        <TextMedium18
                            containerSx={{
                                lineHeight: "19px",
                                color: "error.main",
                            }}
                            text={
                                genericText("itemLockedByYou") + " " + (remainingTime ? (genericText("for") + " " + SecondsToTimeFormat(remainingTime ? remainingTime : 0)) : "")
                            }
                        />
                    </>
                    : null}
            </Box>
            <HeaderContainer sx={{
                [theme.breakpoints.down('md')]: {
                    width: "auto",
                    justifyContent: "flex-end",
                },
            }}>
                {action === "edit" ?
                    <Tooltip
                        disableFocusListener={!isRowLocked}
                        disableHoverListener={!isRowLocked}
                        disableInteractive={!isRowLocked}
                        disableTouchListener={!isRowLocked}
                        title={genericText("resetTimer")}
                        placement="top-end"
                    >
                        <HeaderButton
                            onClick={handleTimeExtend}
                            variant="contained"
                            color="error"
                            sx={{
                                minWidth: "auto",
                                padding: 0,
                                maxWidth: "44px",
                                marginRight: "16px",
                                [theme.breakpoints.down('md')]: {
                                    flexGrow: 1,
                                },

                                '@media (max-width: 420px)': {
                                    width: "100%",
                                    ml: "0",
                                },

                            }}
                        >
                            <IconContainerWhite>
                                <History />
                            </IconContainerWhite>
                        </HeaderButton>
                    </Tooltip>
                    : null}
                <HeaderButton
                    onClick={handleSubmitAndUnlock}
                    variant="contained"
                    color="info"
                    sx={{
                        maxWidth: "200px",
                        [theme.breakpoints.down('md')]: {
                            flexGrow: 1,
                        },

                        '@media (max-width: 420px)': {
                            width: "100%",
                            ml: "0",
                        }
                    }}
                    startIcon={
                        <IconContainerWhite>
                            <SaveOutlined />
                        </IconContainerWhite>
                    }
                >
                    <TextBold14
                        text={action === "edit" ? t("updatePlaylist") : t("createPlaylist")}
                        textProps={{
                            sx: {
                                textTransform: "capitalize",
                                color: "primary.contrastText",
                            }
                        }}
                    />
                </HeaderButton>
            </HeaderContainer>
        </HeaderBox>
    )
}

export default ActionPlaylistHeader;