import StyledSearchAutoComplete from "../../common/inputs/searchAutocomplete";
import { fetchArtists } from "../../../lib/fetchArtists";
import useTranslation from '../../../utility/useTranslation';
import { GenericText } from '../../../lang/common/genericText';
import { Box } from '@mui/material';
import { SidebarDivider } from "../../common/sidebarComponents/sidebarDivider";
import React from "react";
import StyledSidebarList from "../../common/sidebarComponents/sidebarList";

interface MusicVideosSidebarProps {
    currentArtists: any[];
    setCurrentArtists: React.Dispatch<React.SetStateAction<any[]>>;
    selectedArtists: any[];
    setSelectedArtists: React.Dispatch<React.SetStateAction<any[]>>;
    setOffset: React.Dispatch<React.SetStateAction<number>>;
    checkedGenres: string[];
    setCheckedGenres: React.Dispatch<React.SetStateAction<string[]>>;
    checkedRating: string | null;
    setCheckedRating: React.Dispatch<React.SetStateAction<string | null>>;
    checkedDecades: string[];
    setCheckedDecades: React.Dispatch<React.SetStateAction<string[]>>;
    checkedOwner: string | null;
    setCheckedOwner: React.Dispatch<React.SetStateAction<string | null>>;
}

const MusicVideoSidebar = ({
    currentArtists,
    setCurrentArtists,
    selectedArtists,
    setSelectedArtists,
    setOffset,
    checkedGenres,
    setCheckedGenres,
    checkedRating,
    setCheckedRating,
    checkedDecades,
    setCheckedDecades,
    checkedOwner,
    setCheckedOwner
}: MusicVideosSidebarProps) => {
    const genericText = useTranslation(GenericText).t;

    return (
        <Box sx={{ padding: "15px 0" }}>
            <StyledSearchAutoComplete
                fetchItems={fetchArtists}
                currentItems={currentArtists}
                setCurrentItems={setCurrentArtists}
                selectedItems={selectedArtists}
                setSelectedItems={setSelectedArtists}
                title={genericText("filterArtists")}
                searchPlaceholder={genericText("findArtist")}
                setOffset={setOffset}
            />
            <SidebarDivider />
            <Box>
                <StyledSidebarList
                    title={genericText("filterGenres")}
                    items={[
                        {
                            id: "1",
                            title: "Genre 1"
                        },
                        {
                            id: "2",
                            title: "Genre 2"
                        },
                        {
                            id: "3",
                            title: "Genre 3"
                        },
                        {
                            id: "4",
                            title: "Genre 4"
                        },
                        {
                            id: "5",
                            title: "Genre 5"
                        }
                    ]}
                    lessItemsText={genericText("lessGenres")}
                    moreItemsText={genericText("moreGenres")}
                    checkedItems={checkedGenres}
                    setCheckedItems={setCheckedGenres}
                    defaultExpanded={true}
                />
            </Box>
            <SidebarDivider />
            <Box>
                <StyledSidebarList
                    title={genericText("filterRating")}
                    items={[
                        {
                            id: "1",
                            title: "Rating 1"
                        },
                        {
                            id: "2",
                            title: "Rating 2"
                        },
                        {
                            id: "3",
                            title: "Rating 3"
                        },
                        {
                            id: "4",
                            title: "Rating 4"
                        },
                        {
                            id: "5",
                            title: "Rating 5"
                        }
                    ]}
                    lessItemsText={genericText("lessRatings")}
                    moreItemsText={genericText("moreRatings")}
                    checkedItem={checkedRating}
                    setCheckedItem={setCheckedRating}
                    defaultExpanded={true}
                />
            </Box>
            <SidebarDivider />
            <Box>
                <StyledSidebarList
                    title={genericText("filterDecades")}
                    items={[
                        {
                            id: "1",
                            title: "Decades 1"
                        },
                        {
                            id: "2",
                            title: "Decades 2"
                        },
                        {
                            id: "3",
                            title: "Decades 3"
                        },
                        {
                            id: "4",
                            title: "Decades 4"
                        },
                        {
                            id: "5",
                            title: "Decades 5"
                        }
                    ]}
                    lessItemsText={genericText("lessDecades")}
                    moreItemsText={genericText("moreDecades")}
                    checkedItems={checkedDecades}
                    setCheckedItems={setCheckedDecades}
                />
            </Box>
            <SidebarDivider />
            <Box>
                <StyledSidebarList
                    title={genericText("filterOwner")}
                    items={[
                        {
                            id: "1",
                            title: "Owner 1"
                        },
                        {
                            id: "2",
                            title: "Owner 2"
                        },
                        {
                            id: "3",
                            title: "Owner 3"
                        },
                        {
                            id: "4",
                            title: "Owner 4"
                        },
                        {
                            id: "5",
                            title: "Owner 5"
                        }
                    ]}
                    lessItemsText={genericText("lessOwners")}
                    moreItemsText={genericText("moreOwners")}
                    checkedItem={checkedOwner}
                    setCheckedItem={setCheckedOwner}
                />
            </Box>
        </Box>
    )
}

export default MusicVideoSidebar;