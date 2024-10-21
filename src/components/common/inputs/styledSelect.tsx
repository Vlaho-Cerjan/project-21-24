import { FormControl, Select, SelectChangeEvent, styled } from "@mui/material";
import React from "react";
import { ReactNode } from "react";
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { StyledLabel } from '../styledLabel/styledLabel';

export const StyledSelect = styled(Select)(({ theme }) => ({
    fontSize: "14px",
    lineHeight: "17px",
    padding: "8px 10px 8px 25px"
}))

interface StyledSelectProps {
    value: string;
    onChange: (event: SelectChangeEvent<any>, child: ReactNode) => void;
    children: any;
    label?: string;
}

export const SelectComponent = (
    { label, value, onChange, children }: StyledSelectProps
) => {
    const { accessibility: { isDark }, theme } = React.useContext(AccessibilityContext);

    return (
        <FormControl fullWidth sx={{ minWidth: "230px" }}>
            {label ?
            StyledLabel(label)
            : null}
            <Select
                id="selectType"
                value={value}
                onChange={onChange}
                sx={{
                    zIndex: theme.zIndex.drawer + 102,
                    textTransform: "capitalize",
                    '& fieldset': {
                        border: isDark ? "2px solid " + theme.palette.background.default : "2px solid rgba(0, 0, 32, 0.08)",
                    }
                }}
            >
                {children}
            </Select>
        </FormControl>
    )
}