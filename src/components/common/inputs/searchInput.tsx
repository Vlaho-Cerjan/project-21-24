import { TextField, InputAdornment, CircularProgress, debounce, ButtonProps, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { IconContainerGrey } from "../iconContainer/iconContainer";
import useTranslation from '../../../utility/useTranslation';
import { ExceptionStrings } from '../../../lang/common/exceptions';
import { useMemo } from "react";
import { HighlightOffTwoTone, SearchRounded } from "@mui/icons-material";
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import React from "react";
import { CoreBg } from "../../core/coreBackground";

interface SearchInputProps {
    searchPlaceholder?: string,
    searchValue?: string,
    setSearchValue?: React.Dispatch<React.SetStateAction<string>>,
    isFocused?: boolean,
    setFocused?: React.Dispatch<React.SetStateAction<boolean>>,
    setSearchResult?: React.Dispatch<React.SetStateAction<string | null>>,
    searchRef?: React.RefObject<HTMLInputElement>,
    searchLoading?: boolean,
    abortController?: AbortController;
    addVideosOpen?: boolean,
}

const SearchInput = ({ addVideosOpen, abortController, searchValue, setSearchResult, setSearchValue, setFocused, searchRef, isFocused, searchLoading, searchPlaceholder }: SearchInputProps) => {
    const { enqueueSnackbar } = useSnackbar();
    const { accessibility: { isDark } } = React.useContext(AccessibilityContext);
    const exceptionStrings = useTranslation(ExceptionStrings).t;
    const searchFunction = async (searchVal: string) => {
        if (typeof setSearchResult === "undefined") {
            enqueueSnackbar(exceptionStrings("error"), { variant: "error" })
            return;
        }
        setSearchResult(searchVal ? searchVal : null);
    }

    const [searchValueState, setSearchValueState] = React.useState(searchValue);

    const CloseInputButton = (props: ButtonProps) => (
        <Button
            onClick={() => {
                abortController?.abort();
                if(setSearchValue) setSearchValue("");
                setSearchValueState("");
                debouncedChangeHandler("");
            }
            }
            variant="text"
            disableRipple
            sx={{ p: 0, minWidth: "24px", minHeight: "24px", cursor: "default", backgroundColor: "transparent !important", boxShadow: "none !important" }}
            {...props}
        />
    )

    const debouncedChangeHandler = useMemo(
        () => debounce(searchFunction, 500)
        , []
    );


    React.useEffect(() => {
        if (!addVideosOpen && searchValueState !== "") {
            if(setSearchValue) setSearchValue("");
            setSearchValueState("");
        }
    }, [addVideosOpen])

    return (
        <CoreBg>
            <TextField
                id="searchHeaderInput"
                fullWidth
                value={searchValue}
                onChange={(e) => {
                    if(setSearchValue) setSearchValue(e.target.value);
                    setSearchValueState(e.target.value);
                    debouncedChangeHandler(e.target.value);
                }
                }
                onFocus={() => {
                    if (setFocused) setFocused(true);
                }}
                inputRef={searchRef ? searchRef : undefined}
                inputProps={{
                    style: {
                        padding: "12px 0px",
                        fontWeight: 500,
                        fontSize: "1em",
                    }
                }}
                InputProps={{
                    sx: {
                        border: "none",
                        borderRadius: "22px",
                        backgroundColor: "background.paper",
                        fontSize: "14px",

                        '& fieldset': {
                            border: "2px solid transparent",
                            borderRadius: "22px",
                            borderWidth: "2px",
                        },

                        '&:hover fieldset, &.Mui-focused fieldset': {
                            border: "2px solid " + (isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 32, 0.08)") + " !important",
                        }
                    },
                    startAdornment:
                        <InputAdornment position="start">
                            <IconContainerGrey sx={{ fontSize: "24px" }} className={isFocused ? "isFocused" : undefined}>
                                <SearchRounded />
                            </IconContainerGrey>
                        </InputAdornment>,
                    endAdornment:
                        <InputAdornment component={CloseInputButton} position="end">
                            <IconContainerGrey sx={{ fontSize: "24px" }} className={typeof searchValueState === "undefined" || !searchValueState || searchValueState === "" ? "light" : "isFocused"}>
                                <CircularProgress size={21} variant={searchLoading ? "indeterminate" : "determinate"} value={searchLoading ? undefined : 0} color="inherit" sx={{ opacity: searchLoading ? 1 : 0, visibility: searchLoading ? "visible" : "hidden" }} />
                                <HighlightOffTwoTone
                                    sx={{ cursor: (searchValueState || searchValueState !== "") ? "pointer" : "initial", transition: "opacity ease-in-out 0.5s, visibility ease-in-out 0.5s" }}
                                />
                            </IconContainerGrey>
                        </InputAdornment>
                }}
                placeholder={(typeof searchPlaceholder === "undefined") ? "Search" : searchPlaceholder}
            />
        </CoreBg>
    )
}

export default SearchInput;