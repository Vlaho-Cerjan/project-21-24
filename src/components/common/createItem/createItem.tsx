import { TextField } from "@mui/material";
import { Item } from "../../../interfaces/item";
import { useSnackbar } from "notistack";
import React from "react";
import StyledActionPrompt from "../actionComponents/actionPrompt";
import useTranslation from '../../../utility/useTranslation';
import { GenericText } from '../../../lang/common/genericText';
import { CreateLayoutStrings } from "./lang/createLayoutStrings";

interface CreateItemProps {
    createItem: (title: string) => void;
    open: boolean;
    setOpen: (open: boolean) => void;
    items: Item[];
    addButtonText: string;
    addTitleText: string;
}

const CreateItem = ({ createItem, open, setOpen, items, addTitleText, addButtonText}: CreateItemProps) => {
    const [newTitle, setNewTitle] = React.useState("");
    const genericText = useTranslation(GenericText).t;
    const { enqueueSnackbar } = useSnackbar();
    const { t } = useTranslation(CreateLayoutStrings);

    React.useEffect(() => {
        if(!open) {
            setNewTitle("");
        }

        return () => {
            setNewTitle("");
        }
    }, [open])

    const handleTitleSet = () => {
        const isItDuplicate = items.some(item => item.title === newTitle);
        if(isItDuplicate) {
            enqueueSnackbar('Duplicate title', { variant: 'error' });
            return;
        }else if(newTitle){
            createItem(newTitle);
        }else{
            enqueueSnackbar('Title is empty', { variant: 'warning' });
            return;
        }
        setOpen(false);
    }

    return(
        <StyledActionPrompt
            open={open}
            setOpen={setOpen}
            title={addTitleText}
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
            buttonText={t("createLayout")}
            actionFunction={handleTitleSet}
            cancelFunction={() => {
                setOpen(false)
                setNewTitle("");
            }}
        />
    )
}

export default CreateItem;