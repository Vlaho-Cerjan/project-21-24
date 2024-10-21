import { Backdrop, Box, LinearProgress, Skeleton, styled, Typography } from "@mui/material";
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { RowItem } from '../../../interfaces/projectPlayer/rowItem';
import { ExceptionStrings } from '../../../lang/common/exceptions';
import { GenericText } from '../../../lang/common/genericText';
import { RefreshIfLoggedOut } from '../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import useTranslation from '../../../utility/useTranslation';
import { TextMedium16 } from '../../common/styledText/styledText';
import { CoreBg } from '../../core/coreBackground';
import { CarouselContentContainer } from '../layoutPage/styledComponents/carouselStyledComponents';
import { MainBox, MainContainerBox } from '../layoutPage/styledComponents/mainStyledComponents';
import { ContentBox, ContentBoxTitleContainer, ItemContainerBox } from '../layoutPage/styledComponents/rowsStyledComponents';
import PreviewCarousel from './previewCarousel/previewCarousel';
import PreviewHeader from './previewHeader/previewHeader';
import PreviewRows from './previewRows/previewRows';

const StyledArrowSkeleton = styled(Skeleton)(() => ({
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    height: "44px",
    width: "44px",
}))

const LivePreviewComponent = () => {
    const [featuredRow, setFeaturedRow] = React.useState<{
        id: string,
        items: RowItem[]
    } | null>();

    const [rows, setRows] = React.useState<{
        id: string,
        title: string,
        items: RowItem[]
    }[]>();

    const [processing, setProcessing] = React.useState(false);
    const router = useRouter();
    const { theme } = React.useContext(AccessibilityContext);
    const genericText = useTranslation(GenericText).t;
    const exception = useTranslation(ExceptionStrings).t;
    const { enqueueSnackbar } = useSnackbar();

    const abortController = new AbortController();

    function fetchData() {
        fetch('/api/project-player/layout', {
            method: "POST",
            body: JSON.stringify({
                action: "getPreview",
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
            .then((data) => {
                const featuredRow = data.rows.find((row: any) => row.featured === true)
                setFeaturedRow(featuredRow);
                setRows(data.rows.filter((row: any) => row.featured === false));
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("layoutFetchError"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
    }

    function getLayout() {
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
                if (typeof layout.processing !== 'undefined' && layout.processing === true) {
                    setProcessing(layout.processing);
                } else {
                    setProcessing(false);
                    fetchData();
                }
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("layoutFetchError"), { variant: "error" });
                    router.push('/project-player/layout', {
                        query: {
                            error: "layoutCreationError"
                        }
                    })
                    //console.error('The request failed');
                }
            })
    }

    React.useEffect(() => {
        let interval: NodeJS.Timeout;
        if (router.query.previewId) {
            interval = setInterval(() => {
                getLayout();
            }, 60000)
        }

        return () => {
            // abortController.abort();
            clearInterval(interval);
        }
    }, [router]);

    React.useEffect(() => {
        if (router.query.previewId) {
            getLayout();
        }

        // return () => abortController.abort();
    }, [router]);


    return (
        <MainContainerBox>
            <MainBox>
                <PreviewHeader />
                {(typeof featuredRow !== "undefined" && featuredRow && !processing) ?
                    <PreviewCarousel previewRowProp={featuredRow} />
                    :
                    <Box
                        className={"darkerBackground"}
                        sx={{
                            width: "100%",
                            height: "430px",
                            padding: "25px 0 40px",
                        }}
                    >
                        <CarouselContentContainer>
                            <Skeleton
                                variant="rectangular"
                                width={132}
                                height={32}
                            />
                            <Skeleton
                                variant="rectangular"
                                width={32}
                                height={32}
                                sx={{ borderRadius: "4px" }}
                            />
                        </CarouselContentContainer>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative"
                        }}>
                            <Skeleton height={308} variant="rectangular" sx={{ borderRadius: "16px", width: "63.5%" }} />
                            <StyledArrowSkeleton
                                sx={{
                                    left: "40px",

                                    [theme.breakpoints.down("lg")]: {
                                        left: "30px",
                                    },
                                    [theme.breakpoints.down("md")]: {
                                        left: "20px",
                                    }
                                }}
                            />
                            <StyledArrowSkeleton
                                sx={{
                                    right: "40px",

                                    [theme.breakpoints.down("lg")]: {
                                        right: "30px",
                                    },
                                    [theme.breakpoints.down("md")]: {
                                        right: "20px",
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                }
                {(typeof rows !== "undefined" && !processing) ?
                    <PreviewRows rowsProp={rows} />
                    :
                    <Box>
                        <ItemContainerBox>
                            <ContentBox>
                                <Skeleton variant={"rectangular"} width={132}>
                                    <ContentBoxTitleContainer>
                                        <Typography sx={{ fontSize: "1em", lineHeight: "inherit" }}>.</Typography>
                                    </ContentBoxTitleContainer>
                                </Skeleton>
                                <Skeleton
                                    variant="rectangular"
                                    width={32}
                                    height={32}
                                    sx={{ borderRadius: "4px" }}
                                />
                            </ContentBox>
                        </ItemContainerBox>
                        <ItemContainerBox className="darkerBackground">
                            <ContentBox>
                                <Skeleton variant={"rectangular"} width={132}>
                                    <ContentBoxTitleContainer>
                                        <Typography sx={{ fontSize: "1em", lineHeight: "inherit" }}>.</Typography>
                                    </ContentBoxTitleContainer>
                                </Skeleton>
                                <Skeleton
                                    variant="rectangular"
                                    width={32}
                                    height={32}
                                    sx={{ borderRadius: "4px" }}
                                />
                            </ContentBox>
                        </ItemContainerBox>
                        <ItemContainerBox>
                            <ContentBox>
                                <Skeleton variant={"rectangular"} width={132}>
                                    <ContentBoxTitleContainer>
                                        <Typography sx={{ fontSize: "1em", lineHeight: "inherit" }}>.</Typography>
                                    </ContentBoxTitleContainer>
                                </Skeleton>
                                <Skeleton
                                    variant="rectangular"
                                    width={32}
                                    height={32}
                                    sx={{ borderRadius: "4px" }}
                                />
                            </ContentBox>
                        </ItemContainerBox>
                    </Box>
                }
                {
                    processing ?
                        <Backdrop
                            open={true}
                            sx={{
                                position: "absolute",
                                borderRadius: "16px",
                            }}
                        >
                            <CoreBg sx={{ width: "50%", height: "auto", textAlign: "center" }}>
                                <TextMedium16
                                    containerSx={{
                                        paddingBottom: "16px",
                                    }}
                                    text={genericText("duplicatingInProgress")}
                                />
                                <LinearProgress />
                            </CoreBg>
                        </Backdrop>
                        :
                        null
                }
            </MainBox>
        </MainContainerBox>
    )
}

export default LivePreviewComponent;