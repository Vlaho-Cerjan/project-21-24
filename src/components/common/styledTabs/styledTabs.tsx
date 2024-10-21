import { TabContext, TabPanel } from "@mui/lab";
import { Box, TextField, TextFieldProps } from '@mui/material';
import { StyledTabListContainer, StyledTabList, StyledTabListItem } from "../../content/styledComponents/actionStyledComponents";
import React from "react";

interface StyledTabsProps {
    tabs: string[];
    ariaLabel: string;
    items:
    {
        [key: string]: string | null
    };
    setItems: React.Dispatch<React.SetStateAction<{
        [key: string]: string | null
    }>>;
    textfieldProps?: TextFieldProps;
    textPlaceholder: string;
    tabPanelProps?: any;
}

export const StyledTabs = ({ tabs, ariaLabel, items, setItems, textPlaceholder, textfieldProps, tabPanelProps }: StyledTabsProps) => {
    const [tabValue, setTabValue] = React.useState(tabs[0]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    return (
        <Box sx={{ position: "relative" }}>
            <TabContext value={tabValue}>
                <StyledTabListContainer>
                    <StyledTabList
                        onChange={handleChange}
                        aria-label={ariaLabel}
                    >
                        {tabs.map((tempItem, index) => {
                            return (
                                <StyledTabListItem sx={{ fontSize: "1em", fontWeight: 900 }} key={tempItem + "_" + index} label={tempItem.toUpperCase()} value={tempItem.toLowerCase()} />
                            )
                        })}
                    </StyledTabList>
                </StyledTabListContainer>
                {tabs.map((tempItem, index) => {
                    return (
                    <TabPanel
                        key={"tabPanel_" + tempItem + "_" + index}
                        value={tempItem.toLowerCase()}
                        {...tabPanelProps}
                    >
                        <TextField
                            fullWidth
                            id={tempItem.toLowerCase()+"_"+index+"_"+ariaLabel}
                            value={items[tempItem]}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                setItems({ ...items, [tempItem]: event.target.value });
                            }}
                            {...textfieldProps}
                            inputProps={{
                                style: {
                                    padding: 0,
                                    fontSize: "1em",
                                    lineHeight: "inherit",
                                    ...textfieldProps?.inputProps?.style
                                }
                            }}
                            InputProps={{
                                sx: {
                                    padding: 0,
                                    ...textfieldProps?.InputProps?.sx
                                }
                            }}
                            sx={{
                                '& fieldset': {
                                    border: "none",
                                },

                                ...textfieldProps?.sx
                            }}
                            placeholder={textPlaceholder}
                        />
                    </TabPanel>)
                })}
            </TabContext>
        </Box>
    )
}