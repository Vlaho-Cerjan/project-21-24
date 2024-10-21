import useTranslation from '../../../utility/useTranslation';
import { GenericText } from '../../../lang/common/genericText';
import { Box } from '@mui/material';
import { SidebarDivider } from "../../common/sidebarComponents/sidebarDivider";
import React from "react";
import StyledSidebarList from "../../common/sidebarComponents/sidebarList";

interface ArtistsSidebarProps {
    checkedGenres: string[];
    setCheckedGenres: React.Dispatch<React.SetStateAction<string[]>>;
    checkedDecades: string[];
    setCheckedDecades: React.Dispatch<React.SetStateAction<string[]>>;
}

const ArtistsSidebar = ({
    checkedGenres,
    setCheckedGenres,
    checkedDecades,
    setCheckedDecades,
}: ArtistsSidebarProps) => {
    const genericText = useTranslation(GenericText).t;

    return (
        <Box sx={{ padding: "15px 0" }}>
            <Box>
                <StyledSidebarList
                    title={genericText("filterGenres")}
                    items={[
                        {
                            id: "1",
                            title: "Genre 1"
                        },
                        {
                            id: "2",
                            title: "Genre 2"
                        },
                        {
                            id: "3",
                            title: "Genre 3"
                        },
                        {
                            id: "4",
                            title: "Genre 4"
                        },
                        {
                            id: "5",
                            title: "Genre 5"
                        }
                    ]}
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
                    title={genericText("filterDecades")}
                    items={[
                        {
                            id: "1",
                            title: "Decades 1"
                        },
                        {
                            id: "2",
                            title: "Decades 2"
                        },
                        {
                            id: "3",
                            title: "Decades 3"
                        },
                        {
                            id: "4",
                            title: "Decades 4"
                        },
                        {
                            id: "5",
                            title: "Decades 5"
                        }
                    ]}
                    lessItemsText={genericText("lessDecades")}
                    moreItemsText={genericText("moreDecades")}
                    checkedItems={checkedDecades}
                    setCheckedItems={setCheckedDecades}
                    defaultExpanded={true}
                />
            </Box>
        </Box>
    )
}

export default ArtistsSidebar;