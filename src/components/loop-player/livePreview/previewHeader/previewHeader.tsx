import { Box, Button, Skeleton, Tooltip, styled } from "@mui/material";
import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import React, { useContext } from "react";
import Clipboard from 'react-clipboard.js';
import { Error } from "../../../../interfaces/error/error";
import { Layout } from "../../../../interfaces/projectPlayer/layout";
import { GenericText } from '../../../../lang/common/genericText';
import { RefreshIfLoggedOut } from '../../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import useTranslation from '../../../../utility/useTranslation';
import BackButton from '../../../common/buttons/backButton';
import { TextBold20 } from "../../../common/styledText/styledText";
import { HeaderBox } from '../../layoutPage/styledComponents/headerStyledComponents';
import { PreviewHeaderStrings } from './lang/previewHeaderStrings';

const PreviewHeader = () => {
    const router = useRouter();
    const { t } = useTranslation(PreviewHeaderStrings);
    const { accessibility: { isDark }, theme } = useContext(AccessibilityContext);
    const [layout, setLayout] = React.useState<Layout | null>(null);
    const genericText = useTranslation(GenericText).t;
    const { enqueueSnackbar } = useSnackbar();

    const StyledButton = styled(Button)(({ theme }) => ({
        minWidth: "auto",
        padding: "4px",
        marginRight: "15px",
        fontSize: "24px",
        borderRadius: "4px",
        boxShadow: "0 2px 4px 0 rgba(0,0,32,0.12) !important",


        backgroundColor: isDark ? theme.palette.grey[800] : theme.palette.background.paper,
        '&:hover': {
            backgroundColor: isDark ? theme.palette.grey[700] : theme.palette.background.default,
        },
    }))

    const abortController = new AbortController();

    React.useEffect(() => {
        const FetchLayout = () => {
            fetch('/api/project-player/layout', {
                method: "POST",
                body: JSON.stringify({
                    action: "get",
                    id: router.query.previewId,
                }),
                signal: abortController.signal,
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
                    if (abortController.signal.aborted) {
                        console.log('The user aborted the request');
                    }
                    else RefreshIfLoggedOut(err.message);
                })
        }

        if (router.query.previewId) FetchLayout();
    }, [router.query.previewId]);

    return (
        <HeaderBox>
            <BackButton />
            {layout ?
                <TextBold20
                    textComponent="h2"
                    containerSx={{
                        sx: {
                            lineHeight: "24px"
                        }
                    }}
                    text={
                        <>
                            {t("livePreviewOf") + " " + layout.title + " "}
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
        </HeaderBox>
    )
}

export default PreviewHeader;