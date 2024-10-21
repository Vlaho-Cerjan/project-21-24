import { Box, Switch } from "@mui/material"
import StyledSearchAutoComplete from "../../../common/inputs/searchAutocomplete"
import { SidebarDivider } from "../../../common/sidebarComponents/sidebarDivider"
import { SidebarTitle } from "../../../common/sidebarComponents/sidebarTitle"
import { GenericText } from "../../../../lang/common/genericText"
import useTranslation from "../../../../utility/useTranslation"
import { useSnackbar } from "notistack"
import React from "react"

interface ActionPlaylistSidebarProps {
    genres: { [key: string]: string } | null,
    moods: { [key: string]: string } | null,
    eras: { [key: string]: string } | null,
    activities: { [key: string]: string } | null,
    selectedGenres: {
        id: string;
        name: string;
        label: string;
    }[],
    setSelectedGenres: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        label: string;
    }[]>>,
    selectedMoods: {
        id: string;
        name: string;
        label: string;
    }[],
    setSelectedMoods: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        label: string;
    }[]>>,
    selectedEras: {
        id: string;
        name: string;
        label: string;
    }[],
    setSelectedEras: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        label: string;
    }[]>>,
    selectedActivities: {
        id: string;
        name: string;
        label: string;
    }[],
    setSelectedActivities: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        label: string;
    }[]>>,
    isActivePlaylist: boolean,
    handleActiveChange: () => void
}

const ActionPlaylistSidebar = ({
    genres,
    moods,
    eras,
    activities,
    selectedGenres,
    setSelectedGenres,
    selectedMoods,
    setSelectedMoods,
    selectedEras,
    setSelectedEras,
    selectedActivities,
    setSelectedActivities,
    isActivePlaylist,
    handleActiveChange
}: ActionPlaylistSidebarProps) => {
    const genericText = useTranslation(GenericText).t;
    const { enqueueSnackbar } = useSnackbar();

    const [currentGenres, setCurrentGenres] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [currentMoods, setCurrentMoods] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [currentEras, setCurrentEras] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [currentActivities, setCurrentActivities] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);

    const fetchGenres = async (searchVal: string, selItems: any[] | null, setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
        setLoading(true);
        if (genres) {
            if (searchVal === "") {
                setCurrentGenres(
                    Object.entries(genres).map(([key, value]) => {
                        return {
                            id: key,
                            name: value,
                            label: value
                        };
                    }).filter(
                        (genre) => {
                            if (selItems) {
                                const isGenreSelected = selItems.find(selectedGenre => selectedGenre.id === genre.id);
                                if (typeof isGenreSelected !== "undefined") return false;
                                return true;
                            }
                            return true;
                        }
                    )
                );
                setLoading(false);
                return;
            }
            const tempGenres = Object.entries(genres).map((genre) => ({
                id: genre[0],
                name: genre[1],
                label: genre[1],
            })).filter(
                (genre) => {
                    if (selItems) {
                        const isGenreSelected = selItems.find(selectedGenre => selectedGenre.id === genre.id);
                        if (typeof isGenreSelected !== "undefined") return false;
                        return true;
                    }
                    return true;
                }
            ).filter(
                (genre) => {
                    if (searchVal !== "") {
                        return genre.name.toLowerCase().includes(searchVal.toLowerCase());
                    }
                    return true;
                }
            );
            setCurrentGenres(tempGenres);
        } else {
            enqueueSnackbar("Error fetching genres", { variant: "error" });
        }
        setLoading(false);
    }

    const fetchEras = async (searchVal: string, selItems: any[] | null, setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
        setLoading(true);
        if (eras) {
            if (searchVal === "") {
                setCurrentEras(
                    Object.entries(eras).map(([key, value]) => {
                        return {
                            id: key,
                            name: value,
                            label: value
                        };
                    }).filter(
                        (era) => {
                            if (selItems) {
                                const isEraSelected = selItems.find(selectedEra => selectedEra.id === era.id);
                                if (typeof isEraSelected !== "undefined") return false;
                                return true;
                            }
                            return true;
                        }
                    )
                );
                setLoading(false);
                return;
            }
            const tempEras = Object.entries(eras).map((genre) => ({
                id: genre[0],
                name: genre[1],
                label: genre[1],
            })).filter(
                (genre) => {
                    if (selItems) {
                        const isGenreSelected = selItems.find(selectedGenre => selectedGenre.id === genre.id);
                        if (typeof isGenreSelected !== "undefined") return false;
                        return true;
                    }
                    return true;
                }
            ).filter(
                (genre) => {
                    if (searchVal !== "") {
                        return genre.name.toLowerCase().includes(searchVal.toLowerCase());
                    }
                    return true;
                }
            );
            setCurrentEras(tempEras);
        } else {
            enqueueSnackbar("Error fetching eras", { variant: "error" });
        }
        setLoading(false);
    }

    const fetchMoods = async (searchVal: string, selItems: any[] | null, setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
        setLoading(true);
        if (moods) {
            if (searchVal === "") {
                setCurrentMoods(
                    Object.entries(moods).map(([key, value]) => {
                        return {
                            id: key,
                            name: value,
                            label: value
                        };
                    }).filter(
                        (mood) => {
                            if (selItems) {
                                const isMoodSelected = selItems.find(selectedMood => selectedMood.id === mood.id);
                                if (typeof isMoodSelected !== "undefined") return false;
                                return true;
                            }
                            return true;
                        }
                    )
                );
                setLoading(false);
                return;
            }
            const tempMoods = Object.entries(moods).map((genre) => ({
                id: genre[0],
                name: genre[1],
                label: genre[1],
            })).filter(
                (genre) => {
                    if (selItems) {
                        const isGenreSelected = selItems.find(selectedGenre => selectedGenre.id === genre.id);
                        if (typeof isGenreSelected !== "undefined") return false;
                        return true;
                    }
                    return true;
                }
            ).filter(
                (genre) => {
                    if (searchVal !== "") {
                        return genre.name.toLowerCase().includes(searchVal.toLowerCase());
                    }
                    return true;
                }
            );
            setCurrentMoods(tempMoods);
        } else {
            enqueueSnackbar("Error fetching moods", { variant: "error" });
        }
        setLoading(false);
    }

    const fetchActivities = async (searchVal: string, selItems: any[] | null, setCurrentItems: React.Dispatch<React.SetStateAction<any[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
        setLoading(true);
        if (activities) {
            if (searchVal === "") {
                setCurrentActivities(
                    Object.entries(activities).map(([key, value]) => {
                        return {
                            id: key,
                            name: value,
                            label: value
                        };
                    }).filter(
                        (activity) => {
                            if (selItems) {
                                const isActivitySelected = selItems.find(selectedActivity => selectedActivity.id === activity.id);
                                if (typeof isActivitySelected !== "undefined") return false;
                                return true;
                            }
                            return true;
                        }
                    )
                );
                setLoading(false);
                return;
            }
            const tempActivities = Object.entries(activities).map((genre) => ({
                id: genre[0],
                name: genre[1],
                label: genre[1],
            })).filter(
                (genre) => {
                    if (selItems) {
                        const isGenreSelected = selItems.find(selectedGenre => selectedGenre.id === genre.id);
                        if (typeof isGenreSelected !== "undefined") return false;
                        return true;
                    }
                    return true;
                }
            ).filter(
                (genre) => {
                    if (searchVal !== "") {
                        return genre.name.toLowerCase().includes(searchVal.toLowerCase());
                    }
                    return true;
                }
            );
            setCurrentActivities(tempActivities);
        } else {
            enqueueSnackbar("Error fetching activities", { variant: "error" });
        }
        setLoading(false);
    }

    React.useEffect(() => {
        if (genres && eras && moods && activities) {
            setCurrentGenres(
                Object.entries(genres).map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                        label: value
                    };
                }).filter(
                    (genre) => {
                        if (selectedGenres) {
                            const isGenreSelected = selectedGenres.find(selectedGenre => selectedGenre.id === genre.id);
                            if (typeof isGenreSelected !== "undefined") return false;
                            return true;
                        }
                        return true;
                    }
                )
            );
            setCurrentMoods(
                Object.entries(moods).map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                        label: value
                    };
                }).filter(
                    (mood) => {
                        if (selectedMoods) {
                            const isMoodSelected = selectedMoods.find(selectedMood => selectedMood.id === mood.id);
                            if (typeof isMoodSelected !== "undefined") return false;
                            return true;
                        }
                        return true;
                    }
                )
            );
            setCurrentEras(
                Object.entries(eras).map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                        label: value
                    };
                }).filter(
                    (era) => {
                        if (selectedEras) {
                            const isEraSelected = selectedEras.find(selectedEra => selectedEra.id === era.id);
                            if (typeof isEraSelected !== "undefined") return false;
                            return true;
                        }
                        return true;
                    }
                )
            );
            setCurrentActivities(
                Object.entries(activities).map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                        label: value
                    };
                }).filter(
                    (activity) => {
                        if (selectedActivities) {
                            const isActivitySelected = selectedActivities.find(selectedActivity => selectedActivity.id === activity.id);
                            if (typeof isActivitySelected !== "undefined") return false;
                            return true;
                        }
                        return true;
                    }
                )
            );
        }
    }, [activities, eras, genres, moods, selectedActivities, selectedEras, selectedGenres, selectedMoods]);

    return (
        <Box sx={{ maxWidth: "270px", padding: "40px 25px 0 15px" }}>
            <Box>
                <StyledSearchAutoComplete
                    fetchItems={fetchGenres}
                    currentItems={currentGenres}
                    setCurrentItems={setCurrentGenres}
                    selectedItems={selectedGenres}
                    setSelectedItems={setSelectedGenres}
                    title={genericText("genres")}
                    searchPlaceholder={genericText("findGenre")}
                />
            </Box>
            <SidebarDivider />
            <Box>
                <StyledSearchAutoComplete
                    fetchItems={fetchEras}
                    currentItems={currentEras}
                    setCurrentItems={setCurrentEras}
                    selectedItems={selectedEras}
                    setSelectedItems={setSelectedEras}
                    title={genericText("decades")}
                    searchPlaceholder={genericText("findDecades")}
                />
            </Box>
            <SidebarDivider />
            <Box>
                <StyledSearchAutoComplete
                    fetchItems={fetchMoods}
                    currentItems={currentMoods}
                    setCurrentItems={setCurrentMoods}
                    selectedItems={selectedMoods}
                    setSelectedItems={setSelectedMoods}
                    title={genericText("moods")}
                    searchPlaceholder={genericText("findMoods")}
                />
            </Box>
            <SidebarDivider />
            <Box>
                <StyledSearchAutoComplete
                    fetchItems={fetchActivities}
                    currentItems={currentActivities}
                    setCurrentItems={setCurrentActivities}
                    selectedItems={selectedActivities}
                    setSelectedItems={setSelectedActivities}
                    title={genericText("activities")}
                    searchPlaceholder={genericText("findActivities")}
                />
            </Box>
            <SidebarDivider />
            <Box>
                <Box
                    sx={{
                        padding: "15px"
                    }}
                >
                    <Box sx={{ fontSize: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <SidebarTitle sx={{ marginBottom: 0 }}>{genericText("active")}</SidebarTitle>
                        <Switch
                            sx={{ marginRight: "13px", }}
                            checked={isActivePlaylist}
                            onChange={handleActiveChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ActionPlaylistSidebar