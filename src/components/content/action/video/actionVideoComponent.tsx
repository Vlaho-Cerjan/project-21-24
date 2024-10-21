import { KeyboardArrowDown } from '@mui/icons-material';
import {
    Box,
    Divider,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    styled,
} from '@mui/material';
import { LocalizationProvider, StaticDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO } from 'date-fns';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React from 'react';
import { langs } from '../../../../constants/languages';
import { months } from '../../../../constants/months';
import { Owners } from '../../../../constants/owners';
import { Ratings } from '../../../../constants/ratings';
import { Versions } from '../../../../constants/versions';
import { useAppSelector } from '../../../../hooks';
import { Artist } from '../../../../interfaces/content/artist';
import { SingleVideo } from '../../../../interfaces/content/music/singleVideo';
import { ExceptionStrings } from '../../../../lang/common/exceptions';
import { GenericText } from '../../../../lang/common/genericText';
import { fetchArtists } from '../../../../lib/fetchArtists';
import { RefreshIfLoggedOut } from '../../../../lib/refreshIfLoggedOut';
import { LoadingContext } from '../../../../store/providers/loadingProvider';
import { range } from '../../../../utility/getRange';
import utf8ToB64 from '../../../../utility/stringToBase64';
import useTranslation from '../../../../utility/useTranslation';
import { IconContainerGrey } from '../../../common/iconContainer/iconContainer';
import StyledSearchAutoComplete from '../../../common/inputs/searchAutocomplete';
import StyledCheckbox from '../../../common/inputs/styledCheckbox';
import { SidebarDivider } from '../../../common/sidebarComponents/sidebarDivider';
import { StyledLabel } from '../../../common/styledLabel/styledLabel';
import StyledSubsection from '../../../common/styledSubsection/styledSubsection';
import { StyledTabs } from '../../../common/styledTabs/styledTabs';
import StyledUpload from '../../../common/styledUpload/styledUpload';
import { StyledActionContainer, StyledSubsectionContainer } from '../../styledComponents/actionStyledComponents';
import { ActionVideoStrings } from '../lang/actionVideoStrings';
import EditVideoHeader from './actionVideoHeader';

const StyledSelect = styled(Select)(({ theme }) => ({
    maxHeight: "44px",
    borderRadius: "12px",

    '& fieldset': {
        borderWidth: "2px"
    },

    '& .MuiInputBase-input': {
        paddingLeft: "25px"
    },

    '& .MuiSelect-select': {
        zIndex: 1,
        fontWeight: 500,
        color: theme.palette.text.secondary
    }
}))

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    top: "-4px",
    color: theme.palette.text.secondary,
    fontWeight: "900 !important",

    '&.MuiFormLabel-filled': {
        top: 0
    }
}))

interface ActionVideoProps {
    action: "edit" | "add";
    videoType: "music" | "external";
}

const ActionVideoComponent = ({ action, videoType }: ActionVideoProps) => {
    const { t } = useTranslation(ActionVideoStrings);
    const genericText = useTranslation(GenericText).t;

    const { setLoading } = React.useContext(LoadingContext);
    const router = useRouter();

    const exception = useTranslation(ExceptionStrings).t;

    const [video, setVideo] = React.useState<SingleVideo>();

    const { enumProject } = useAppSelector(state => state.enum);
    const { enqueueSnackbar } = useSnackbar();

    const [genres, setGenres] = React.useState<{ [key: string]: string } | null>(null);
    const [moods, setMoods] = React.useState<{ [key: string]: string } | null>(null);
    const [eras, setEras] = React.useState<{ [key: string]: string } | null>(null);
    const [activities, setActivities] = React.useState<{ [key: string]: string } | null>(null);
    const [tabValue, setTabValue] = React.useState("en");
    const [videoFile, setVideoFile] = React.useState<string>("");
    const [videoTitles, setVideoTitles] = React.useState<
        {
            [key: string]: string | null
        }
    >({
        en: "",
        es: "",
        fr: "",
    });
    const [coverImageFile, setCoverImageFile] = React.useState<string>("");
    const [dateValue, setDateValue] = React.useState<Date | null>(new Date());
    const [monthValue, setMonthValue] = React.useState<number | null>(new Date().getMonth());
    const [yearValue, setYearValue] = React.useState<number | null>(new Date().getFullYear());
    const [currentArtists, setCurrentArtists] = React.useState<any[]>([]);
    const [primaryArtist, setPrimaryArtist] = React.useState<Artist[]>([]);
    const [currentSecondaryArtists, setCurrentSecondaryArtists] = React.useState<Artist[]>([]);
    const [secondaryArtist, setSecondaryArtist] = React.useState<Artist[]>([]);
    const [ratingValue, setRatingValue] = React.useState<string>("");
    const [isExplicit, setIsExplicit] = React.useState(false);
    const [isBusinessAppropriate, setIsBusinessAppropriate] = React.useState(false);
    const [versionValue, setVersionValue] = React.useState<string>("");
    const [ownerValue, setOwnerValue] = React.useState<string>("");
    const [currentGenres, setCurrentGenres] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [selectedGenres, setSelectedGenres] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [currentMoods, setCurrentMoods] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [selectedMoods, setSelectedMoods] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[] | null>(null);
    const [currentEras, setCurrentEras] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [selectedEras, setSelectedEras] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[] | null>(null);
    const [currentActivities, setCurrentActivities] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[]>([]);
    const [selectedActivities, setSelectedActivities] = React.useState<{
        id: string;
        name: string;
        label: string;
    }[] | null>(null);

    React.useEffect(() => {
        if (enumProject) {
            setGenres(enumProject.playlist_genres);
            setCurrentGenres(
                Object.entries(enumProject.playlist_genres).map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                        label: value
                    };
                })
            );
            setMoods(enumProject.playlist_moods);
            setCurrentMoods(
                Object.entries(enumProject.playlist_moods).map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                        label: value
                    };
                })
            );
            setEras(enumProject.playlist_decades);
            setCurrentEras(
                Object.entries(enumProject.playlist_decades).map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                        label: value
                    };
                })
            );
            setActivities(enumProject.playlist_activities);
            setCurrentActivities(
                Object.entries(enumProject.playlist_activities).map(([key, value]) => {
                    return {
                        id: key,
                        name: value,
                        label: value
                    };
                })
            );
        }
    }, [enumProject]);

    React.useEffect(() => {
        const abortController = new AbortController();

        const FetchVideo = () => {
            setLoading(true);
            fetch('/api/content/videos/' + videoType,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        action: "get",
                        id: router.query.videoId
                    })
                }
            )
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(await response.json());
                })
                .then((data: SingleVideo) => {
                    setVideo(data);
                    setVideoTitles((oldTitles) => {
                        return {
                            ...oldTitles,
                            en: data.title
                        }
                    })
                    setCoverImageFile(process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + data.id + "/image.jpg?width=1040&height=560&cache=" + utf8ToB64(data.updated_at ? data.updated_at : ""));
                    setDateValue(parseISO(data.release_date));
                    setRatingValue(data.rating);
                    setIsBusinessAppropriate(data.business_appropriate);
                    setVersionValue(data.version);
                    setOwnerValue(data.licensor);
                    fetch('/api/content/artists',
                        {
                            method: 'POST',
                            body: JSON.stringify({
                                action: "get",
                                id: data.artist_id
                            })
                        }
                    )
                        .then(async (response) => {
                            if (response.ok) {
                                return response.json();
                            }
                            return Promise.reject(await response.json());
                        })
                        .then((data: Artist[]) => {
                            setPrimaryArtist(data);
                        })
                        .catch((err: Error) => {
                            if (abortController.signal.aborted) {
                                console.log('The user aborted the request');
                            } else {
                                RefreshIfLoggedOut(err.message);
                                enqueueSnackbar(exception("noArtistsFound"), { variant: "error" });
                                //console.error('The request failed');
                            }
                        })
                })
                .catch(() => {
                    if (abortController.signal.aborted) {
                        console.log('The user aborted the request');
                    } else {
                        enqueueSnackbar(exception("noVideoFound"), { variant: "error" });
                        router.back();
                        //console.error('The request failed');
                    }
                })
                .finally(() => {
                    setLoading(false);
                });
        }

        if (action === "edit") {
            if (router.query.videoId) FetchVideo();
        }

    }, [router.query.videoId]);

    React.useEffect(() => {
        const calendarElement = document.getElementById("datepickerContainer");
        if (calendarElement) {
            const calendarHeightElement = calendarElement.getElementsByClassName("PrivatePickersSlideTransition-root")[0];
            if (calendarHeightElement && calendarHeightElement.children.length > 0) {
                const calendarHeight = calendarHeightElement.children[0].clientHeight;
                calendarHeightElement.setAttribute("style", "min-height: " + calendarHeight + "px");
            }
        }
    }, [dateValue]);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setTabValue(newValue);
    };

    React.useEffect(() => {
        console.log(videoFile);
    }, [videoFile]);

    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    }

    const handleMonthChange = (event: SelectChangeEvent<unknown>) => {
        if (typeof event.target.value === "number") {
            setMonthValue(event.target.value);
            const date = dateValue ? new Date(dateValue) : new Date();
            if (date.getMonth() !== event.target.value) {
                date.setMonth(event.target.value);
                setDateValue(date);
            }
        }
    }

    const handleYearChange = (event: SelectChangeEvent<unknown>) => {
        if (typeof event.target.value === "number") {
            setYearValue(event.target.value);
            const date = dateValue ? new Date(dateValue) : new Date();
            if (date.getFullYear() !== event.target.value) {
                date.setFullYear(event.target.value);
                setDateValue(date);
            }
        }
    }

    const handleRatingChange = (event: SelectChangeEvent<unknown>) => {
        if (typeof event.target.value === "string") setRatingValue(event.target.value);
    }

    const handleRatingCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
        if (type === "explicit") setIsExplicit(event.target.checked);
        if (type === "businessAppropriate") setIsBusinessAppropriate(event.target.checked);
    }

    const handleVersionChange = (event: SelectChangeEvent<unknown>) => {
        if (typeof event.target.value === "string") setVersionValue(event.target.value);
    }

    const handleOwnerChange = (event: SelectChangeEvent<unknown>) => {
        if (typeof event.target.value === "string") setOwnerValue(event.target.value);
    }

    const century = new Date().getFullYear() - new Date().getFullYear() % 100;

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
                    })
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

    return (
        <StyledActionContainer>
            <Box component={"form"}>
                <EditVideoHeader action={action} handleSubmit={handleSubmit} />
                <Divider sx={{ borderBottomWidth: "2px" }} />
                <Box sx={{ display: "flex" }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <StyledSubsectionContainer>
                            <StyledSubsection title={genericText("name")}>
                                <StyledTabs
                                    tabs={langs}
                                    ariaLabel='language tabs'
                                    items={videoTitles}
                                    setItems={setVideoTitles}
                                    textPlaceholder={t("enterAVideoTitle")}
                                    textfieldProps={{
                                        inputProps: {
                                            style: {
                                                fontWeight: 500
                                            }
                                        },
                                        InputProps: {
                                            sx: {
                                                fontSize: "14px",
                                                lineHeight: "20px"
                                            }
                                        }
                                    }}
                                    tabPanelProps={{
                                        sx: {
                                            padding: "20.5px 25px"
                                        }
                                    }}
                                />
                            </StyledSubsection>
                        </StyledSubsectionContainer>
                        <StyledSubsectionContainer>
                            <StyledSubsection
                                containerSx={{
                                    padding: "25px 25px 27px"
                                }}
                                title={genericText("uploadFile")}
                            >
                                <Box sx={{ position: "relative" }}>
                                    <StyledUpload
                                        file={videoFile}
                                        setFile={setVideoFile}
                                        type="video"
                                        noPreview={true}
                                    />
                                </Box>
                            </StyledSubsection>
                        </StyledSubsectionContainer>
                        <StyledSubsectionContainer>
                            <StyledSubsection
                                containerSx={{
                                    padding: "25px 25px 27px"
                                }}
                                title={genericText("coverImage")}
                            >
                                <Box sx={{ position: "relative" }}>
                                    <StyledUpload
                                        file={coverImageFile}
                                        setFile={setCoverImageFile}
                                        type="image"
                                    />
                                </Box>
                            </StyledSubsection>
                        </StyledSubsectionContainer>
                    </Box>
                    <Divider orientation='vertical' flexItem sx={{ borderRightWidth: "2px" }} />
                    {enumProject && genres ?
                        <Box sx={{ padding: "40px 25px 0 15px" }}>
                            <Box sx={{ minWidth: "230px", maxWidth: "230px" }}>
                                {StyledLabel(genericText("releaseDate"), { marginBottom: "20px" })}
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center"
                                    }}
                                >
                                    <FormControl fullWidth sx={{ marginRight: "10px" }}>
                                        <StyledInputLabel id="datepicker-months">{genericText("month")}</StyledInputLabel>
                                        <StyledSelect
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    paddingLeft: "14px !important"
                                                },
                                            }}
                                            labelId="datepicker-months"
                                            id="select-months"
                                            value={monthValue}
                                            label={genericText("month")}
                                            onChange={handleMonthChange}
                                            IconComponent={() =>
                                                <IconContainerGrey
                                                    sx={{
                                                        marginRight: "10px",
                                                        position: "absolute",
                                                        right: 0,
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        zIndex: 0,
                                                    }}
                                                >
                                                    <KeyboardArrowDown />
                                                </IconContainerGrey>
                                            }
                                        >
                                            {months.map((month, index) => {
                                                return (
                                                    <MenuItem key={month + "_" + index} value={index}>{month}</MenuItem>
                                                )
                                            })}
                                        </StyledSelect>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <StyledInputLabel id="datepicker-year">{genericText("year")}</StyledInputLabel>
                                        <StyledSelect
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    paddingLeft: "14px !important"
                                                },
                                            }}
                                            labelId="datepicker-year"
                                            id="select-year"
                                            value={yearValue}
                                            label={genericText("year")}
                                            onChange={handleYearChange}
                                            IconComponent={() =>
                                                <IconContainerGrey
                                                    sx={{
                                                        marginRight: "10px",
                                                        position: "absolute",
                                                        right: 0,
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        zIndex: 0,
                                                    }}
                                                >
                                                    <KeyboardArrowDown />
                                                </IconContainerGrey>
                                            }
                                        >
                                            {
                                                range(century - 99, century + 99).map((year, index) => {
                                                    return (
                                                        <MenuItem key={year + "_" + index} value={year}>{year}</MenuItem>
                                                    )
                                                })}
                                        </StyledSelect>
                                    </FormControl>
                                </Box>
                                <Box
                                    id="datepickerContainer"
                                    sx={{
                                        paddingBottom: "15px",
                                        '& .MuiTypography-root, & .MuiPickersDay-root': {
                                            fontSize: "1rem !important"
                                        },

                                        "& > div": {
                                            minWidth: 230
                                        },
                                        "& > div > div, & > div > div > div, & .MuiCalendarPicker-root": {
                                            width: 230
                                        },
                                        "& .MuiTypography-caption": {
                                            width: 32,
                                            margin: 0
                                        },
                                        "& .PrivatePickersSlideTransition-root": {
                                            minHeight: 32 * 6
                                        },
                                        '& .PrivatePickersSlideTransition-root [role="row"]': {
                                            margin: 0
                                        },
                                        "& .MuiPickersDay-dayWithMargin": {
                                            margin: 0
                                        },
                                        "& .MuiPickersDay-root": {
                                            width: 32,
                                            height: 32
                                        },

                                        "& .MuiCalendarPicker-root": {
                                            margin: 0,
                                        },

                                        "& .MuiCalendarPicker-root > div:first-of-type": {
                                            padding: "0 5px 0 10px",
                                        }
                                    }}

                                >
                                    <LocalizationProvider
                                        dateAdapter={AdapterDateFns}
                                    >
                                        <StaticDateTimePicker
                                            views={['day']}
                                            displayStaticWrapperAs="desktop"
                                            openTo="day"
                                            value={dateValue}
                                            onChange={(newValue) => {
                                                setDateValue(newValue);
                                            }}
                                            onMonthChange={(date) => {
                                                if (date) {
                                                    const tempDate = new Date(date);
                                                    if (tempDate.getMonth() !== monthValue) setMonthValue(tempDate.getMonth());
                                                    if (tempDate.getFullYear() !== yearValue) setYearValue(tempDate.getFullYear());
                                                }
                                                setDateValue(date);
                                            }}
                                            onYearChange={(date) => {
                                                if (date) {
                                                    const tempDate = new Date(date);
                                                    if (tempDate.getFullYear() !== yearValue) setYearValue(tempDate.getFullYear());
                                                }
                                                setDateValue(date);
                                            }}
                                            
                                        />
                                    </LocalizationProvider>
                                </Box>
                                <SidebarDivider />
                                <Box>
                                    <StyledSearchAutoComplete
                                        fetchItems={fetchArtists}
                                        currentItems={currentArtists}
                                        setCurrentItems={setCurrentArtists}
                                        selectedItems={primaryArtist}
                                        setSelectedItems={setPrimaryArtist}
                                        title={genericText("primaryArtist")}
                                        searchPlaceholder={genericText("findArtist")}
                                        singleSelect={true}
                                    />
                                </Box>
                                <SidebarDivider />
                                <Box>
                                    <StyledSearchAutoComplete
                                        fetchItems={fetchArtists}
                                        currentItems={currentSecondaryArtists}
                                        setCurrentItems={setCurrentSecondaryArtists}
                                        selectedItems={secondaryArtist}
                                        setSelectedItems={setSecondaryArtist}
                                        title={genericText("secondaryArtist")}
                                        searchPlaceholder={genericText("findArtists")}
                                    />
                                </Box>
                                <SidebarDivider />
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
                                <Box sx={{ padding: "15px" }}>
                                    <FormControl fullWidth>
                                        {StyledLabel(genericText("rating"))}
                                        <StyledSelect
                                            labelId="select-rating-label"
                                            id="select-rating"
                                            value={ratingValue}
                                            onChange={handleRatingChange}
                                            IconComponent={() =>
                                                <IconContainerGrey
                                                    sx={{
                                                        marginRight: "10px",
                                                        position: "absolute",
                                                        right: 0,
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        zIndex: 0,
                                                    }}
                                                >
                                                    <KeyboardArrowDown />
                                                </IconContainerGrey>
                                            }
                                        >
                                            {
                                                Ratings.map((rating, index) => {
                                                    return (
                                                        <MenuItem key={rating + "_" + index} value={rating}>{rating}</MenuItem>
                                                    )
                                                })
                                            }
                                        </StyledSelect>
                                    </FormControl>
                                    <FormControl fullWidth sx={{ marginBottom: "-9px" }}>
                                        <StyledCheckbox
                                            handleChangeFunction={(e) => handleRatingCheckboxChange(e, "explicit")}
                                            defaultChecked={isExplicit}
                                            label={genericText("explicit")}
                                        />
                                        <StyledCheckbox
                                            handleChangeFunction={(e) => handleRatingCheckboxChange(e, "businessAppropriate")}
                                            defaultChecked={isBusinessAppropriate}
                                            label={genericText("businessAppropriate")}
                                        />
                                    </FormControl>
                                </Box>
                                <SidebarDivider />
                                <Box sx={{ padding: "15px" }}>
                                    <FormControl fullWidth>
                                        {StyledLabel(genericText("version"))}
                                        <StyledSelect
                                            labelId="select-version-label"
                                            id="select-version"
                                            value={versionValue}
                                            onChange={handleVersionChange}
                                            IconComponent={() =>
                                                <IconContainerGrey
                                                    sx={{
                                                        marginRight: "10px",
                                                        position: "absolute",
                                                        right: 0,
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        zIndex: 0,
                                                    }}
                                                >
                                                    <KeyboardArrowDown />
                                                </IconContainerGrey>
                                            }
                                        >
                                            {
                                                Versions.map((version, index) => {
                                                    return (
                                                        <MenuItem key={version + "_" + index} value={version}>{version}</MenuItem>
                                                    )
                                                })
                                            }
                                        </StyledSelect>
                                    </FormControl>
                                </Box>
                                <SidebarDivider />
                                <Box sx={{ padding: "15px 15px 30px" }}>
                                    <FormControl fullWidth>
                                        {StyledLabel(genericText("owner"))}
                                        <StyledSelect
                                            sx={{
                                                zIndex: 1,
                                                '& .MuiSelect-select': {
                                                    zIndex: 1
                                                }
                                            }}
                                            labelId="select-owner-label"
                                            id="select-owner"
                                            value={ownerValue}
                                            onChange={handleOwnerChange}
                                            IconComponent={() =>
                                                <IconContainerGrey
                                                    sx={{
                                                        marginRight: "10px",
                                                        position: "absolute",
                                                        right: 0,
                                                        top: "50%",
                                                        transform: "translateY(-50%)",
                                                        zIndex: 0,
                                                    }}
                                                >
                                                    <KeyboardArrowDown />
                                                </IconContainerGrey>
                                            }
                                        >
                                            {
                                                Owners.map((owner, index) => {
                                                    return (
                                                        <MenuItem key={owner + "_" + index} value={owner}>{owner}</MenuItem>
                                                    )
                                                })
                                            }
                                        </StyledSelect>
                                    </FormControl>
                                </Box>
                            </Box>
                        </Box>
                        :
                        null
                    }
                </Box>
            </Box>
        </StyledActionContainer>
    )
}

export default ActionVideoComponent;