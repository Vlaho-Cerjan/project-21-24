import { Backdrop, Box, LinearProgress, Skeleton, Typography, styled } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useContext, useEffect, useState } from 'react';
import { RowItem } from '../../../../interfaces/projectPlayer/rowItem';
import { RefreshIfLoggedOut } from '../../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import useTranslation from '../../../../utility/useTranslation';
import { TextMedium16 } from '../../../common/styledText/styledText';
import { CoreBg } from '../../../core/coreBackground';
import FeaturedCarousel from '../featuredCarousel/featuredCarousel';
import FeaturedRows from '../featuredRows/featuredRows';
import LayoutHeader from '../layoutHeader/layoutHeader';
import { CarouselContentContainer } from '../styledComponents/carouselStyledComponents';
import { MainBox, MainContainerBox } from '../styledComponents/mainStyledComponents';
import { ContentBox, ContentBoxTitleContainer, ItemContainerBox } from '../styledComponents/rowsStyledComponents';

const StyledArrowSkeleton = styled(Skeleton)(() => ({
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    height: "44px",
    width: "44px",
}));

type Row = {
    id: string;
    title?: string;
    items: RowItem[];
    type: string;
    locked: string | null;
};

const EditLayoutComponent = () => {
    const [featuredRowData, setFeaturedRowData] = useState<Row>({
        id: '',
        items: [],
        type: '',
        locked: null,
    });

    const [rowData, setRowData] = useState<Row[] | null>(null);

    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const router = useRouter();

    const { theme } = useContext(AccessibilityContext);

    const { t: genericText } = useTranslation('generic');

    const { t: exception } = useTranslation('exception');

    const { enqueueSnackbar } = useSnackbar();

    async function fetchData() {
        const abortController = new AbortController();
        try {
            const response = await fetch("/api/project-player/layout", {
                method: "POST",
                body: JSON.stringify({
                    action: "layoutRows",
                    id: router.query.layoutId,
                }),
                signal: abortController.signal,
            });

            if (!response.ok) {
                throw await response.json();
            }

            const data = await response.json();
            const featuredRowData = data.find((row: any) => row.featured === true);
            setFeaturedRowData(featuredRowData);
            setRowData(data.filter((row: any) => row.featured === false));
        } catch (err) {
            console.log("fetchData error");
            handleFetchError(err, "layoutRowsNotFoundError", abortController);
        }
    }

    async function getLayout() {
        const abortController = new AbortController();
        try {
            const response = await fetch("/api/project-player/layout", {
                method: "POST",
                body: JSON.stringify({
                    action: "get",
                    id: router.query.layoutId,
                }),
                signal: abortController.signal,
            });

            if (!response.ok) {
                throw await response.json();
            }

            const data = await response.json();

            if (typeof data.live !== "undefined" && data.live === true) {
                router.push("/project-player/layout?layoutLive=true");
                return;
            }

            if (typeof data.processing !== "undefined" && data.processing === true) {
                setIsProcessing(data.processing);
                return;
            }

            setIsProcessing(false);
            setTimeout(() => {
                fetchData();
            }, 1000);
        } catch (err) {
            console.log("getLayout error");
            handleFetchError(err, "noLayoutFound", abortController);
            router.push("/project-player/layout?layoutNotFound=true");
        }
    }

    function handleFetchError(err: any, message: string, abortController: AbortController) {
        if (abortController.signal.aborted) {
            console.log("The user aborted the request");
        } else {
            if (err.message) RefreshIfLoggedOut(err.message);
            enqueueSnackbar(exception(message) || '', { variant: "error" });
        }
    }

    useEffect(() => {
        let fetchDataInterval: NodeJS.Timeout;
        let layoutCreationErrorTimeout: NodeJS.Timeout;

        if (router.query.layoutId) {
            fetchDataInterval = setInterval(() => {
                fetchData();
            }, 60000);
        }

        if (router.query.layoutCreationError) {
            layoutCreationErrorTimeout = setTimeout(() => {
                enqueueSnackbar(exception("layoutCreationError"), { variant: "error" });
            }, 1000);
        }

        return () => {
            clearInterval(fetchDataInterval);
            clearTimeout(layoutCreationErrorTimeout);
        };
    }, [router.query.layoutId, router.query.layoutCreationError]);

    useEffect(() => {
        let getLayoutInterval: NodeJS.Timeout;

        if (router.query.layoutId && isProcessing) {
            getLayoutInterval = setInterval(() => {
                getLayout();
            }, 10000);
        }

        return () => {
            clearInterval(getLayoutInterval);
        };
    }, [router.query.layoutId, isProcessing]);

    useEffect(() => {
        if (router.query.layoutId && router.query.layoutId.length > 0) {
            getLayout();
        }
    }, [router.query.layoutId]);

    return (
        <MainContainerBox>
            <MainBox>
                <LayoutHeader processing={isProcessing} />
                {typeof featuredRowData !== "undefined" && featuredRowData.id && !isProcessing ? (
                    <FeaturedCarousel
                        featuredRowProp={featuredRowData}
                        setFeaturedRowProp={setFeaturedRowData}
                    />
                ) : (
                    <Box
                        className="darkerBackground"
                        sx={{
                            width: "100%",
                            padding: "25px 0 40px",
                        }}
                    >
                        <CarouselContentContainer>
                            <Skeleton variant="rectangular" width={132} height={32} />
                            <Skeleton
                                variant="rectangular"
                                width={32}
                                height={32}
                                sx={{ borderRadius: "4px" }}
                            />
                        </CarouselContentContainer>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                height: "100%",
                            }}
                        >
                            <Skeleton
                                height="35.7%"
                                variant="rectangular"
                                sx={{ borderRadius: "16px", width: "63.5%", height: "auto", aspectRatio: "16/9" }}
                            />
                            <StyledArrowSkeleton
                                sx={{
                                    left: "40px",
                                    [theme.breakpoints.down("lg")]: {
                                        left: "30px",
                                    },
                                    [theme.breakpoints.down("md")]: {
                                        left: "20px",
                                    },
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
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                )}
                {typeof rowData !== "undefined" && rowData && !isProcessing ? (
                    <FeaturedRows rowsProp={rowData} setRowsProps={setRowData} />
                ) : (
                    <Box>
                        {[1, 2, 3].map((item) => (
                            <ItemContainerBox key={item} className={item % 2 === 0 ? "darkerBackground" : ""}>
                                <ContentBox>
                                    <Skeleton variant="rectangular" width={132}>
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
                        ))}
                    </Box>
                )}
                {isProcessing && (
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
                )}
            </MainBox>
        </MainContainerBox>
    );
}

export default EditLayoutComponent;