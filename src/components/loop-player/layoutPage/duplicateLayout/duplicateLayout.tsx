import { TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';
import useTranslation from '../../../../utility/useTranslation';
import { DuplicateLayoutStrings } from './lang/duplicateLayoutStrings';
import { GenericText } from '../../../../lang/common/genericText';
import StyledActionPrompt from '../../../common/actionComponents/actionPrompt';

interface DuplicateLayoutProps {
    id: string | null;
    setId: React.Dispatch<React.SetStateAction<string | undefined>>;
    open: boolean;
    title: string;
    duplicateFunction: (id: string, title?: string) => void;
    setOpen: (open: boolean) => void;
    items: {
        id: string,
        title: string,
        live: boolean,
        created_at: string,
        updated_at: string,
    }[];
}

const DuplicateLayout = ({ id, setId, title, duplicateFunction, open, setOpen, items}: DuplicateLayoutProps) => {
    const [newTitle, setNewTitle] = React.useState(title);
    const { t } = useTranslation(DuplicateLayoutStrings);
    const genericText = useTranslation(GenericText).t;

    useEffect(() => {
        if(open) setNewTitle(title);
    }, [title, open])

    const { enqueueSnackbar } = useSnackbar();

    const handleTitleSet = () => {
        const isItDuplicate = items.some(item => item.title === newTitle && item.id !== id);
        if(isItDuplicate) {
            enqueueSnackbar(t("duplicateTitle"), { variant: 'error' });
            return;
        }
        else if(id) {
            duplicateFunction(id, newTitle);
            setNewTitle("");
        }
        setOpen(false);
    }

    return(
        <StyledActionPrompt
            open={open}
            setOpen={setOpen}
            title={t("duplicateLayout")}
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
            buttonText={t("duplicateLayout")}
            actionFunction={handleTitleSet}
            cancelFunction={() => {
                setOpen(false)
                setNewTitle("");
                setId(undefined);
            }}
        />
    )
}

export default DuplicateLayout;