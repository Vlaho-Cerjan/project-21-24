import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Divider, Skeleton, Tooltip } from '@mui/material';
import { useRouter } from "next/router";
import { useSnackbar } from 'notistack';
import React from "react";
import Clipboard from 'react-clipboard.js';
import { Error } from '../../../../interfaces/error/error';
import { Layout } from "../../../../interfaces/projectPlayer/layout";
import { ExceptionStrings } from '../../../../lang/common/exceptions';
import { GenericText } from '../../../../lang/common/genericText';
import { RefreshIfLoggedOut } from '../../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import { LoadingContext } from "../../../../store/providers/loadingProvider";
import useTranslation from '../../../../utility/useTranslation';
import useWindowSize from '../../../../utility/windowSize';
import BackButton from '../../../common/buttons/backButton';
import StyledButtonWithIcon from '../../../common/buttons/buttonWithIcon';
import { TextBold20 } from '../../../common/styledText/styledText';
import { HeaderBox, HeaderContainer } from '../styledComponents/headerStyledComponents';
import { LayoutHeaderStrings } from "./lang/layoutHeaderStrings";

interface LayoutHeaderProps {
    processing: boolean;
}

const LayoutHeader = ({ processing }: LayoutHeaderProps) => {
    const { theme, accessibility: { isDark, language } } = React.useContext(AccessibilityContext);

    const { width } = useWindowSize();

    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(LayoutHeaderStrings);
    const genericText = useTranslation(GenericText).t;
    const exception = useTranslation(ExceptionStrings).t;
    const [layout, setLayout] = React.useState<Layout | null>(null);
    const router = useRouter();

    const { setLoading } = React.useContext(LoadingContext);

    const publishFunction = () => {
        setLoading(true);
        fetch('/api/project-player/layout', {
            method: "POST",
            body: JSON.stringify({
                action: "update",
                id: router.query.layoutId,
                live: true,
            }),
        })
            .then(async (response) => {
                if (response.ok) {
                    enqueueSnackbar(exception("layoutPublished"), { variant: "success" });
                    router.push("/project-player/layout");
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                RefreshIfLoggedOut(err.message);
                enqueueSnackbar(exception("layoutNotPublished"), { variant: "error" });
                //console.error('The request failed');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    React.useEffect(() => {
        const FetchLayout = () => {
            fetch('/api/project-player/layout/', {
                method: "POST",
                body: JSON.stringify({
                    action: "get",
                    id: router.query.layoutId,
                })
            })
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(await response.json());
                })
                .then((layout) => {
                    setLayout(layout);
                })
                .catch((err: Error) => {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("layoutFetchError"), { variant: "error" });
                    //console.error('The request failed');
                })
        }

        if (router.query.layoutId) FetchLayout();
    }, [router.query.layoutId]);

    return (
        <HeaderBox>
            <Box sx={{ display: "flex", alignItems: "center" }}>
                <BackButton
                    buttonProps={{
                        sx: {
                            zIndex: processing ? theme.zIndex.drawer + 10 : 1,
                        }
                    }}
                />
                <Box
                    sx={{ flexGrow: 1 }}
                >
                    {layout ?
                        <TextBold20
                            textComponent="h2"
                            containerSx={{
                                lineHeight: "24px",
                                padding: "0 4px",
                            }}
                            textProps={{
                                sx: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "flex-start",
                                }
                            }}
                            text={
                                <>
                                    <span>
                                        {genericText("edit") + " " + layout.title + " "}
                                    </span>
                                    {layout.code ?
                                        <span style={{ display: "inline-block" }}>
                                            <Tooltip sx={{ fontWeight: 500 }} title={genericText("copyToClipboard")} placement="top-start">
                                                <Box sx={{
                                                    '& button': {
                                                        borderRadius: "12px",
                                                        border: "1px solid " + (isDark ? theme.palette.grey[800] : theme.palette.grey[400]),
                                                        backgroundColor: isDark ? theme.palette.grey[600] : theme.palette.grey[200],
                                                        padding: "2px 6px",
                                                        color: theme.palette.text.primary,

                                                        '&:hover': {
                                                            backgroundColor: isDark ? theme.palette.grey[700] : theme.palette.grey[300],
                                                        }
                                                    }
                                                }} component="span">
                                                    <Clipboard
                                                        style={{
                                                            fontSize: "1em",
                                                            fontWeight: 500,
                                                            marginLeft: "10px",
                                                        }}
                                                        data-clipboard-text={layout.code}
                                                        onSuccess={() => {
                                                            enqueueSnackbar(genericText("codeCopied"), { variant: "success" });
                                                        }}
                                                        onClick={(event: MouseEvent) => {
                                                            event.preventDefault();
                                                            event.stopPropagation();
                                                        }}
                                                    >
                                                        {layout.code}
                                                    </Clipboard>
                                                </Box>
                                            </Tooltip>
                                        </span>
                                        : null}
                                </>
                            }
                        />
                        :
                        <Skeleton variant="rectangular" width={200} height={24} sx={{ borderRadius: "8px" }} />
                    }
                </Box>
            </Box>
            {width < theme.breakpoints.values.sm ?
                <Divider flexItem sx={{ borderBottomWidth: "2px", mb: "16px" }} />
                :
                null
            }
            <HeaderContainer>
                <StyledButtonWithIcon
                    startIcon={<BackupOutlinedIcon />}
                    buttonText={t("publishLive")}
                    buttonFunction={publishFunction}
                    containerSx={{
                        ml: "15px",
                        minWidth: language === "en" ? "190px" : "215px",

                        [theme.breakpoints.down('md')]: {
                            flexGrow: 1,
                        },

                        [theme.breakpoints.down('sm')]: {
                            mb: "16px",
                            ml: "0"
                        }
                    }}
                />
                <StyledButtonWithIcon
                    startIcon={<VisibilityOutlinedIcon />}
                    buttonText={t("livePreview")}
                    buttonHref={"/project-player/live-preview/" + router.query.layoutId}
                    buttonColor="success"
                    containerSx={{
                        ml: "15px",
                        minWidth: language === "en" ? "192px" : "274px",

                        [theme.breakpoints.down('md')]: {
                            flexGrow: 1,
                        },

                        [theme.breakpoints.down('sm')]: {
                            mb: "16px",
                        },

                        '@media (max-width: 465px)': {
                            width: "100%",
                            ml: "0",
                        }
                    }}
                />
            </HeaderContainer>
        </HeaderBox>
    )
}

export default LayoutHeader;