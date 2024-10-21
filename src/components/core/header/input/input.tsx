import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {
    Box,
    TextField,
    InputAdornment,
    CircularProgress,
    Button,
    styled,
    ButtonProps,
    debounce,
} from '@mui/material';
import Link from "../../../common/navigation/Link";
import { ExceptionStrings } from '../../../../lang/common/exceptions';
import { AccessibilityContext } from "../../../../store/providers/accessibilityProvider";
import useTranslation from '../../../../utility/useTranslation';
import { useSnackbar } from 'notistack';
import { useContext, useState, useRef, useEffect, useMemo } from 'react';
import { HeaderStrings } from '../headerStrings';
import useWindowSize from '../../../../utility/windowSize';
import { IconContainerGrey, IconContainerWhite } from '../../../common/iconContainer/iconContainer';
import { TextBold14 } from '../../../common/styledText/styledText';
import React from 'react';
import StyledSearchInput from '../../../common/inputs/searchInput';
import { CoreBg } from '../../coreBackground';

const InputBox = styled(Box)(({ theme }) => ({
    display: "flex",
    padding: "0 40px",

    [theme.breakpoints.down("lg")]: {
        padding: "0",
    }
}))

const StyledBox = styled(Box)`
    display: flex;
    align-items: center;
    margin-right: 10px;
`

interface HeaderProps {
    searchTitle?: string,
    buttonIcon?: JSX.Element,
    setSearchResult?: React.Dispatch<React.SetStateAction<string | null>>,
    buttonTitle?: string,
    buttonHref?: string,
    noSearch?: boolean,
    noButton?: boolean,
    searchLoading?: boolean,
}

const HeaderInput = ({ searchTitle, setSearchResult, searchLoading, buttonIcon, buttonTitle, buttonHref, noSearch, noButton }: HeaderProps) => {
    const { theme } = useContext(AccessibilityContext);

    const { width } = useWindowSize();

    const { t } = useTranslation(HeaderStrings);

    const searchRef = useRef<HTMLInputElement>(null);

    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        if (searchRef.current) setSearchValue(searchRef.current.value);
    }, [])

    const [isFocused, setFocused] = useState(false);

    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target instanceof HTMLInputElement && e.target.id === "searchHeaderInput") {
                return;
            } else {
                setFocused(false);
            }
        }

        if (typeof window !== "undefined") document.addEventListener("click", handleClick);

        return () => {
            if (typeof window !== "undefined") document.removeEventListener("click", handleClick);
        }
    }, [])

    return (
        <InputBox sx={{
            [theme.breakpoints.down("sm")]: {
                flexDirection: "column"
            }
        }}
        >
            {(typeof noSearch !== "undefined" && noSearch) ? null : (
                <Box sx={{ flexGrow: 1 }}>
                    <StyledSearchInput
                        searchValue={searchValue}
                        setSearchValue={setSearchValue}
                        setSearchResult={setSearchResult}
                        setFocused={setFocused}
                        isFocused={isFocused}
                        searchRef={searchRef}
                        searchLoading={searchLoading}
                        searchPlaceholder={t(searchTitle ? searchTitle : "search")}
                    />
                </Box>)
            }
            {(typeof noButton !== "undefined" && noButton) ? null : (
                <CoreBg
                    className='inactive'
                    sx={{
                        width: "auto",
                        pl: "40px",

                        [theme.breakpoints.down("md")]: {
                            pl: "0 20px",
                        },

                        [theme.breakpoints.down("sm")]: {
                            pl: "0",
                            mt: "8px",
                            display: "flex",
                            justifyContent: "right",
                        }
                    }}
                >
                    <Button fullWidth={width < theme.breakpoints.values.sm} variant={(width < theme.breakpoints.values.lg) ? "contained" : "text"} sx={{ minHeight: "44px", textTransform: "Capitalize", borderRadius: "22px", boxShadow: "none !important", '&:hover': { backgroundColor: theme.palette.action.hover } }} href={buttonHref} LinkComponent={Link}>
                        <StyledBox>
                            {(typeof buttonIcon === "undefined") ? null : (
                                (width < theme.breakpoints.values.lg) ?
                                    <IconContainerWhite sx={{ marginRight: "6px" }}>
                                        {buttonIcon}
                                    </IconContainerWhite>
                                    :
                                    <IconContainerGrey className="darker" sx={{ marginRight: "6px" }}>
                                        {buttonIcon}
                                    </IconContainerGrey>
                            )}
                            <TextBold14
                                containerSx={{
                                    lineHeight: "24px",
                                }}
                                textProps={{
                                    sx: {
                                        color: (width < theme.breakpoints.values.lg) ? theme.palette.primary.contrastText : theme.palette.text.secondary
                                    }
                                }}
                                text={(typeof buttonTitle === "undefined") ? "Add" : t(buttonTitle)}
                            />
                        </StyledBox>
                    </Button>
                </CoreBg>)
            }
        </InputBox>
    )
}

export default HeaderInput

interface SearchProps {
    searchLoading: boolean;
    searchPlaceholder?: string;
    abortController?: AbortController;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>,
    addVideosOpen: boolean;
}

export const SearchInput = ({ addVideosOpen, setSearchValue, searchPlaceholder, searchLoading, abortController }: SearchProps) => {
    const CloseInputButton = (props: ButtonProps) => (
        <Button
            onClick={() => {
                abortController?.abort();
                setSearchInputVal("");
                debouncedChangeHandler("");
            }
            }
            variant="text"
            disableRipple
            sx={{ p: 0, minWidth: "24px", minHeight: "24px", cursor: "default", backgroundColor: "transparent !important", boxShadow: "none !important" }}
            {...props}
        />
    )

    const { t } = useTranslation(HeaderStrings);

    const exceptionStrings = useTranslation(ExceptionStrings).t;

    const searchRef = useRef<HTMLInputElement>(null);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (searchRef.current) setSearchInputVal(searchRef.current.value);

        return () => {
            setSearchInputVal("");
            setSearchValue("");
        }
    }, [])

    const searchFunction = async (searchVal: string) => {
        if (typeof setSearchValue === "undefined") {
            enqueueSnackbar(exceptionStrings("error"), { variant: "error" })
            return;
        }
        setSearchValue(searchVal ? searchVal : "");
    }

    const debouncedChangeHandler = useMemo(
        () => debounce(searchFunction, 500)
        , []);


    const [isFocused, setFocused] = useState(false);

    const [searchInputVal, setSearchInputVal] = useState("");

    React.useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (e.target instanceof HTMLInputElement && e.target.id === "searchSearchInput") {
                return;
            } else {
                if (isFocused === true) setFocused(false);
            }
        }

        if (typeof window !== "undefined") document.addEventListener("click", handleClick);

        return () => {
            if (typeof window !== "undefined") document.removeEventListener("click", handleClick);
        }
    }, [])

    React.useEffect(() => {
        if (!addVideosOpen && searchInputVal !== "") {
            setSearchValue("");
            setSearchInputVal("");
        }
    }, [addVideosOpen])

    return (
        <Box>
            <TextField
                id="searchSearchInput"
                fullWidth
                value={searchInputVal}
                onChange={(e) => {
                    setSearchInputVal(e.target.value);
                    debouncedChangeHandler(e.target.value);
                }
                }
                onFocus={() => {
                    setFocused(true);
                }}
                inputRef={searchRef}
                inputProps={{
                    style: {
                        padding: "12px 0px 12px 25px",
                        fontWeight: 500,
                        fontSize: "1em",
                    }
                }}
                InputProps={{
                    sx: {
                        borderRadius: "22px",
                        backgroundColor: "background.paper",
                        fontSize: "14px",

                        '& fieldset': {
                            borderRadius: "22px",
                            borderWidth: "2px",
                            borderColor: "rgba(0,0,32,0.08)"
                        }
                    },
                    endAdornment:
                        <InputAdornment component={CloseInputButton} position="end">
                            <IconContainerGrey sx={{ fontSize: "24px" }} className={isFocused ? "isFocused" : undefined}>
                                <CircularProgress size={21} variant={searchLoading ? "indeterminate" : "determinate"} value={searchLoading ? undefined : 0} color="inherit" sx={{ opacity: searchLoading ? 1 : 0, visibility: searchLoading ? "visible" : "hidden" }} />
                                {searchInputVal ?
                                    <HighlightOffTwoToneIcon
                                        sx={{ cursor: "pointer", opacity: (searchInputVal === "") ? "0" : "1", visibility: (searchInputVal === "") ? "hidden" : "visible", transition: "opacity ease-in-out 0.5s, visibility ease-in-out 0.5s" }}
                                    />
                                    :
                                    <SearchRoundedIcon />
                                }
                            </IconContainerGrey>
                        </InputAdornment>
                }}
                placeholder={(typeof searchPlaceholder === "undefined") ? "Search" : t(searchPlaceholder)}
            />
        </Box>
    )
}