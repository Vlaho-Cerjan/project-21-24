import { Box, Typography, Backdrop, TextField, Button, styled } from '@mui/material';
import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import useTranslation from '../../../../utility/useTranslation';
import { GenericText } from '../../../../lang/common/genericText';
import { TitleActionLayoutStrings } from '../lang/titleActionLayoutStrings';

interface TitleActionLayoutProps {
    id: string | null;
    open: boolean;
    title: string;
    buttonText: string,
    actionFunction: (id: string, title?: string) => void;
    setOpen: (open: boolean) => void;
    items: {
        id: string,
        title: string,
        live: boolean,
        created_at: string,
        updated_at: string,
    }[];
    type: "edit" | "duplicate" | "add";
}

const TitleActionLayoutContainer = styled(Box)(({ theme }) => ({
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.drawer,
    justifyContent: "center",
    alignItems: "center",
}))

const StyledBox = styled(Box)(({ theme }) => ({
    width: "100%",
    maxWidth: "320px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "12px",
    zIndex: theme.zIndex.drawer+1,
    textAlign: "center",
    fontSize: "18px",
}))

const StyledTitle = styled(Typography)(() => ({
    padding: "40px 15px",
    fontSize: "1em",
    lineHeight: "20px",
    fontWeight: "bold",
}))

const StyledButton = styled(Button)`
    font-size: 1em;
    font-weight: 900;
    border-radius: 0 0 12px 12px;
    padding: 23px 0;
`

const TitleActionLayout = ({ id, title, buttonText, actionFunction, open, setOpen, items, type}: TitleActionLayoutProps) => {
    const [newTitle, setNewTitle] = React.useState(title);
    const { t } = useTranslation(TitleActionLayoutStrings);
    const genericText = useTranslation(GenericText).t;

    useEffect(() => {
        setNewTitle(title);

        return () => {
            setNewTitle("");
        }
    }, [title])

    const { enqueueSnackbar } = useSnackbar();

    const handleTitleSet = () => {
        const isItDuplicate = items.some(item => item.title === newTitle && item.id !== id);
        if(isItDuplicate) {
            enqueueSnackbar(t("duplicateTitle"), { variant: 'error' });
            return;
        }
        else if(id) {
            actionFunction(id, newTitle);
            setNewTitle("");
        }
        setOpen(false);
    }

    return(
        <TitleActionLayoutContainer sx={{
            display: open ? "flex" : "none",
        }}>
            <StyledBox>
                <StyledTitle>{title}</StyledTitle>
                <TextField
                    fullWidth
                    label={genericText("yourTitle")}
                    InputLabelProps={{
                        sx: {
                            left: "unset !important",
                            fontWeight: 500
                        }
                    }}
                    InputProps={{
                        sx: {
                            fontSize: "14px"
                        }
                    }}
                    inputProps={{
                        style: {
                            fontSize: "1em",
                            fontWeight: 500
                        }
                    }}
                    sx={{ padding: "0 15px 40px" }}
                    value={(newTitle)?newTitle:""}
                    onChange={(e) => {
                        setNewTitle(e.target.value);
                    }}
                />
                <StyledButton onClick={handleTitleSet} variant='contained' fullWidth>
                    {buttonText}
                </StyledButton>
            </StyledBox>
            <Backdrop
                open={open}
                onClick={() => {
                    setOpen(false);
                    setNewTitle("");
                }}
            />
        </TitleActionLayoutContainer>
    )
}

export default TitleActionLayout;