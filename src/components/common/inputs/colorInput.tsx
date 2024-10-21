import { MuiColorInput, MuiColorInputFormat, MuiColorInputValue } from "mui-color-input";
import React from "react";
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";

interface ColorInputProps {
    value: MuiColorInputValue,
    setValue: (value: MuiColorInputValue) => void,
    format: MuiColorInputFormat,
    label?: string,
}

const ColorInput = (
    {
        value,
        setValue,
        format,
        label
    }
        : ColorInputProps
) => {
    const { theme } = React.useContext(AccessibilityContext);

    const handleChange = (val: MuiColorInputValue) => {
        setValue(val);
    }

    return (
        <MuiColorInput
            size="small"
            label={label ? label : undefined}
            sx={{
                '& fieldset': {
                    border: "none"
                }
            }}
            InputProps={{
                sx: {
                    padding: 0,
                    display: "flex",
                    flexDirection: "row-reverse",
                    lineHeight: "21px",

                    '& .MuiButton-root': {
                        marginLeft: "8px",
                        width: "21px",
                        height: "21px"
                    }
                }
            }}
            inputProps={{
                style: {
                    padding: "11px 0 11px 0",
                    fontWeight: 700,
                    color: theme.palette.text.secondary,
                    textAlign: "right",
                    width: "76px",
                    lineHeight: "inherit",
                }
            }}
            value={value} onChange={(val) => handleChange(val)} format={format} />
    )
}

export default ColorInput;