import {
    ContentCopyOutlined,
    DeleteOutlineOutlined,
    EditOutlined,
    EditRounded,
    MoreVert,
    PublishOutlined,
    VisibilityOutlined
} from '@mui/icons-material';
import { Box, Card, CardContent, styled, Tooltip } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useSnackbar } from 'notistack';
import React from 'react';
import Clipboard from 'react-clipboard.js';
import { ExceptionStrings } from '../../../lang/common/exceptions';
import { GenericText } from '../../../lang/common/genericText';
import { RefreshIfLoggedOut } from '../../../lib/refreshIfLoggedOut';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { LoadingContext } from '../../../store/providers/loadingProvider';
import useTranslation from '../../../utility/useTranslation';
import { CoreBg } from '../../core/coreBackground';
import StyledActionPrompt from '../actionComponents/actionPrompt';
import StyledDropdownIconOnly from '../inputs/dropdownIconOnly';
import Link from '../navigation/Link';
import { TextBlack12, TextBold14, TextMedium16 } from '../styledText/styledText';
import { LayoutCardStrings } from './lang/layoutCardStrings';

interface CardProps {
    live: boolean;
    setLayoutProcessing: (value: boolean) => void;
    processing: boolean;
    title: string;
    code: string;
    id: string;
    fetchData: () => void;
    setEditId: (id: string) => void;
    setDuplicateId: (id: string) => void;
}

const StyledLinkBox = styled(Link)(({ theme }) => ({
    display: "block",
    textDecoration: "none",
}))

const LayoutCard = ({ live, setLayoutProcessing, processing, title, code, id, fetchData, setEditId, setDuplicateId }: CardProps) => {
    const { enqueueSnackbar } = useSnackbar();

    const { t } = useTranslation(LayoutCardStrings);

    const generic = useTranslation(GenericText).t;

    const exception = useTranslation(ExceptionStrings).t;

    const { theme, accessibility: { isDark } } = React.useContext(AccessibilityContext);

    const { setLoading } = React.useContext(LoadingContext);

    const [deletePopup, setDeletePopup] = React.useState(false);

    const abortController = new AbortController();

    const EditTitleFunction = () => {
        setEditId(id);
    }

    const DeletePromptFunction = () => {
        setDeletePopup(true);
    }

    const DeleteFunction = () => {
        setLoading(true);
        fetch('/api/project-player/layout', {
            method: "POST",
            body: JSON.stringify({
                action: "delete",
                id: id,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    enqueueSnackbar(exception("layoutDeleted"), { variant: "success" });
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("layoutNotDeleted"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                fetchData();
                setDeletePopup(false);
                setLoading(false);
            })
    }

    const PublishFunction = () => {
        setLoading(true);
        fetch('/api/project-player/layout', {
            method: "POST",
            body: JSON.stringify({
                action: "update",
                id: id,
                live: true,
            }),
        })
            .then(async (response) => {
                if (response.ok) {
                    enqueueSnackbar(exception("layoutPublished"), { variant: "success" });
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("layoutNotPublished"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                fetchData();
                setLoading(false);
            })
    }

    const DuplicateFunction = async () => {
        setDuplicateId(id);
    }

    React.useEffect(() => {
        if (processing) {
            setLayoutProcessing(true);
        } else {
            setLayoutProcessing(false);
        }
    }, [processing]);

    const { data } = useSession();

    const dropdownItems = data?.user?.roles.includes("admin") ?
        (live ? [
            {
                text: generic("preview"),
                icon: <VisibilityOutlined />,
                href: "/project-player/live-preview/" + id,
            },
            {
                text: generic("duplicate"),
                icon: <ContentCopyOutlined />,
                function: DuplicateFunction,
            }
        ] :
            processing ?
                [
                    {
                        text: generic("edit"),
                        icon: <EditOutlined />,
                        href: "/project-player/layout/" + id,
                    },
                    {
                        text: generic("duplicatingInProgress"),
                        disabled: true,
                    }
                ]
                :
                [
                    {
                        text: t("editTitle"),
                        icon: <EditRounded />,
                        function: EditTitleFunction,
                    },
                    {
                        text: generic("edit"),
                        icon: <EditOutlined />,
                        href: "/project-player/layout/" + id,
                    },
                    {
                        text: generic("delete"),
                        icon: <DeleteOutlineOutlined />,
                        function: DeletePromptFunction,
                    },
                    {
                        text: generic("publish"),
                        icon: <PublishOutlined />,
                        function: PublishFunction,
                    },
                    {
                        text: generic("preview"),
                        icon: <VisibilityOutlined />,
                        href: "/project-player/live-preview/" + id,
                    },
                    {
                        text: generic("duplicate"),
                        icon: <ContentCopyOutlined />,
                        function: DuplicateFunction,
                    }
                ])
        :
        [
            {
                text: generic("preview"),
                icon: <VisibilityOutlined />,
                href: "/project-player/live-preview/" + id,
            }
        ]

    const CardComponent = (
        <Card sx={{ height: "100%", position: "relative", borderRadius: "22px", boxShadow: "none" }}>
            <CardContent sx={{ height: "100%", padding: "22px 15px 25px 25px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", minHeight: "25px", marginBottom: "16px" }}>
                    <TextBold14
                        text={title}
                        containerSx={{ lineHeight: "17px" }}
                        textProps={{
                            variant: "h3"
                        }}
                    />
                    {
                        live ?
                            <TextBlack12
                                text={t("LIVE")}
                                containerSx={{
                                    ml: "12px", padding: "2px 6px", borderRadius: "4px", backgroundColor: "error.main", color: "error.contrastText"
                                }}
                            />
                            :
                            null
                    }
                </Box>
                {code ?
                    <TextMedium16
                        containerSx={{
                            width: "calc(100% - 30px)",
                            lineHeight: "20px"
                        }}
                        textProps={{
                            sx: {
                                color: "text.primary",
                            }
                        }}
                        text={
                            <>
                                <span style={{ marginRight: "4px" }}>{generic("code") + " : "}</span>
                                <span style={{ display: "inline-block" }}>
                                    <Tooltip title={generic("copyToClipboard")} placement="top-start">
                                        <Box
                                            sx={{
                                                '& button': {
                                                    borderRadius: "12px",
                                                    border: "1px solid " + (isDark ? theme.palette.grey[800] : theme.palette.grey[400]),
                                                    backgroundColor: isDark ? theme.palette.grey[600] : theme.palette.grey[200],
                                                    padding: "2px 6px",
                                                    color: theme.palette.text.primary,
                                                    fontWeight: 500,

                                                    '&:hover': {
                                                        backgroundColor: isDark ? theme.palette.grey[700] : theme.palette.grey[300],
                                                    }
                                                }
                                            }}
                                            component={"span"}
                                        >
                                            <Clipboard
                                                style={{
                                                    fontSize: "1em",
                                                    fontWeight: 500,
                                                    cursor: "copy",
                                                }}
                                                data-clipboard-text={code}
                                                onSuccess={() => {
                                                    enqueueSnackbar(generic("codeCopied"), { variant: "success" });
                                                }}
                                                onClick={(event: MouseEvent) => {
                                                    event.preventDefault();
                                                    event.stopPropagation();
                                                }}
                                            >
                                                {code}
                                            </Clipboard>
                                        </Box>
                                    </Tooltip>
                                </span>
                            </>
                        }
                    />
                    :
                    <Box sx={{ height: "20px" }}></Box>}
                <Box sx={{
                    position: "absolute",
                    bottom: "20px",
                    right: "15px",
                }}>
                    <StyledDropdownIconOnly
                        id={id}
                        icon={<MoreVert />}
                        buttonId={id}
                        dropdownId={"dropdown-" + id}
                        dropdownMenuItems={dropdownItems}
                    />
                </Box>
            </CardContent>
        </Card>
    )

    return (
        <>
            {live ?
                <CoreBg
                    sx={{
                        height: "100%",
                        padding: 0,
                        border: "2px solid " + theme.palette.error.main,

                        '&:hover': {
                            border: "2px solid " + theme.palette.error.main,
                        }
                    }}
                >
                    {CardComponent}
                </CoreBg>
                :
                <CoreBg
                    sx={{
                        height: "100%",
                        padding: 0,
                        border: live ? "2px solid " + theme.palette.error.main : "2px solid transparent",

                        '&: hover': {
                            border: "2px solid " + theme.palette.primary.main,
                        }
                    }}
                >
                    <StyledLinkBox
                        href={"/project-player/layout/" + id}
                        sx={{
                            height: "100%",
                        }}
                    >
                        {CardComponent}
                    </StyledLinkBox>
                </CoreBg>
            }
            {
                deletePopup ?
                    <StyledActionPrompt
                        open={deletePopup}
                        setOpen={setDeletePopup}
                        title={t("deleteLayout")}
                        text={t("deleteLayoutConfirmation")}
                        actionFunction={DeleteFunction}
                        buttonText={generic("delete")}
                        cancelFunction={() => { setDeletePopup(false) }}
                    />
                    :
                    null
            }
        </>
    );
};

export default LayoutCard;