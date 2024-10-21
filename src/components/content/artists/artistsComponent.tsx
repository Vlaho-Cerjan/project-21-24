import { Backdrop, Box } from '@mui/material';
import useTranslation from "../../../utility/useTranslation";
import { ArtistsStrings } from "../lang/artistsStrings";
import React from "react";
import { SidebarBox } from '../../common/sidebarComponents/sidebarBox';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import useWindowSize from '../../../utility/windowSize';
import { EditOutlined, PlaylistPlayOutlined } from '@mui/icons-material';
import { GenericText } from '../../../lang/common/genericText';
import StyledPlayVideoOverlay from '../../common/playVideoOverlay/playVideoOverlay';
import { FixedFilterBox, TopContainerBox, StyledSearchContainer } from '../../common/styledComponents/styledComponents';
import { ExceptionStrings } from '../../../lang/common/exceptions';
import { useSnackbar } from 'notistack';
import StyledGrid from '../../common/gridComponents/styledGrid';
import { Artist } from '../../../interfaces/content/artist';
import { Error } from '../../../interfaces/error/error';
import { RefreshIfLoggedOut } from '../../../lib/refreshIfLoggedOut';
import ContentSidebar from '../../common/contentSidebar/contentSidebar';
import { setSidebarItems } from '../../../utility/setSidebarItems';
import { useAppSelector } from '../../../hooks';

interface ArtistsProps {
    searchResult: string | null;
    setSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArtistsComponent = ({ searchResult, setSearchLoading }: ArtistsProps) => {
    const { t } = useTranslation(ArtistsStrings);
    const genericText = useTranslation(GenericText).t;
    const exception = useTranslation(ExceptionStrings).t;

    const { enumProject } = useAppSelector(state => state.enum);

    const { enqueueSnackbar } = useSnackbar();
    const [offset, setOffset] = React.useState(0);
    const { theme } = React.useContext(AccessibilityContext);
    const { width } = useWindowSize();
    const [openFilters, setOpenFilters] = React.useState(false);

    const [artistsLoading, setArtistsLoading] = React.useState(false);
    const [totalArtists, setTotalArtists] = React.useState(0);
    const [artistId, setArtistId] = React.useState<string | null>(null);
    const [openArtist, setOpenArtist] = React.useState(false);
    const [artists, setArtists] = React.useState<Artist[]>([]);

    const [genres, setGenres] = React.useState<{
        id: string;
        title: string;
    }[]>([]);

    const [decades, setDecades] = React.useState<{
        id: string;
        title: string;
    }[]>([]);

    const [checkedGenres, setCheckedGenres] = React.useState<string[]>([]);
    const [checkedDecades, setCheckedDecades] = React.useState<string[]>([]);
    const [title, setTitle] = React.useState<string>(genericText("artists"));
    const [limit, setLimit] = React.useState<number | null>(null);
    const [arrowClicked, setArrowClicked] = React.useState(false);

    React.useEffect(() => {
        if (enumProject) {
            const tempGenres = enumProject.playlist_genres;

            setSidebarItems(tempGenres, setGenres);

            const tempDecades = enumProject.playlist_decades;

            setSidebarItems(tempDecades, setDecades);
        }
    }, [enumProject]);

    React.useEffect(() => {
        if (artistId) setOpenArtist(true);

        return () => {
            setOpenArtist(false);
        }
    }, [artistId]);

    React.useEffect(() => {
        const FetchData = () => {
            let tempOffset = offset;
            if (!arrowClicked) {
                setOffset(0);
                tempOffset = 0;
            } else {
                setArrowClicked(false);
            }
            if (searchResult) {
                setSearchLoading(true);
                setTitle(searchResult);
            } else {
                setTitle(genericText("artists"));
            }
            if (!limit) return;
            setArtistsLoading(true);

            fetch(
                '/api/content/artists',
                {
                    method: 'POST',
                    body: JSON.stringify({
                        action: 'list',
                        offset: tempOffset,
                        genres: checkedGenres,
                        decades: checkedDecades,
                        limit: limit,
                        search: searchResult ? searchResult : '',
                    }),
                }
            )
                .then(async (response) => {
                    if (response.ok) {
                        return response.json();
                    }
                    return Promise.reject(await response.json());
                })
                .then((data: { total: number, artists: Artist[] }) => {
                    if (data.total === 0) enqueueSnackbar(exception("noResultChangeFilters"), { variant: 'info' });
                    setTotalArtists(data.total);
                    setArtists(data.artists);
                })
                .catch((err: Error) => {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("noArtistsFound"), { variant: "error" });
                    //console.error('The request failed');

                })
                .finally(() => {
                    setArtistsLoading(false);
                    if (searchResult) setSearchLoading(false);
                });
        }

        FetchData();
    }, [offset, searchResult, limit, checkedGenres, checkedDecades]);

    return (
        <TopContainerBox>
            <StyledGrid
                pageTitle={title}
                setArrowClicked={setArrowClicked}
                totalItems={totalArtists}
                limit={limit}
                offset={offset}
                setOffset={setOffset}
                setLimit={setLimit}
                items={artists}
                itemsLoading={artistsLoading}
                setOpenFilters={setOpenFilters}
                editHref="/content/artists/edit"
                dropdownItems={
                    [
                        {
                            text: t("editArtist"),
                            icon: <EditOutlined />,
                            href: "/content/artists/edit",
                            addHrefId: true,
                        },
                        {
                            text: t("addToPlaylist"),
                            icon: <PlaylistPlayOutlined />,
                            function: () => { }
                        }
                    ]
                }
                setItemId={setArtistId}
            />
            {width >= theme.breakpoints.values.md ?
                <SidebarBox>
                    <Box sx={{ paddingBottom: "74px" }}>
                        <StyledSearchContainer>
                            <ContentSidebar
                                checkedList={
                                    [
                                        {
                                            title: genericText("filterGenres"),
                                            items: genres,
                                            lessItemsText: genericText("lessGenres"),
                                            moreItemsText: genericText("moreGenres"),
                                            itemOrder: 0,
                                            checkedItems: checkedGenres,
                                            setCheckedItems: setCheckedGenres,
                                            defaultExpanded: true,
                                        },
                                        {
                                            title: genericText("filterDecades"),
                                            items: decades,
                                            lessItemsText: genericText("lessDecades"),
                                            moreItemsText: genericText("moreDecades"),
                                            itemOrder: 1,
                                            checkedItems: checkedDecades,
                                            setCheckedItems: setCheckedDecades,
                                            defaultExpanded: true,
                                        }
                                    ]
                                }
                            />
                        </StyledSearchContainer>
                    </Box>
                </SidebarBox>
                :
                <FixedFilterBox
                    sx={{
                        visibility: openFilters ? "visible" : "hidden",
                        opacity: openFilters ? 1 : 0,
                        pointerEvents: openFilters ? "all" : "none",
                    }}
                >
                    <SidebarBox sx={{ zIndex: theme.zIndex.drawer + 1003 }}>
                        <ContentSidebar
                            checkedList={
                                [
                                    {
                                        title: genericText("filterGenres"),
                                        items: genres,
                                        lessItemsText: genericText("lessGenres"),
                                        moreItemsText: genericText("moreGenres"),
                                        itemOrder: 0,
                                        checkedItems: checkedGenres,
                                        setCheckedItems: setCheckedGenres,
                                        defaultExpanded: true,
                                    },
                                    {
                                        title: genericText("filterDecades"),
                                        items: decades,
                                        lessItemsText: genericText("lessDecades"),
                                        moreItemsText: genericText("moreDecades"),
                                        itemOrder: 1,
                                        checkedItems: checkedDecades,
                                        setCheckedItems: setCheckedDecades,
                                        defaultExpanded: true,
                                    }
                                ]
                            }
                        />
                    </SidebarBox>
                    <Backdrop
                        open={openFilters}
                        onClick={() => setOpenFilters(false)}
                        sx={{
                            zIndex: theme.zIndex.drawer + 1002,
                        }}
                    />
                </FixedFilterBox>
            }
            <StyledPlayVideoOverlay
                id={artistId}
                setId={setArtistId}
                open={openArtist}
                setOpen={setOpenArtist}
            />
        </TopContainerBox>
    )
}

export default ArtistsComponent;