import { useAppSelector } from "@/hooks";
import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { RowItem } from "../../../../../interfaces/projectPlayer/rowItem";
import { GenericText } from "../../../../../lang/common/genericText";
import useTranslation from "../../../../../utility/useTranslation";
import StyledActionPrompt from "../../../../common/actionComponents/actionPrompt";
import { AddRowStrings } from "./lang/addRowStrings";

interface AddRowProps {
  addRow: (title: string | undefined, type: string | null ) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  items:
    | {
        id: string;
        title?: string;
        type: string;
        items: RowItem[];
      }[]
    | null;
}

const AddRow = ({ addRow, open, setOpen, items }: AddRowProps) => {
  const [newTitle, setNewTitle] = React.useState<string>();
  const [category, setCategory] = React.useState<string | null>(null);
  const { t } = useTranslation(AddRowStrings);
  const genericText = useTranslation(GenericText).t;
  const { enqueueSnackbar } = useSnackbar();
  const { enumProject } = useAppSelector((state) => state.enum);

  const handleTitleSet = () => {
    const isItDuplicate = items
      ? items.some((item) => item.title === newTitle)
      : false;
    if (isItDuplicate) {
      enqueueSnackbar("Duplicate title", { variant: "error" });
      return;
    }
    addRow(newTitle, category);
    setNewTitle("");
    setCategory(null);
    setOpen(false);
  };

  return (
    <StyledActionPrompt
      open={open}
      setOpen={setOpen}
      title={t("setRowTitle")}
      text={
        <Box>
          <FormControl fullWidth>
            <TextField
              required
              fullWidth
              aria-required={true}
              label={genericText("yourTitle")}
              InputLabelProps={{
                sx: {
                  left: "unset !important",
                  fontWeight: 900,
                },
              }}
              InputProps={{
                sx: {
                  fontSize: "14px",
                  lineHeight: "20px",
                },
              }}
              inputProps={{
                style: {
                  fontSize: "1em",
                  lineHeight: "inherit",
                  fontWeight: 500,
                },
              }}
              value={newTitle ? newTitle : ""}
              onChange={(e) => {
                setNewTitle(e.target.value);
              }}
            />
          </FormControl>
          <Box sx={{ height: "24px" }} />
          <FormControl fullWidth>
            <InputLabel sx={{ fontWeight: 900 }} id="add-row-dropdown-select-label">
                {genericText("category")}
            </InputLabel>
            <Select
                labelId="add-row-dropdown-select-label"
              id="add-row-dropdown-select"
              value={category || "-1"}
              label={genericText("category")}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
              SelectDisplayProps={{
                style: {
                textAlign: "left",
                  textTransform: "capitalize",
                },
              }}
            >
              <MenuItem sx={{ textTransform: "capitalize" }} value={"-1"}>
                {genericText("default")}
              </MenuItem>
              {enumProject &&
                Object.entries(enumProject.layout_category).map((cat) => (
                  <MenuItem
                    sx={{ textTransform: "capitalize" }}
                    key={cat[0]}
                    value={cat[1]}
                  >
                    {genericText(cat[1].toLowerCase())}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Box>
      }
      buttonText={t("addRow")}
      actionFunction={handleTitleSet}
      cancelFunction={() => {
        setOpen(false);
        setNewTitle("");
      }}
    />
  );
};

export default AddRow;
