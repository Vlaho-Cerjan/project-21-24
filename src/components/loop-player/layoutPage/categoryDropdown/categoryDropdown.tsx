import { useAppSelector } from "@/hooks";
import { GenericText } from "@/lang/common/genericText";
import { AccessibilityContext } from "@/store/providers/accessibilityProvider";
import useTranslation from "@/utility/useTranslation";
import {
    Box,
    FormControl,
    MenuItem,
    Select,
    SelectChangeEvent,
    Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const CategoryDropdownContainer = styled(Box)(() => ({
  marginRight: "10px",
}));

const CategoryDropdown = ({
  disabled,
  defaultCat,
  handleChange,
  itemLockedFunction,
}: {
  disabled: boolean;
  defaultCat: string | null;
  handleChange: (event: SelectChangeEvent<string | null>) => void;
  itemLockedFunction: () => Promise<"locked" | "unlocked">;
}) => {
  const { enumProject } = useAppSelector(state => state.enum);
  const { theme } = React.useContext(AccessibilityContext);
  const genericTranslation = useTranslation(GenericText).t;
  const [category, setCategory] = React.useState<string | null>(defaultCat);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <CategoryDropdownContainer>
      <FormControl fullWidth>
        <Tooltip
          disableFocusListener={disabled}
          disableHoverListener={disabled}
          disableInteractive={disabled}
          disableTouchListener={disabled}
          title={genericTranslation("category")}
          placement="top-start"
          PopperProps={{
            modifiers:[
              {
                name: 'offset',
                options: {
                  offset: [0, -8],
                },
              }
            ]
          }}
        >
          <Select
            disabled={disabled}
            id="category-dropdown-select"
            value={category || '-1'}
            label="Category"
            onOpen={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const res = await itemLockedFunction();
              if(res === "locked") {
                handleClose();
              }
              handleOpen();
            }}
            open={open}
            onChange={(e) => {
              setCategory(e.target.value);
              handleChange(e);
            }}
            onClose={handleClose}
            SelectDisplayProps={{
              style: {
                paddingTop: 0,
                paddingBottom: 0,
                height: "32px",
                display: "flex",
                alignItems: "center",
                borderRadius: "4px",
                textTransform: "capitalize",
                backgroundColor: theme.palette.background.paper,
              },
            }}
            sx={{
              "& fieldset": {
                border: "none",
                borderRadius: "4px",
                boxShadow: "0 2px 4px 0 rgba(0,0,32,0.12) !important",
              },
            }}
          >
            {!defaultCat && (
            <MenuItem sx={{ textTransform: 'capitalize' }} value={'-1'}>
              {genericTranslation("default")}
            </MenuItem>
            )}
            {enumProject && Object.entries(enumProject.layout_category).map((cat) => (
              <MenuItem sx={{ textTransform: 'capitalize' }} key={cat[0]} value={cat[1]}>
                {genericTranslation(cat[1].toLowerCase())}
              </MenuItem>
            ))}
          </Select>
        </Tooltip>
      </FormControl>
    </CategoryDropdownContainer>
  );
};

export default CategoryDropdown;
