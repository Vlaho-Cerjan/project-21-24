import { TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import useTranslation from '../../../../utility/useTranslation';
import { EditTitleStrings } from './lang/editTitleStrings';
import { GenericText } from '../../../../lang/common/genericText';
import StyledActionPrompt from '../../../common/actionComponents/actionPrompt';

interface EditTitleProps {
    id: string | null;
    setId: React.Dispatch<React.SetStateAction<string | undefined>>;
    open: boolean;
    title: string;
    setTitle: (id: string, title: string) => void;
    setOpen: (open: boolean) => void;
    items: {
        id: string,
        title: string,
        live: boolean,
        created_at: string,
        updated_at: string,
    }[];
}

const EditTitle = ({ id, setId, title, setTitle, open, setOpen, items }: EditTitleProps) => {
    const [newTitle, setNewTitle] = React.useState(title);
    const { t } = useTranslation(EditTitleStrings);
    const genericText = useTranslation(GenericText).t;

    useEffect(() => {
        if (open) setNewTitle(title);

        return () => {
            setNewTitle("");
        }
    }, [title, open])

    const { enqueueSnackbar } = useSnackbar();

    const handleTitleSet = () => {
        const isItDuplicate = items.some(item => item.title === newTitle);
        if (isItDuplicate) {
            enqueueSnackbar(t("duplicateTitle"), { variant: 'error' });
            return;
        }

        if (newTitle && id) {
            setTitle(id, newTitle);
            setNewTitle("");
        } else if (newTitle === title && id) {
            enqueueSnackbar(t("sameTitle"), { variant: 'warning' });
            setNewTitle("");
        } else {
            enqueueSnackbar(t("emptyTitle"), { variant: 'warning' });
        }
        setOpen(false);
    }

    return (
        <StyledActionPrompt
            open={open}
            setOpen={setOpen}
            title={t("editLayoutTitle")}
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
            buttonText={t("saveLayoutTitle")}
            actionFunction={handleTitleSet}
            cancelFunction={() => {
                setOpen(false)
                setNewTitle("");
                setId(undefined);
            }}
        />
    )
}

export default EditTitle;