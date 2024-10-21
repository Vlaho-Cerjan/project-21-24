import { MoreVert } from '@mui/icons-material';
import { Box, Checkbox, styled } from '@mui/material';
import { Video } from '../../../interfaces/content/video';
import { GetRating } from '../../../lib/getRating';
import Image from "next/image";
import React from "react";
import StyledDropdownIconOnly from '../inputs/dropdownIconOnly';
import { TextMedium14 } from '../styledText/styledText';
import PlayButton from '../mediaComponents/buttons/playButton';

interface AddVideoRowProps {
    video: Video,
    selectedValues: string[];
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    dropdownMenuItems?: {
        text: string;
        icon?: React.ReactNode;
        href?: string;
        function?: any;
        addFunctionId?: boolean;
    }[];
    noEdit?: boolean;
    setItemId?: React.Dispatch<React.SetStateAction<string | null>>;
}

const StyledContainer = styled(Box)(({ theme }) => ({
    minWidth: 0,
    padding: "8px 15px 8px 9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 0,
    color: theme.palette.text.primary,
    textTransform: "none",
    boxShadow: "none !important",

    '&:not(last-of-type)': {
        borderBottom: "2px solid " + theme.palette.divider,
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

const PlaylistRow = ({ setItemId, video, selectedValues, handleChange, dropdownMenuItems, noEdit }: AddVideoRowProps) => {
    return (
        <StyledContainer>
            <Box sx={{ display: "flex", alignItems: "center", width: "35%" }}>
                <Checkbox
                    onChange={handleChange}
                    checked={selectedValues.find(v => v === video.id) !== undefined}
                    value={video.id}
                    name="select-all-videos-radio-button"
                    sx={{ marginRight: "7px" }}
                />
                <StyledImageContainer>
                    <Image
                        src={process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + video.id + "/image.jpg?width=156&height=88"}
                        alt={"placeholder"}
                        width={78}
                        height={44}
                        style={{
                            objectFit: "cover",
                        }}
                    />
                    {
                        typeof setItemId !== "undefined"
                            ?
                            <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                                <PlayButton
                                    sx={{
                                        fontSize: "24px",
                                        width: "34px",
                                        height: "34px",
                                        borderRadius: "50%",
                                    }}
                                    onClick={() => setItemId(video.id)}
                                />
                            </Box>
                            :
                            null
                    }
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
                    width: "calc((100% - 35% - 243px)/2)"
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
                    width: "calc((100% - 35% - 243px)/2)"
                }}
                textProps={{
                    sx: {
                        color: "text.secondary"
                    }
                }}
            />
            <TextMedium14
                text={new Date(video.release_date).toLocaleDateString("en-US", { year: "numeric" })}
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
            <TextMedium14
                text={video.lyrical_content}
                containerSx={{
                    lineHeight: "16px",
                    width: "75px"
                }}
                textProps={{
                    sx: {
                        color: "text.secondary"
                    }
                }}
            />
            {typeof noEdit === "undefined" || !noEdit ?
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                    <Box sx={{ marginRight: "15px" }}>
                        {(video.rating) ? GetRating(video.rating.toUpperCase()) : null}
                    </Box>
                    {dropdownMenuItems ?
                        <StyledDropdownIconOnly
                            id={video.id}
                            icon={<MoreVert />}
                            buttonId={video.id}
                            dropdownId={"dropdown-" + video.id}
                            dropdownMenuItems={dropdownMenuItems}
                        />
                        : null}
                </Box>
                :
                null}
        </StyledContainer>
    )
}

export default PlaylistRow;