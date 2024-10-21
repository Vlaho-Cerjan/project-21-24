import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { Accordion, AccordionSummary, Box, AccordionDetails, List, ListItem, ListItemButton, ListItemIcon, Checkbox, ListItemText } from "@mui/material";
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import React from "react";
import { IconContainerGrey } from "../iconContainer/iconContainer";
import { SidebarTitle } from "./sidebarTitle";

interface SidebarListProps {
    title: string;
    items: {
        id: string;
        title: string;
    }[];
    /** Not needed if there is only three items */
    lessItemsText?: string;
    /** Not needed if there is only three items */
    moreItemsText?: string;
    checkedItems?: string[];
    setCheckedItems?: React.Dispatch<React.SetStateAction<string[]>>;
    checkedItem?: string | null;
    setCheckedItem?: React.Dispatch<React.SetStateAction<string | null>>;
    defaultExpanded?: boolean;
}

const SidebarList = ({ title, items, lessItemsText, moreItemsText, checkedItems, setCheckedItems, checkedItem, setCheckedItem, defaultExpanded}: SidebarListProps) => {
    const { theme } = React.useContext(AccessibilityContext);
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [listHeight, setListHeight] = React.useState(
        (items.length === 0) ? 3*47 : (items.length > 2) ? 3*47 : items.length*47
    );

    const handleToggleExpand = () => {
        setIsExpanded(!isExpanded);
    }

    React.useEffect(() => {
        if(isExpanded) setListHeight(items.length*47);
        else setListHeight(
            (items.length === 0) ? 3*47 : (items.length > 2) ? 3*47 : items.length*47
        );
    }, [isExpanded])

    const handleToggle = (id: string) => () => {
        if(typeof checkedItems !== "undefined" && typeof setCheckedItems !== "undefined") {
            const newChecked = [...checkedItems];
            if(checkedItems.find(itemId => itemId === id)) {
                setCheckedItems(newChecked.filter(itemId => itemId !== id));
            }else {
                const newId = items.find(item => item.id === id)?.id;
                if(typeof newId !== "undefined") setCheckedItems([...newChecked, newId]);
            }
        }
        else if (typeof checkedItem !== "undefined" && typeof setCheckedItem !== "undefined") {
            if(checkedItem === id) {
                setCheckedItem(null);
            }else {
                const newId = items.find(item => item.id === id)?.id;
                if(typeof newId !== "undefined") setCheckedItem(newId);
            }
        }
    };

    return (
        <Accordion
            sx={{
                boxShadow: "none",
                background: "transparent",
            }}
            defaultExpanded={defaultExpanded? defaultExpanded : false}
        >
            <AccordionSummary
                sx={{
                    minHeight: "48px !important",
                    '.MuiAccordionSummary-content': {
                        margin: "23px 0 12px !important",
                    },

                    '.MuiAccordionSummary-expandIconWrapper': {
                        marginTop: "10px",
                        transition: 'margin 0.1s ease-in-out',
                        marginRight: "20px"
                    }
                }}
                expandIcon={<IconContainerGrey className="darker" sx={{ fontSize: "24px !important" }}><ExpandMore /></IconContainerGrey>}
                aria-controls={title+"-content"}
                id={title+"-header"}
            >
                <Box sx={{ fontSize: "12px" }}>
                    <SidebarTitle sx={{ marginBottom: 0 }}>{title}</SidebarTitle>
                </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ paddingTop: 0, paddingBottom: 0 }}>
                <List
                    sx={{
                        width: '100%',
                        paddingTop: 0,
                        paddingBottom: 0,
                        backgroundColor: 'background.paper',
                        height: listHeight,
                        overflow: "hidden",
                        transition: "height 0.2s ease-in-out",
                    }}>
                    {items.map((item, index) => {
                        const labelId = `checkbox-list-label-${item.id}`;

                        return (
                            <ListItem
                                key={item.id+"_"+index}
                                disablePadding
                            >
                                <ListItemButton sx={{ paddingLeft: "25px", borderRadius: "12px" }} role={undefined} onClick={handleToggle(item.id)} dense>
                                    <ListItemIcon sx={{ minWidth: 0 }}>
                                        <Checkbox
                                            edge="start"
                                            checked={
                                                (typeof checkedItems !== "undefined")?
                                                checkedItems.find((itemId) => itemId === item.id) !== undefined
                                                :
                                                    (typeof checkedItem !== "undefined")?
                                                    checkedItem === item.id
                                                    :
                                                    false
                                            }
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText sx={{ fontSize: "14px", 'span': { fontSize: "1em", fontWeight: "bold", color: theme.palette.text.secondary } }} id={labelId} primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        );
                    })}
                </List>
                {items.length > 3 ?
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <ListItemButton sx={{ paddingLeft: "25px", borderRadius: "12px", display: "flex" }} role={undefined} onClick={handleToggleExpand}>
                        <IconContainerGrey className="darker" sx={{ fontSize: "24px !important", marginLeft: "-5px", marginRight: "7px" }}>{isExpanded ? <ExpandLess /> : <ExpandMore />}</IconContainerGrey>
                        <ListItemText sx={{ fontSize: "14px", 'span': { fontSize: "1em", fontWeight: "bold", color: theme.palette.text.secondary } }} primary={isExpanded ? lessItemsText : moreItemsText} />
                    </ListItemButton>
                </Box>
                : null}
            </AccordionDetails>
        </Accordion>
    )
}

export default SidebarList;