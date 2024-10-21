import { Box } from '@mui/material';
import React from "react";
import { useAppSelector } from '../../../hooks';
import { GenericText } from '../../../lang/common/genericText';
import { fetchArtists } from '../../../lib/fetchArtists';
import useTranslation from '../../../utility/useTranslation';
import StyledSearchAutoComplete from '../inputs/searchAutocomplete';
import { SidebarDivider } from "../sidebarComponents/sidebarDivider";
import StyledSidebarList from "../sidebarComponents/sidebarList";

interface ContentSidebarProps {
    currentArtists?: any[];
    setCurrentArtists?: React.Dispatch<React.SetStateAction<any[]>>;
    selectedArtists?: any[];
    setSelectedArtists?: React.Dispatch<React.SetStateAction<any[]>>;
    setOffset?: React.Dispatch<React.SetStateAction<number>>;
    checkedOwner?: string | null;
    setCheckedOwner?: React.Dispatch<React.SetStateAction<string | null>>;
    checkedType?: string | null;
    setCheckedType?: React.Dispatch<React.SetStateAction<string | null>>;
    checkedGenres?: string[];
    setCheckedGenres?: React.Dispatch<React.SetStateAction<string[]>>;
    checkedRating?: string | null;
    setCheckedRating?: React.Dispatch<React.SetStateAction<string | null>>;
    checkedDecades?: string[];
    setCheckedDecades?: React.Dispatch<React.SetStateAction<string[]>>;
    checkedMoods?: string[];
    setCheckedMoods?: React.Dispatch<React.SetStateAction<string[]>>;
    checkedActivities?: string[];
    setCheckedActivities?: React.Dispatch<React.SetStateAction<string[]>>;
    checkedActive?: string | null;
    setCheckedActive?: React.Dispatch<React.SetStateAction<string | null>>;
}

const ContentSidebar = ({
    currentArtists,
    setCurrentArtists,
    selectedArtists,
    setSelectedArtists,
    setOffset,
    checkedOwner,
    setCheckedOwner,
    checkedType,
    setCheckedType,
    checkedGenres,
    setCheckedGenres,
    checkedRating,
    setCheckedRating,
    checkedDecades,
    setCheckedDecades,
    checkedMoods,
    setCheckedMoods,
    checkedActivities,
    setCheckedActivities,
    checkedActive,
    setCheckedActive
}: ContentSidebarProps) => {
    const genericText = useTranslation(GenericText).t;
    const { enumProject } = useAppSelector(state => state.enum);
    const [types, setTypes] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [owners, setOwners] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [genres, setGenres] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [ratings, setRatings] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [decades, setDecades] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [moods, setMoods] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [activities, setActivities] = React.useState<{
        id: string,
        title: string
    }[]>([]);
    const [active, setActive] = React.useState<{
        id: string,
        title: string
    }[]>([
        {
            id: "active",
            title: genericText("active")
        },
        {
            id: "inactive",
            title: genericText("inactive")
        }
    ]);

    React.useEffect(() => {
        const FetchData = async () => {
            if (enumProject) {
                if (typeof checkedType !== "undefined") {
                    const tempTypes  = enumProject.playlist_categories;

                    const tempTypeSorted = Object.entries(tempTypes).map(value => {
                        return {
                            id: value[0].toLowerCase(),
                            title: value[1].charAt(0).toUpperCase() + value[1].slice(1)
                        };
                    })

                    setTypes(tempTypeSorted);

                }

                if (typeof checkedOwner !== "undefined") {

                }

                if (typeof checkedGenres !== "undefined") {
                    const tempGenres = enumProject.playlist_genres;

                    if (typeof tempGenres !== "undefined") {
                        const tempGenresSorted = Object.entries(tempGenres).map(value => {
                            return {
                                id: value[0].toLowerCase(),
                                title: value[1].charAt(0).toUpperCase() + value[1].slice(1)
                            };
                        })

                        setGenres(tempGenresSorted);
                    }
                }

                if (typeof checkedRating !== "undefined") {
                    const tempRating = enumProject.playlist_ratings;

                    if (typeof tempRating !== "undefined") {
                        const tempRatingSorted = tempRating.map(value => {
                            return {
                                id: value,
                                title: value.charAt(0).toUpperCase() + value.slice(1)
                            };
                        })

                        setRatings(tempRatingSorted);
                    }
                }

                if (typeof checkedDecades !== "undefined") {
                    const tempDecades = enumProject.playlist_decades;

                    if (typeof tempDecades !== "undefined") {
                        const tempDecadesSorted = Object.entries(tempDecades).map(value => {
                            return {
                                id: value[0].toLowerCase(),
                                title: value[1].charAt(0).toUpperCase() + value[1].slice(1)
                            };
                        })

                        setDecades(tempDecadesSorted);
                    }
                }

                if (typeof checkedMoods !== "undefined") {
                    const tempMoods = enumProject.playlist_moods;

                    if (typeof tempMoods !== "undefined") {
                        const tempMoodsSorted = Object.entries(tempMoods).map(value => {
                            return {
                                id: value[0].toLowerCase(),
                                title: value[1].charAt(0).toUpperCase() + value[1].slice(1)
                            };
                        })

                        setMoods(tempMoodsSorted);
                    }

                }

                if (typeof checkedActivities !== "undefined") {

                    const tempActivities = enumProject.playlist_activities;

                    if (typeof tempActivities !== "undefined") {
                        const tempActivitiesSorted = Object.entries(tempActivities).map(value => {
                            return {
                                id: value[0].toLowerCase(),
                                title: value[1].charAt(0).toUpperCase() + value[1].slice(1)
                            };
                        })

                        setActivities(tempActivitiesSorted);
                    }

                }

            }
        }

        FetchData();
    }, [enumProject])

    return (
        <Box sx={{ padding: "15px 0" }}>
            {
                typeof currentArtists !== "undefined" && typeof selectedArtists !== "undefined" && typeof setCurrentArtists !== "undefined" && typeof setSelectedArtists !== "undefined" ?
                    <Box>
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
                    </Box>
                    :
                    null
            }
            {
                typeof checkedActive !== "undefined" && typeof setCheckedActive !== "undefined" ?
                    <Box>
                        <StyledSidebarList
                            title={genericText("filterActives")}
                            items={active}
                            lessItemsText={genericText("lessActives")}
                            moreItemsText={genericText("moreActives")}
                            checkedItem={checkedActive}
                            setCheckedItem={setCheckedActive}
                            defaultExpanded={true}
                        />

                        <SidebarDivider />
                    </Box>
                    :
                    null
            }
            {
                typeof checkedType !== "undefined" && typeof setCheckedType !== "undefined" ?
                    <Box>
                        <StyledSidebarList
                            title={genericText("filterType")}
                            items={types}
                            lessItemsText={genericText("lessTypes")}
                            moreItemsText={genericText("moreTypes")}
                            checkedItem={checkedType}
                            setCheckedItem={setCheckedType}
                            defaultExpanded={true}
                        />
                        <SidebarDivider />
                    </Box>
                    :
                    null
            }
            {
                typeof checkedGenres !== "undefined" && typeof setCheckedGenres !== "undefined" ?
                    <Box>
                        <StyledSidebarList
                            title={genericText("filterGenres")}
                            items={genres}
                            lessItemsText={genericText("lessGenres")}
                            moreItemsText={genericText("moreGenres")}
                            checkedItems={checkedGenres}
                            setCheckedItems={setCheckedGenres}
                            defaultExpanded={true}
                        />
                        <SidebarDivider />
                    </Box>
                    :
                    null
            }
            {
                typeof checkedRating !== "undefined" && typeof setCheckedRating !== "undefined" ?
                    <Box>
                        <StyledSidebarList
                            title={genericText("filterRating")}
                            items={ratings}
                            lessItemsText={genericText("lessRatings")}
                            moreItemsText={genericText("moreRatings")}
                            checkedItem={checkedRating}
                            setCheckedItem={setCheckedRating}
                        />
                        <SidebarDivider />
                    </Box>
                    :
                    null
            }
            {
                typeof checkedDecades !== "undefined" && typeof setCheckedDecades !== "undefined" ?
                    <Box>
                        <StyledSidebarList
                            title={genericText("filterDecades")}
                            items={decades}
                            lessItemsText={genericText("lessDecades")}
                            moreItemsText={genericText("moreDecades")}
                            checkedItems={checkedDecades}
                            setCheckedItems={setCheckedDecades}
                        />
                        <SidebarDivider />
                    </Box>
                    :
                    null
            }
            {
                typeof checkedMoods !== "undefined" && typeof setCheckedMoods !== "undefined" ?
                    <Box>
                        <StyledSidebarList
                            title={genericText("filterMood")}
                            items={moods}
                            lessItemsText={genericText("lessMoods")}
                            moreItemsText={genericText("moreMoods")}
                            checkedItems={checkedMoods}
                            setCheckedItems={setCheckedMoods}
                        />
                        <SidebarDivider />
                    </Box>
                    :
                    null
            }
            {
                typeof checkedActivities !== "undefined" && typeof setCheckedActivities !== "undefined" ?
                    <Box>
                        <StyledSidebarList
                            title={genericText("filterActivities")}
                            items={activities}
                            lessItemsText={genericText("lessActivities")}
                            moreItemsText={genericText("moreActivities")}
                            checkedItems={checkedActivities}
                            setCheckedItems={setCheckedActivities}
                        />
                    </Box>
                    :
                    null
            }
            {
                typeof checkedOwner !== "undefined" && typeof setCheckedOwner !== "undefined" ?
                    <Box>
                        <StyledSidebarList
                            title={genericText("filterOwners")}
                            items={owners}
                            lessItemsText={genericText("lessOwners")}
                            moreItemsText={genericText("moreOwners")}
                            checkedItem={checkedOwner}
                            setCheckedItem={setCheckedOwner}
                        />
                        <SidebarDivider />
                    </Box>
                    :
                    null
            }
        </Box>
    )
}

export default ContentSidebar;