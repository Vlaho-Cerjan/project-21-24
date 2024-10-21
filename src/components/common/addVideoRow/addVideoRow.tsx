import { MoreVert } from '@mui/icons-material';
import { Box, Radio, styled } from '@mui/material';
import Image from "next/image";
import React from "react";
import { Video } from '../../../interfaces/content/video';
import { GetRating } from '../../../lib/getRating';
import StyledDropdownIconOnly from '../inputs/dropdownIconOnly';
import { TextMedium14 } from '../styledText/styledText';

interface AddVideoRowProps {
    video: Video,
    required?: boolean;
    selectedValue: string | null;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    dropdownMenuItems: {
        text: string;
        icon?: React.ReactNode;
        href?: string;
        function?: any;
        addFunctionId?: boolean;
    }[];
}

const StyledContainer = styled(Box)(({theme}) => ({
    minWidth: 0,
    padding: "8px 15px 8px 25px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 0,
    color: theme.palette.text.primary,
    textTransform: "none",
    boxShadow: "none !important",

    '&:not(last-of-type)':{
        borderBottom: "2px solid "+theme.palette.divider,
    },

    '& > div': { paddingRight: "4px", paddingLeft: "4px" }
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
    },

}))

const AddVideoRow = ({video, required, selectedValue, handleChange, dropdownMenuItems}: AddVideoRowProps) => {
    return (
        <StyledContainer>
            <Box sx={{ display: "flex", alignItems: "center", width: "30%" }}>
                <StyledImageContainer>
                    <Image
                        src={process.env.NEXT_PUBLIC_MEDIA_API_URL+"image/"+video.id+"/image.jpg?width=156&height=88"}
                        alt={"placeholder"}
                        width={78}
                        height={44}
                        style={{
                            objectFit: "cover",
                        }}
                    />
                </StyledImageContainer>
                <TextMedium14
                    text={video.title}
                    containerSx={{
                        lineHeight: "16px",
                    }}
                />
            </Box>
            <TextMedium14
                text={video.artist_source}
                containerSx={{
                    lineHeight: "16px",
                    width: "calc((100% - 30% - 258px)/2)"
                }}
                textProps={{
                    sx: {
                        color: "text.secondary"
                    }
                }}
            />
            <TextMedium14
                text={video.licensor_provider}
                containerSx={{
                    lineHeight: "16px",
                    width: "calc((100% - 30% - 258px)/2)"
                }}
                textProps={{
                    sx: {
                        color: "text.secondary"
                    }
                }}
            />
            <TextMedium14
                text={new Date(video.release_date).toLocaleDateString("en-US", {year: "numeric"})}
                containerSx={{
                    lineHeight: "16px",
                    width: "50px"
                }}
                textProps={{
                    sx: {
                        color: "text.secondary"
                    }
                }}
            />
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <Box sx={{ width: "100px", textAlign: "center" }}>
                    <Radio
                        required={typeof required !== "undefined"? required : true}
                        onChange={handleChange}
                        checked={selectedValue === video.id}
                        value={video.id}
                        name="video-featured-radio-button"
                    />
                </Box>
                <Box sx={{ marginRight: "15px" }}>
                {(video.rating)?GetRating(video.rating.toUpperCase()):null}
                </Box>
                <StyledDropdownIconOnly
                    id={video.id}
                    icon={<MoreVert />}
                    buttonId={video.id}
                    dropdownId={"dropdown-" + video.id}
                    dropdownMenuItems={dropdownMenuItems}
                />
            </Box>
        </StyledContainer>
    )
}

export default AddVideoRow;