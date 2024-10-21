import { Box } from '@mui/material';
import { SidebarDivider } from "../sidebarComponents/sidebarDivider";
import React from "react";
import StyledSidebarList from "../sidebarComponents/sidebarList";
import StyledSearchAutoComplete from '../inputs/searchAutocomplete';

interface ContentSidebarProps {
    autocompleteSearchList?: {
        title: string,
        fetchItems: (searchVal: string, selItems: any[] | null, setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, signal?: AbortSignal) => void,
        currentItems: any[],
        setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>,
        selectedItems: any[],
        setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>,
        searchPlaceholder: string,
        setOffset: React.Dispatch<React.SetStateAction<number>>,
        itemOrder: number,
    }[],
    checkedList?: {
        title: string,
        items: {
            id: string,
            title: string,
        }[],
        lessItemsText: string,
        moreItemsText: string,
        itemOrder: number,
        checkedItem?: string | null,
        setCheckedItem?: React.Dispatch<React.SetStateAction<string | null>>,
        checkedItems?: string[],
        setCheckedItems?: React.Dispatch<React.SetStateAction<string[]>>,
        defaultExpanded?: boolean
    }[]
}

const ContentSidebar = ({
    autocompleteSearchList,
    checkedList
}: ContentSidebarProps) => {
    // create a list of all the items in the sidebar and sort them by itemOrder
    if(!autocompleteSearchList) autocompleteSearchList = [];
    if(!checkedList) checkedList = [];
    const allItems = [...autocompleteSearchList, ...checkedList];
    allItems.sort((a, b) => a.itemOrder - b.itemOrder);

    return (
        <Box sx={{ padding: "15px 0" }}>
            {allItems.map((item, index) => {
                if ("fetchItems" in item) {
                    return (
                        <Box key={index}>
                            <StyledSearchAutoComplete
                                fetchItems={item.fetchItems}
                                currentItems={item.currentItems}
                                setCurrentItems={item.setCurrentItems}
                                selectedItems={item.selectedItems}
                                setSelectedItems={item.setSelectedItems}
                                title={item.title}
                                searchPlaceholder={item.searchPlaceholder}
                                setOffset={item.setOffset}
                            />
                            <SidebarDivider />
                        </Box>
                    )
                }
                else {
                    return (
                        <Box key={index}>
                            <StyledSidebarList
                                title={item.title}
                                items={item.items}
                                lessItemsText={item.lessItemsText}
                                moreItemsText={item.moreItemsText}
                                checkedItem={item.checkedItem}
                                setCheckedItem={item.setCheckedItem}
                                checkedItems={item.checkedItems}
                                setCheckedItems={item.setCheckedItems}
                                defaultExpanded={item.defaultExpanded}
                            />
                            <SidebarDivider />
                        </Box>
                    )
                }
            })}
        </Box>
    )
}

export default ContentSidebar;