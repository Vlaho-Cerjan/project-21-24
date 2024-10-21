import { Box, Button, styled, TextField, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import React, { useEffect } from 'react';
import { RowItem } from '../../../../../interfaces/projectPlayer/rowItem';
import { GenericText } from '../../../../../lang/common/genericText';
import useTranslation from '../../../../../utility/useTranslation';
import StyledActionPrompt from '../../../../common/actionComponents/actionPrompt';
import { EditRowStrings } from './lang/editRowStrings';

interface EditRowProps {
    id: string | null;
    setTitle: (id: string, title: string) => void;
    title: string | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    items: {
        id: string;
        title?: string;
        items: RowItem[];
        locked: string | null;
    }[] | null;
}

const EditRowContainer = styled(Box)(({ theme }) => ({
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
    fontSize: "20px",
}))

const StyledTitle = styled(Typography)(() => ({
    padding: "40px 15px",
    fontSize: "1em",
    fontWeight: "700",
    lineHeight: "20px"
}))

const StyledButton = styled(Button)`
    font-size: 1em;
    border-radius: 0 0 12px 12px;
    font-weight: 900;
    padding: 23px 0;
`

const EditRow = ({ id, title, setTitle, open, setOpen, items}: EditRowProps) => {
    const [newTitle, setNewTitle] = React.useState(title);
    const { t } = useTranslation(EditRowStrings);
    const genericText = useTranslation(GenericText).t;
    useEffect(() => {
        setNewTitle(title);

        return () => {
            setNewTitle("");
        }
    }, [title])

    const { enqueueSnackbar } = useSnackbar();

    const handleTitleSet = () => {
        const isItDuplicate = items ? items.some(item => item.title === newTitle) : false;
        if(isItDuplicate) {
            enqueueSnackbar('Duplicate title', { variant: 'error' });
            return;
        }

        if(newTitle && id) {
            setTitle(id, newTitle);
            setNewTitle(null);
        }else if(newTitle === title && id){
            enqueueSnackbar('Title is the same', { variant: 'warning' });
            setNewTitle(null);
        }else{
            enqueueSnackbar('Title is empty', { variant: 'warning' });
        }
        setOpen(false);
    }

    return(
        <StyledActionPrompt
            open={open}
            setOpen={setOpen}
            title={t("setRowTitle")}
            text={
                <TextField
                    required
                    fullWidth
                    aria-required={true}
                    label={genericText("yourTitle")}
                    InputLabelProps={{
                        sx: {
                            left: "unset !important",
                            fontWeight: 900
                        }
                    }}
                    InputProps={{
                        sx: {
                            fontSize: "14px",
                            lineHeight: "20px"
                        }
                    }}
                    inputProps={{
                        style: {
                            fontSize: "1em",
                            lineHeight: "inherit",
                            fontWeight: 500
                        }
                    }}
                    value={(newTitle) ? newTitle : ""}
                    onChange={(e) => {
                        setNewTitle(e.target.value);
                    }}
                />
            }
            buttonText={t("saveRow")}
            actionFunction={handleTitleSet}
            cancelFunction={() => {
                setOpen(false)
                setNewTitle("");
            }}
        />
    )
}

export default EditRow;