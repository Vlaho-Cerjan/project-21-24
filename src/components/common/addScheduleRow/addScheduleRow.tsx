import { Box, Button, Radio, styled } from '@mui/material';
import Image from "next/image";
import { Schedule } from '../../../interfaces/projectPlayer/schedule';
import { GetRating } from '../../../lib/getRating';
import SecondsToHours from '../../../utility/secondsToHours';
import utf8ToB64 from '../../../utility/stringToBase64';
import useTranslation from '../../../utility/useTranslation';
import { TextBlack12, TextMedium14 } from '../styledText/styledText';
import { addScheduleRowLangs } from './lang/addScheduleRowLangs';

interface AddScheduleRowProps {
    schedule: Schedule,
    selectedValue: string;
    setSelectedValue: (value: string) => void;
    setSelectedItem: (item: Schedule) => void;
    required?: boolean;
}

const StyledContainer = styled(Button)(({ theme }) => ({
    minWidth: 0,
    padding: "8px 16px",
    display: "flex",
    alignItems: "center",
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

const AddScheduleRow = ({ schedule, selectedValue, setSelectedValue, setSelectedItem, required }: AddScheduleRowProps) => {
    const { t } = useTranslation(addScheduleRowLangs);

    const handleChange = () => {
        //if(selectedValue === id) setSelectedValue("");
        //else setSelectedValue(id);
        setSelectedValue(schedule.id);
        setSelectedItem(schedule);
    };

    const imgUrl = typeof schedule.image === "string" ? schedule.image : process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + schedule.id + "/image.jpg?width=156&height=88&cache=" + utf8ToB64(schedule.updated_at);

    return (
        <StyledContainer onClick={handleChange}>
            <Radio
                required={typeof required !== "undefined" ? required : true}
                sx={{ mr: "16px" }}
                checked={selectedValue === schedule.id}
                value={schedule.id}
                name="add-schedule-radio-button"
            />
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
            <TextMedium14
                text={schedule.name}
                containerSx={{
                    lineHeight: "17px"
                }}
            />
            {typeof schedule.duration !== "undefined" && typeof schedule.max_rating !== "undefined" ?
                <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "flex-end", fontSize: "14px", lineHeight: "17px" }}>
                    <TextMedium14
                        text={SecondsToHours(schedule.duration)}
                        containerSx={{
                            marginRight: "25px"
                        }}
                    />
                    {(schedule.max_rating) ? GetRating(schedule.max_rating.toUpperCase()) : null}
                </Box>
                :
                <Box sx={{ display: "flex", flexGrow: 1, alignItems: "center", justifyContent: "flex-end", fontSize: "14px", lineHeight: "17px" }}>
                    <TextBlack12
                        text={schedule.active ? t("active") : t("inactive")}
                        containerSx={{
                            marginRight: "25px"
                        }}
                        textProps={{
                            sx: {
                                textTransform: "uppercase",
                                padding: "4px 8px",
                                borderRadius: "4px",
                                backgroundColor: schedule.active ? "success.main" : "error.main",
                                color: schedule.active ? "success.contrastText" : "error.contrastText"
                            }
                        }}
                    />
                </Box>
            }
        </StyledContainer>
    )
}

export default AddScheduleRow;