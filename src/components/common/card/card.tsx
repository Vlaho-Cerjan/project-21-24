import { MoreVert } from '@mui/icons-material';
import { Box, Card, CardContent } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import { Artist } from '../../../interfaces/content/artist';
import { Video } from '../../../interfaces/content/video';
import { Playlist } from '../../../interfaces/projectPlayer/playlist';
import { GetRating } from '../../../lib/getRating';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import { DateToYear } from '../../../utility/dateToYear';
import utf8ToB64 from '../../../utility/stringToBase64';
import useDebounce from '../../../utility/useDebounce';
import useWindowSize from '../../../utility/windowSize';
import { CoreBg } from '../../core/coreBackground';
import StyledDropdownIconOnly from '../inputs/dropdownIconOnly';
import PlayButton from '../mediaComponents/buttons/playButton';
import Link from '../navigation/Link';
import { TextBlack10, TextBlack12, TextMedium12, TextMedium14 } from '../styledText/styledText';

interface CardProps {
    item: Video | Artist | Playlist,
    dropdownItems: {
        text: string;
        icon?: React.ReactNode;
        href?: string;
        addHrefId?: boolean;
        function?: any;
        addFunctionId?: boolean;
    }[],
    editFunction?: (id: string) => void,
    editHref?: string,
    setItemId: React.Dispatch<React.SetStateAction<string | null>>,
    aspectRatio?: number
}

/*
<Card
    src="https://media.project-api.tv/api/stream/fd919380-dd77-11eb-b856-35e5097ccc20/?mode=mp4&profile=1300"
    alt="Placeholder"
    rating="TV-MA"
    title="Break My Heart"
    artist="Dua Lipa"
    year="2020"
    licensor="WARNER MUSIC"
/>
*/

const CardComponent = ({ editHref, editFunction, item, dropdownItems, setItemId, aspectRatio }: CardProps) => {
    const imageContainerRef = React.useRef<HTMLImageElement>(null);
    const [imageContainerHeight, setImageContainerHeight] = React.useState(0);
    const actualDropdownItems = dropdownItems.map(tempItem => {
        if (tempItem.href) {
            return {
                ...tempItem,
                href: tempItem.href + (tempItem.addHrefId ? `/${item.id}` : '')
            }
        } else {
            return tempItem;
        }
    })
    const { theme } = React.useContext(AccessibilityContext);
    const { width } = useWindowSize();
    const debouncedWidth = useDebounce(width, 1);

    React.useEffect((): any => {
        if (typeof imageContainerRef !== "undefined" && imageContainerRef.current) {
            const width = imageContainerRef.current.clientWidth;
            setImageContainerHeight(width / (typeof aspectRatio !== "undefined" ? aspectRatio : (16 / 9)));
            //if(!file){
            //   const height = (width / (typeof aspectRatio !== "undefined"?aspectRatio:(16/9)));
            //    setFile("https://via.placeholder.com/"+width+"x"+height+".png");
            //}
        }
    }, [imageContainerRef, aspectRatio, debouncedWidth])

    const getCard = () => {
        return (
            <Card
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "none !important",
                    backgroundImage: "none !important",
                    border: "2px solid transparent",

                    '&:hover': {
                        border: "2px solid " + ("active" in item ? ("active" in item && item.active ? theme.palette.primary.main : theme.palette.grey[500]) : theme.palette.primary.main),
                    }
                }}
            >
                <Box
                    ref={imageContainerRef}
                    sx={{
                        opacity: ("active" in item && !item.active) ? 0.3 : 1,
                        pointerEvents: ("active" in item ? ("active" in item && item.active) ? "initial" : "none" : "initial"),
                        height: imageContainerHeight,
                        aspectRatio: aspectRatio ? aspectRatio.toString() : "16 / 9",
                        position: "relative", '& video': { objectFit: "cover" }
                    }}
                >
                    <Box
                        sx={{
                            width: "100%",
                            height: imageContainerHeight,
                            position: "relative",
                        }}
                    >
                        <Image
                            src={process.env.NEXT_PUBLIC_MEDIA_API_URL + "image/" + item.id + "/image.jpg/?height=" + imageContainerHeight * 2 + "&cache=" + ("updated_at" in item ? utf8ToB64(item.updated_at) : "")}
                            fill
                            alt="Placeholder"
                            style={{
                                objectFit: "cover",
                                objectPosition: "center",
                            }}
                        />
                    </Box>
                    {("rating" in item) ?
                        <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
                            <PlayButton onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                setItemId(item.id);
                            }} />
                        </Box>
                        : null}
                    {"rating" in item || "max_rating" in item ?
                        <Box sx={{ position: "absolute", bottom: "15px", right: "15px" }}>
                            {"rating" in item ? GetRating(item.rating, true) : GetRating(item.max_rating, true)}
                        </Box>
                        : null}
                </Box>
                <CardContent sx={{ padding: "22px 15px 25px 25px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <TextMedium14
                        text={"title" in item ? item.title : item.name}
                        containerSx={{
                            lineHeight: "17px",
                            paddingBottom: "7px",
                            opacity: ("active" in item && !item.active) ? 0.3 : 1,
                            pointerEvents: ("active" in item && !item.active) ? "none" : "undefined",
                        }}
                    />
                    {("artist_source" in item || "description" in item) ?
                        <TextMedium12
                            text={"artist_source" in item ? item.artist_source :
                                "description" in item ? item.description : null}
                            containerSx={{
                                lineHeight: "17px",
                                paddingBottom: "15px",
                                marginBottom: "auto",
                                opacity: ("active" in item && !item.active) ? 0.3 : 1,
                                pointerEvents: ("active" in item && !item.active) ? "none" : undefined,
                            }}
                            textProps={{
                                sx: {
                                    color: "text.secondary"
                                }
                            }}
                        />
                        : null}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        {"release_date" in item ?
                            <TextBlack10
                                text={DateToYear(item.release_date) + " / " + item.licensor_provider}
                                containerSx={{
                                    lineHeight: "12px",
                                }}
                                textProps={{
                                    sx: {
                                        color: "text.secondary"
                                    }
                                }}
                            />
                            :
                            "type" in item ?
                                <TextBlack12
                                    text={item.type.toUpperCase()}
                                    containerSx={{
                                        lineHeight: "15px",
                                        opacity: ("active" in item && !item.active) ? 0.3 : 1, pointerEvents: ("active" in item && !item.active) ? "none" : undefined,
                                    }}
                                    textProps={{
                                        sx: {
                                            color: "text.secondary"
                                        }
                                    }}
                                />
                                : "genre" in item ?
                                    <Box sx={{
                                        fontSize: "12px",
                                        lineHeight: "15px",
                                    }}>
                                        {item.genre.genre.map(
                                            (tempItem, index) => {
                                                return (
                                                    <span key={index} style={{ fontSize: "1em", lineHeight: "inherit" }} >
                                                        {tempItem}
                                                        {index === item.genre.genre.length - 1 ? null : ", "}
                                                    </span>
                                                )
                                            }
                                        )}
                                    </Box>
                                    : null
                        }
                        <StyledDropdownIconOnly
                            id={item.id}
                            buttonId={"dropdownButton_" + item.id}
                            icon={<MoreVert />}
                            dropdownId={"dropdown_" + item.id}
                            dropdownMenuItems={actualDropdownItems}
                        />
                    </Box>
                </CardContent>
            </Card>
        )
    }

    return (
        <CoreBg sx={{ p: 0, height: "100%" }}>
            {editHref ?
                <Link
                    href={editHref + "/" + item.id}
                    onClick={() => {
                        if (editFunction) {
                            editFunction(item.id);
                        }
                    }}
                    sx={{
                        textDecoration: 'none',
                    }}
                >
                    {getCard()}
                </Link>
                : null}
            {editFunction ?
                <Box
                    sx={{
                        minWidth: "auto",
                        padding: 0,
                        margin: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        textAlign: "left",
                        cursor: "pointer",
                    }}
                    onClick={() => {
                        editFunction(item.id);
                    }}
                >
                    {getCard()}
                </Box>
                : null
            }
        </CoreBg>
    )
}

export default CardComponent;