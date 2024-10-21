import { Box, Button, Radio, styled } from '@mui/material';
import Image from "next/image";
import { Mixer } from '../../../interfaces/projectPlayer/mixer';
import { Playlist } from '../../../interfaces/projectPlayer/playlist';
import { Schedule } from '../../../interfaces/projectPlayer/schedule';
import { GetRating } from '../../../lib/getRating';
import SecondsToHours from '../../../utility/secondsToHours';
import utf8ToB64 from '../../../utility/stringToBase64';
import useTranslation from '../../../utility/useTranslation';
import { addScheduleRowLangs } from '../addScheduleRow/lang/addScheduleRowLangs';
import { TextBlack12, TextMedium14 } from '../styledText/styledText';

interface AddPlaylistRowProps {
    playlist: Playlist | Schedule | Mixer,
    selectedValue: string;
    setSelectedValue: (value: string) => void;
    setSelectedItem: (item: Playlist | Schedule | Mixer) => void;
    required?: boolean;
}

const StyledContainer = styled(Button)(({ theme }) => ({
    minWidth: 0,
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    borderRadius: 0,
    color: theme.palette.text.primary,
    textTransform: "none",
    boxShadow: "none !important",

    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.default : "rgba(0,0,32,0.08)",
    }
}))

const StyledImageContainer = styled(Box)(() => ({
    width: "100%",
    maxWidth: "78px",
    height: "44px",
    borderRadius: "8px",
    position: "relative",
    marginRight: "25px",

    "& img": {
        borderRadius: "8px",
    }
}))

const AddPlaylistRow = ({ playlist, selectedValue, setSelectedValue, setSelectedItem, required }: AddPlaylistRowProps) => {
    const { t } = useTranslation(addScheduleRowLangs);

    const handleChange = () => {
        if (selectedValue === playlist.id) return;
        //else setSelectedValue(id);
        setSelectedValue(playlist.id);
        setSelectedItem(playlist);
    };
    const imgUrl = typeof playlist.image === "undefined" ? "" : typeof playlist.image === "string" ? playlist.image : process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + playlist.id + "/image.jpg?width=156&height=88&cache=" + utf8ToB64(playlist?.updated_at ? playlist.updated_at : "");
    return (
        <StyledContainer onClick={handleChange}>
            <Radio
                required={typeof required !== "undefined" ? required : true}
                sx={{ mr: "16px" }}
                checked={selectedValue === playlist.id}
                value={playlist.id}
                name="add-playlist-radio-button"
            />
            {imgUrl !== "" ?
                <StyledImageContainer>
                    <Image
                        src={imgUrl}
                        alt={"placeholder"}
                        style={{
                            objectFit: "cover",
                        }}
                        width={78}
                        height={44}
                    />
                </StyledImageContainer>
                :
                null
            }
            <TextMedium14
                text={playlist.name}
                containerSx={{
                    lineHeight: "17px"
                }}
            />
            {typeof playlist.duration !== "undefined" && typeof playlist.max_rating !== "undefined" ?
                <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "flex-end", fontSize: "14px", lineHeight: "17px" }}>
                    <TextMedium14
                        text={SecondsToHours(playlist.duration)}
                        containerSx={{
                            marginRight: "25px"
                        }}
                    />
                    {(playlist.max_rating) ? GetRating(playlist.max_rating.toUpperCase()) : null}
                </Box>
                :
                typeof playlist.active !== "undefined" ?
                    <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "flex-end", fontSize: "14px", lineHeight: "17px" }}>
                        <TextBlack12
                            text={playlist.active ? t("active") : t("inactive")}
                            containerSx={{
                                marginRight: "25px"
                            }}
                            textProps={{
                                sx: {
                                    textTransform: "uppercase",
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    backgroundColor: playlist.active ? "success.main" : "error.main",
                                    color: playlist.active ? "success.contrastText" : "error.contrastText"
                                }
                            }}
                        />
                    </Box>
                    :
                    null

            }
        </StyledContainer>
    )
}

export default AddPlaylistRow;