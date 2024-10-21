import { Box } from '@mui/material';
import React from "react";
import { useAppSelector } from '../../../hooks';
import { GenericText } from '../../../lang/common/genericText';
import useTranslation from '../../../utility/useTranslation';
import { SidebarDivider } from "../../common/sidebarComponents/sidebarDivider";
import StyledSidebarList from "../../common/sidebarComponents/sidebarList";

interface PlaylistsSidebarProps {
    checkedType: string | null;
    setCheckedType: React.Dispatch<React.SetStateAction<string | null>>;
    checkedGenres: string[];
    setCheckedGenres: React.Dispatch<React.SetStateAction<string[]>>;
    checkedRating: string | null;
    setCheckedRating: React.Dispatch<React.SetStateAction<string | null>>;
    checkedDecades: string[];
    setCheckedDecades: React.Dispatch<React.SetStateAction<string[]>>;
    checkedMoods: string[];
    setCheckedMoods: React.Dispatch<React.SetStateAction<string[]>>;
    checkedActivities: string[];
    setCheckedActivities: React.Dispatch<React.SetStateAction<string[]>>;
    checkedActive?: string | null;
    setCheckedActive?: React.Dispatch<React.SetStateAction<string | null>>;
}

const PlaylistsSidebar = ({
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
}: PlaylistsSidebarProps) => {
    const genericText = useTranslation(GenericText).t;
    const { enumProject } = useAppSelector(state => state.enum);
    const [types, setTypes] = React.useState<{
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
                const tempTypes = enumProject.playlist_categories;

                const tempTypeSorted = Object.entries(tempTypes).map(value => {
                    return {
                        id: value[0].toLowerCase(),
                        title: value[1].charAt(0).toUpperCase() + value[1].slice(1)
                    };
                })

                setTypes(tempTypeSorted);

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

        FetchData();
    }, [enumProject])

    return (
        <Box sx={{ padding: "15px 0" }}>
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
            </Box>
            <SidebarDivider />
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
            </Box>
            <SidebarDivider />
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
            </Box>
            <SidebarDivider />
            <Box>
                <StyledSidebarList
                    title={genericText("filterRating")}
                    items={ratings}
                    lessItemsText={genericText("lessRatings")}
                    moreItemsText={genericText("moreRatings")}
                    checkedItem={checkedRating}
                    setCheckedItem={setCheckedRating}
                />
            </Box>
            <SidebarDivider />
            <Box>
                <StyledSidebarList
                    title={genericText("filterDecades")}
                    items={decades}
                    lessItemsText={genericText("lessDecades")}
                    moreItemsText={genericText("moreDecades")}
                    checkedItems={checkedDecades}
                    setCheckedItems={setCheckedDecades}
                />
            </Box>
            <SidebarDivider />
            <Box>
                <StyledSidebarList
                    title={genericText("filterMood")}
                    items={moods}
                    lessItemsText={genericText("lessMoods")}
                    moreItemsText={genericText("moreMoods")}
                    checkedItems={checkedMoods}
                    setCheckedItems={setCheckedMoods}
                />
            </Box>
            <SidebarDivider />
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
        </Box>
    )
}

export default PlaylistsSidebar;