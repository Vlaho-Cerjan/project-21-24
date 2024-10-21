import { Cancel } from '@mui/icons-material';
import {
    Box,
    TextField,
    InputAdornment,
    Button,
    styled,
    ButtonProps,
    InputLabelProps,
    InputProps,
    SxProps,
    Theme,
} from '@mui/material';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import React, { ReactElement } from 'react';

const StyledBox = styled(Box)`
    display: inline-flex;
    line-height: 24px;
    font-size: 1rem;
    width: 100%;
    border-radius: 12px;
`

interface InputComponentProps {
    inputLabel?: string,
    inputPlaceholder?: string,
    inputChangeFunction?: (value: string) => void,
    inputIcon?: ReactElement<any, any>,
    inputIconFunction?: (value: string) => void,
    required?: boolean,
    inputVal?: string | null,
    clearInput?: boolean,
    disabled?: boolean,
    error?: boolean,
    id?: string,
    name?: string,
    type?: string,
    autoComplete?: string,
    helperText?: any,
    InputProps?: Partial<InputProps>,
    InputLabelProps?: Partial<InputLabelProps>,
    rows?: number,
    multiline?: boolean,
    maxRows?: number,
    minRows?: number,
    inputStyle?: React.CSSProperties,
    InputStyle?: SxProps<Theme>,
}

const StyledInput = ({ InputStyle, inputStyle, rows, multiline, maxRows, minRows, helperText, error, id, name, type, autoComplete, inputLabel, inputPlaceholder, inputChangeFunction, inputIcon, inputIconFunction, required, inputVal, clearInput, disabled }: InputComponentProps) => {
    const IconFunction = (props: ButtonProps) => (
        <Button
            onClick={() => {
                if (typeof inputIconFunction !== "undefined" && typeof inputRef !== "undefined" && inputRef.current) inputIconFunction(inputRef.current.value);
            }
            }
            variant="text"
            disableRipple
            sx={{ p: 0, minWidth: "24px", minHeight: "24px", cursor: "default", backgroundColor: "transparent !important" }}
            {...props}
        />
    )

    const inputRef = React.useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = React.useState<string>("");
    const { accessibility: { isDark }, theme } = React.useContext(AccessibilityContext);

    React.useEffect((): void => {
        if (inputVal) {
            setInputValue(inputVal);
        }
    }, [inputVal])

    React.useEffect(() => {
        if (clearInput) {
            setInputValue("");
            //if (typeof inputRef.current !== "undefined" && inputRef.current) inputRef.current.value = "";
        }
    }, [clearInput])

    React.useEffect(() => {
        if (inputRef.current && inputRef.current.value && inputRef.current.value !== inputValue) setInputValue(inputRef.current.value);
    }, [])

    return (
        <StyledBox>
            <TextField
                error={error}
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                disabled={disabled}
                required={required}
                fullWidth
                helperText={helperText}
                rows={rows ? rows : undefined}
                maxRows={maxRows ? maxRows : undefined}
                minRows={minRows ? minRows : undefined}
                multiline={multiline ? multiline : undefined}
                FormHelperTextProps={{
                    sx: {
                        fontSize: "10px",
                        fontWeight: 900,
                    }
                }}
                label={inputLabel}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    //if(typeof inputIconFunction !== "undefined") inputIconFunction(e.target.value);
                    if (typeof inputChangeFunction !== "undefined") inputChangeFunction(e.target.value);
                }
                }
                inputRef={inputRef}
                inputProps={
                    inputStyle ?
                        {
                            style: {
                                fontSize: "1em",
                                fontWeight: 500,
                                ...inputStyle
                            }
                        }
                        :
                        {
                            style: {
                                fontSize: "1em",
                                fontWeight: 500,
                            }
                        }
                }
                InputProps={{
                    sx:
                        InputStyle ? {
                            fontSize: "14px",
                            borderRadius: "12px",
                            backgroundColor: disabled ? "action.disabledBackground" : "background.paper",

                            'input::placeholder': {
                                color: theme.palette.text.secondary
                            },

                            '& fieldset': {
                                borderRadius: "12px",
                                borderColor: isDark ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 32, 0.08)",
                                borderWidth: "2px",

                                '& legend': {
                                    width: inputLabel ? "auto" : "0px",
                                }
                            },
                            ...InputStyle
                        }
                            : {
                                fontSize: "14px",
                                borderRadius: "12px",
                                backgroundColor: disabled ? "action.disabledBackground" : "background.paper",

                                'input::placeholder': {
                                    color: theme.palette.text.secondary
                                },

                                '& fieldset': {
                                    borderRadius: "12px",
                                    borderColor: isDark ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 32, 0.08)",
                                    borderWidth: "2px",

                                    '& legend': {
                                        width: inputLabel ? "auto" : "0px",
                                    }
                                },
                            }
                    ,
                    endAdornment: (typeof inputIcon === "undefined") ? null :
                        <InputAdornment onClick={() => { inputValue && inputValue !== "" ? setInputValue("") : undefined }} sx={{ boxShadow: "none !important", fontSize: "21px", '& svg': { cursor: (typeof inputIconFunction !== "undefined" || inputValue !== "") ? "pointer" : null, fontSize: "1em", lineHeight: "inherit" } }} component={IconFunction} position="end">
                            {inputValue === "" ? inputIcon : <Cancel />}
                        </InputAdornment>
                }}
                placeholder={inputPlaceholder === "" ? "Search..." : inputPlaceholder}
                aria-placeholder={inputPlaceholder === "" ? "Search..." : inputPlaceholder}
            />
        </StyledBox>
    )
}

export default StyledInput;