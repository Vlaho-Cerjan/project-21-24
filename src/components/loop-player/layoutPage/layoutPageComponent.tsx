import { Add } from '@mui/icons-material';
import { Box, Grid, Skeleton } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from "react";
import { ExceptionStrings } from '../../../lang/common/exceptions';
import { RefreshIfLoggedOut } from '../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { LoadingContext } from '../../../store/providers/loadingProvider';
import useTranslation from '../../../utility/useTranslation';
import useWindowSize from '../../../utility/windowSize';
import ButtonWithIcon from '../../common/buttons/buttonWithIcon';
import StyledCreateItem from "../../common/createItem/createItem";
import StyledLayoutCard from "../../common/layoutCard/layoutCard";
import { TextBold20 } from '../../common/styledText/styledText';
import DuplicateLayout from './duplicateLayout/duplicateLayout';
import EditTitle from './editTitle/editTitle';
import { LayoutPageStrings } from './lang/layoutPageStrings';
import { MainContainerBox } from "./styledComponents/mainStyledComponents";


const LayoutPageComponent = () => {
    const { enqueueSnackbar } = useSnackbar();

    const [layoutItems, setLayoutItems] = React.useState<any[] | null>(null);

    const [open, setOpen] = React.useState(false);

    const { width } = useWindowSize();

    const { theme } = React.useContext(AccessibilityContext);
    const { setLoading } = React.useContext(LoadingContext);
    const router = useRouter();
    const { t } = useTranslation(LayoutPageStrings);

    const exception = useTranslation(ExceptionStrings).t;

    const [editId, setEditId] = React.useState<string>();
    const [duplicateId, setDuplicateId] = React.useState<string>();
    const [title, setTitle] = React.useState<string>("");
    const [openEdit, setOpenEdit] = React.useState(false);
    const [openDuplicate, setOpenDuplicate] = React.useState(false);
    const [layoutProcessing, setLayoutProcessing] = React.useState(false);
    const [duplicationInProgress, setDuplicationInProgress] = React.useState(false);

    React.useEffect(() => {
        if (editId && layoutItems && layoutItems.length > 0) {
            setTitle(layoutItems.find(x => x.id === editId).title);
            setOpenEdit(true);
        }
    }, [editId]);

    React.useEffect(() => {
        if (duplicateId && layoutItems && layoutItems.length > 0) {
            setTitle(layoutItems.find(x => x.id === duplicateId).title);
            setOpenDuplicate(true);
        }
    }, [duplicateId]);


    const abortController = new AbortController();

    async function FetchData() {
        const abortController = new AbortController();
        try {
            const response = await fetch('/api/project-player/layout', {
                method: "POST",
                body: JSON.stringify({
                    action: "list",
                    limit: 20,
                    offset: 0,
                }),
                signal: abortController.signal,
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.layouts) {
                    setLayoutItems(data.layouts);
                }
            } else {
                const errorData = await response.json();
                return Promise.reject(errorData);
            }
        } catch (err: any) {
            if (abortController.signal.aborted) {
                console.log('The user aborted the request', 'fetchData');
            } else {
                RefreshIfLoggedOut(err.message);
                enqueueSnackbar(exception("noLayoutsFound"), { variant: "error" });
            }
        }
    }

    React.useEffect(() => {
        FetchData();

        return () => {
            abortController.abort();
        }
    }, [])

    React.useEffect(() => {
        let shallowReload = false;
        if (router.query.layoutCreationError) {
            enqueueSnackbar(exception("layoutCreationError"), { variant: "error" });
            shallowReload = true;
        }
        if (router.query.layoutNotFound) {
            enqueueSnackbar(exception("layoutNotFound"), { variant: "error" });
            shallowReload = true;
        }
        if (router.query.layoutLive) {
            enqueueSnackbar(exception("layoutLiveError"), { variant: "error" });
            shallowReload = true;
        }

        if (shallowReload) {
            router.replace(router.pathname, undefined, { shallow: true });
        }
    }, [router])

    React.useEffect(() => {
        let interval: NodeJS.Timeout = setInterval(() => { }, 1000);
        if (layoutProcessing) {
            setDuplicationInProgress(true);
            interval = setInterval(() => {
                FetchData();
            }, 10000)
        } else {
            if (duplicationInProgress) {
                enqueueSnackbar(exception("layoutDuplicationSuccess"), { variant: "success" });
                setDuplicationInProgress(false);
            }
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [layoutProcessing]);

    const handleSetTitle = (id: string, title: string) => {
        setLoading(true);
        fetch('/api/project-player/layout', {
            method: "POST",
            body: JSON.stringify({
                action: "update",
                id: id,
                title: title
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    if (layoutItems) {
                        setLayoutItems(layoutItems.map(x => {
                            if (x.id === id) {
                                x.title = title;
                            }
                            return x;
                        }));
                        enqueueSnackbar(exception("layoutUpdateSuccess"), { variant: "success" });
                    }
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("layoutUpdateFail"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setEditId("");
                setLoading(false);
            });
    }

    const handleDuplicateLayout = (id: string, title?: string) => {
        setLoading(true);
        fetch('/api/project-player/layout', {
            method: "POST",
            body: JSON.stringify({
                action: "duplicate",
                id: id,
                title: title
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    enqueueSnackbar(exception("layoutWillBeDuplicatedInAFewSeconds"), { variant: "success" });
                    FetchData();
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("layoutNotDuplicated"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setDuplicateId("");
                setLoading(false);
            });
    }

    const createLayout = (title: string) => {
        setLoading(true);
        fetch('/api/project-player/layout', {
            method: "POST",
            body: JSON.stringify({
                action: "create",
                title: title,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    FetchData();
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("layoutCreateError"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const { data } = useSession();

    return (
        <MainContainerBox>
            <TextBold20
                containerSx={{
                    mb: "32px"
                }}
                text={t("allLayouts")}
                textProps={{
                    variant: "h5"
                }}
                textComponent="h1"
            />
            {typeof layoutItems !== "undefined" && !layoutItems ? (
                <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                        <Skeleton height={111} variant="rectangular" sx={{ borderRadius: "16px" }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Skeleton height={111} variant="rectangular" sx={{ borderRadius: "16px" }} />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <Skeleton height={111} variant="rectangular" sx={{ borderRadius: "16px" }} />
                    </Grid>
                    {width >= theme.breakpoints.values.lg ?
                        <Grid item xs={12} md={3}>
                            <Skeleton height={111} variant="rectangular" sx={{ borderRadius: "16px" }} />
                        </Grid>
                        :
                        null
                    }
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    {(layoutItems && layoutItems.length > 0) ? layoutItems.map((layoutItem: any) => {
                        return (
                            <Grid
                                key={layoutItem.id}
                                item
                                xs={12}
                                sm={4}
                                md={3}
                                sx={{
                                    '@media (min-width: 420px) and (max-width: 600px)': {
                                        maxWidth: "50%",
                                    }
                                }}
                            >
                                <StyledLayoutCard
                                    setLayoutProcessing={setLayoutProcessing}
                                    processing={layoutItem.processing}
                                    live={layoutItem.live}
                                    title={layoutItem.title}
                                    code={layoutItem.code}
                                    id={layoutItem.id}
                                    fetchData={FetchData}
                                    setEditId={setEditId}
                                    setDuplicateId={setDuplicateId}
                                />
                            </Grid>
                        )
                    }
                    ) : null}
                </Grid>
            )
            }
            {(data && data.user.roles.includes("admin")) ?
                <>
                    <Box sx={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
                        <ButtonWithIcon
                            startIcon={<Add />}
                            buttonText={t("createLayout")}
                            buttonFunction={() => setOpen(true)}
                            buttonSx={{
                                '& span': {
                                    textTransform: "uppercase",
                                }
                            }}
                        />
                    </Box>
                    <StyledCreateItem
                        open={open}
                        setOpen={setOpen}
                        items={layoutItems ? layoutItems : []}
                        addTitleText={t("addLayoutTitle")}
                        addButtonText={t("createLayout")}
                        createItem={createLayout}
                    />
                    {(typeof editId !== "undefined") ?
                        <EditTitle
                            id={editId}
                            setId={setEditId}
                            title={title}
                            setTitle={handleSetTitle}
                            open={openEdit}
                            setOpen={setOpenEdit}
                            items={layoutItems ? layoutItems : []}
                        />
                        :
                        null
                    }
                    {(typeof duplicateId !== "undefined") ?
                        <DuplicateLayout
                            id={duplicateId}
                            setId={setDuplicateId}
                            title={title}
                            duplicateFunction={handleDuplicateLayout}
                            open={openDuplicate}
                            setOpen={setOpenDuplicate}
                            items={layoutItems ? layoutItems : []}
                        />
                        :
                        null
                    }
                </>
                :
                null}
        </MainContainerBox>
    )
}

export default LayoutPageComponent;