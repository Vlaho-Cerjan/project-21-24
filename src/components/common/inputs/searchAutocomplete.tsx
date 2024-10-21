import { Cancel, ClearRounded, SearchRounded } from "@mui/icons-material";
import { Box, Autocomplete, AutocompleteRenderInputParams, TextField, InputAdornment, styled, CircularProgress, Popper } from '@mui/material';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { debounce } from "lodash";
import React, { useMemo } from "react";
import { StyledButton } from "../buttons/styledButton";
import { StyledChip } from "../chip/styledChip";
import { IconContainerGrey } from "../iconContainer/iconContainer";
import { SidebarTitle } from "../sidebarComponents/sidebarTitle";

interface SearchAutoCompleteProps {
    currentItems: any[],
    setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>;
    selectedItems: any[] | null;
    setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
    fetchItems: (searchVal: string, selItems: any[] | null, setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, signal?: AbortSignal) => void;
    title: string;
    searchPlaceholder: string;
    setOffset?: React.Dispatch<React.SetStateAction<number>>;
    singleSelect?: boolean;
}

const CurrentItemsBox = styled(Box)`
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    fontSize: 10px;
`

const SearchAutoComplete = ({ fetchItems, currentItems, setCurrentItems, selectedItems, setSelectedItems, title, searchPlaceholder, setOffset, singleSelect }: SearchAutoCompleteProps) => {
    const handleArtistDelete = (id: string) => {
        if (!selectedItems) return;
        if (typeof setOffset !== "undefined") setOffset(0);
        setSelectedItems(selectedItems.filter(items => items.id !== id));
        debouncedChangeHandler("", null, setCurrentItems, setLoading);
    }

    const [loading, setLoading] = React.useState(false);

    const { accessibility: { isDark }, theme } = React.useContext(AccessibilityContext);

    const debouncedChangeHandler = useMemo(
        () => debounce(fetchItems, 500)
        , []);

    const [value, setValue] = React.useState<typeof currentItems[number] | null>(null);
    const [inputValue, setInputValue] = React.useState('');

    return (
        <Box sx={{
            borderRadius: "16px",
            padding: "15px",
            backgroundColor: theme.palette.background.paper
        }}>
            <Box sx={{ fontSize: "12px" }}>
                <SidebarTitle>{title}</SidebarTitle>
            </Box>
            <Autocomplete
                id="searchItemsAutocomplete"
                onChange={(event, newValue) => {
                    event.preventDefault();
                    if (typeof setOffset !== "undefined") setOffset(0);
                    if (singleSelect) {
                        setSelectedItems([newValue]);
                        debouncedChangeHandler("", [newValue], setCurrentItems, setLoading);
                        setInputValue("");
                        setValue(null);
                        return;
                    }
                    setSelectedItems((prevState) => {
                        if (typeof newValue !== "string" && newValue && prevState?.find((artist) => artist.id === newValue.id)) {
                            return prevState;
                        }
                        if (newValue && typeof newValue !== "string" && typeof prevState !== "undefined") {
                            if (prevState) return [...prevState, newValue];
                            else return [newValue];
                        }
                        return prevState;
                    })
                    debouncedChangeHandler("", (selectedItems) ? [...selectedItems, newValue] : [newValue], setCurrentItems, setLoading);
                    setInputValue("");
                    setValue(null);
                }}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                    debouncedChangeHandler(newInputValue, selectedItems, setCurrentItems, setLoading);
                }}
                PopperComponent={(props) => {
                    return (
                        <Popper
                            onResize={undefined} onResizeCapture={undefined} {...props}
                            sx={{
                                boxShadow: "0 4px 16px 0 rgba(0,0,32,0.24)",
                                borderRadius: "16px",

                                '& div, & li': {
                                    color: theme.palette.text.secondary
                                }
                            }}
                        />
                    )
                }}
                filterOptions={(x) => x}
                clearOnBlur={false}
                loading={loading}
                value={value}
                options={currentItems.sort((a, b) => -b.name.toLowerCase().localeCompare(a.name.toLowerCase()))}
                renderInput={(params: AutocompleteRenderInputParams) => (
                    <TextField
                        {...params}
                        fullWidth
                        inputProps={{
                            ...params.inputProps,
                            style: {
                                fontWeight: "500 !important",
                                width: "100%",
                                padding: "10.5px 0px 10.5px 25px",
                            }
                        }}
                        InputProps={{
                            ...params.InputProps,
                            type: 'search',
                            sx: {
                                flexWrap: "nowrap !important",
                                padding: "0 15px 0 0 !important",
                                borderRadius: "16px",

                                '& fieldset': {
                                    borderRadius: "12px",
                                    borderColor: isDark ? "rgba(255, 255, 255, 0.23)" : "rgba(0, 0, 32, 0.08)",
                                    borderWidth: "2px",

                                    '& legend': {
                                        width: "0px",
                                    }
                                },
                            },
                            endAdornment:
                                (inputValue !== "") ?
                                    <InputAdornment position="end">
                                        {loading ?
                                            <IconContainerGrey sx={{ fontSize: "24px" }}>
                                                <CircularProgress size={16} />
                                            </IconContainerGrey>
                                            : null}
                                        <StyledButton sx={{ p: 0, boxShadow: "none !important" }} onClick={() => {
                                            setInputValue("")
                                            debouncedChangeHandler("", null, setCurrentItems, setLoading);
                                        }
                                        }>
                                            <IconContainerGrey sx={{ fontSize: "24px" }}>
                                                <ClearRounded />
                                            </IconContainerGrey>
                                        </StyledButton>
                                    </InputAdornment>
                                    :
                                    <InputAdornment position="end">
                                        <IconContainerGrey sx={{ fontSize: "24px" }}>
                                            <SearchRounded />
                                        </IconContainerGrey>
                                    </InputAdornment>
                        }}
                        placeholder={searchPlaceholder}
                    />
                )}
            />
            {(selectedItems && selectedItems.length > 0)
                ?
                <CurrentItemsBox>
                    {
                        selectedItems.map(artist => {
                            return (
                                <StyledChip deleteIcon={<Cancel sx={{ fontSize: "19px !important", backgroundColor: theme.palette.primary.contrastText, borderRadius: "50%" }} />} key={artist.id} id={artist.id} label={artist.name} onDelete={() => handleArtistDelete(artist.id)} />
                            )
                        })
                    }
                </CurrentItemsBox>
                :
                null
            }
        </Box>
    )
}

export default SearchAutoComplete;