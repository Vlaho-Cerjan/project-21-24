import { FilterAltOutlined, ArrowBack, ArrowForward, Cancel } from "@mui/icons-material";
import { Box, Skeleton } from "@mui/material"
import { ItemsContainerBox, ItemsHeaderBox, ItemsHeaderTitleBox, VideosHeaderActionBox, StyledGridContainer, StyledGridItem, ItemsFooterBox, VideosFooterActionBox } from "../styledComponents/styledComponents"
import StyledCard from "../card/card"
import { StyledButton } from "../buttons/styledButton"
import { IconContainerGrey } from "../iconContainer/iconContainer"
import StyledPageTitle from "../pageTitle/pageTitle"
import { StyledText } from "../styledText/styledText"
import { GridArrow } from "./arrowComponent"
import useTranslation from '../../../utility/useTranslation';
import { GenericText } from '../../../lang/common/genericText';
import { AccessibilityContext } from "../../../store/providers/accessibilityProvider";
import React from "react"
import useWindowSize from '../../../utility/windowSize';
import { GetLimit } from "../../../lib/getLimit"
import useDebounce from "../../../utility/useDebounce"
import { StyledChip } from "../chip/styledChip";

interface StyledGridProps {
    pageTitle: string,
    totalItems: number,
    limit: number | null,
    offset: number,
    setOffset: React.Dispatch<React.SetStateAction<number>>,
    setLimit: React.Dispatch<React.SetStateAction<number | null>>,
    items: any[],
    itemsLoading: boolean,
    setOpenFilters: React.Dispatch<React.SetStateAction<boolean>>,
    setArrowClicked: React.Dispatch<React.SetStateAction<boolean>>,
    dropdownItems: {
        text: string;
        icon?: React.ReactNode;
        href?: string | undefined;
        addHrefId?: boolean;
        function?: ((id?: string) => void | Promise<void>) | undefined;
        addFunctionId?: boolean;
    }[],
    nonActiveDropdownItems?: {
        text: string;
        icon?: React.ReactNode;
        href?: string | undefined;
        addHrefId?: boolean;
        function?: (() => void | Promise<void>) | undefined;
        addFunctionId?: boolean;
    }[],
    setItemId: React.Dispatch<React.SetStateAction<string | null>>,
    activeFilters?: string[],
    handleFilterDelete?: (id: string) => void,
    editHref?: string,
    editFunction?: (id: string) => void,
}

const StyledGrid = ({editHref, editFunction, pageTitle, totalItems, limit, setLimit, offset, setOffset, items, itemsLoading, setOpenFilters, dropdownItems, nonActiveDropdownItems, setArrowClicked, setItemId, activeFilters, handleFilterDelete }: StyledGridProps) => {
    const genericText = useTranslation(GenericText).t;
    const { theme } = React.useContext(AccessibilityContext);
    const { width } = useWindowSize();
    const [gridItemMaxWidth, setGridItemMaxWidth] = React.useState("33.33%");
    const debouncedWidth = useDebounce(width, 300);

    React.useEffect(() => {
        const FetchLimit = () => {
            const tempLimit = GetLimit(width, limit, gridItemMaxWidth, setGridItemMaxWidth);
            if (tempLimit) setLimit(tempLimit);
        }

        if (width) FetchLimit();
    }, [debouncedWidth]);

    return (
        <ItemsContainerBox>
            <ItemsHeaderBox>
                <ItemsHeaderTitleBox>
                    <StyledPageTitle
                        title={pageTitle}
                        results={totalItems.toLocaleString()}
                    />
                </ItemsHeaderTitleBox>
                <VideosHeaderActionBox>
                    {width < theme.breakpoints.values.md ?
                        <Box sx={{ marginRight: "16px" }}>
                            <StyledButton onClick={() => setOpenFilters(true)} variant="contained" sx={{ padding: width > 450 ? "6px 6px 6px 12px" : "6px" }}>
                                {width > 450 ? <StyledText text={genericText("filters")} sx={{ fontSize: "17px", marginRight: "4px" }} />
                                    : null}
                                <IconContainerGrey>
                                    <FilterAltOutlined />
                                </IconContainerGrey>
                            </StyledButton>
                        </Box>
                        :
                        null}
                    <Box sx={{ position: "relative" }}>
                        <GridArrow
                            disabled={offset === 0}
                            onClick={() => { setArrowClicked(true); if (limit) setOffset((offset - limit) < 0 ? 0 : offset - limit); }}
                        >
                            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                                <ArrowBack />
                            </IconContainerGrey>
                        </GridArrow>
                        <GridArrow
                            disabled={limit ? offset + limit >= totalItems : false}
                            onClick={() => { setArrowClicked(true); if (limit) setOffset((offset + limit) > totalItems ? offset : offset + limit); }}
                        >
                            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                                <ArrowForward />
                            </IconContainerGrey>
                        </GridArrow>
                    </Box>
                </VideosHeaderActionBox>
            </ItemsHeaderBox>
            {typeof activeFilters !== "undefined" && typeof handleFilterDelete !== "undefined" && activeFilters.length > 0 ?
                <Box
                    sx={{
                        paddingTop: "16px"
                    }}
                >
                    {
                        activeFilters.map(id => {
                            return (
                                <StyledChip deleteIcon={<Cancel sx={{ fontSize: "19px !important", backgroundColor: theme.palette.primary.contrastText, borderRadius: "50%" }} />} key={id} id={id} label={id} onDelete={() => handleFilterDelete(id)} />
                            )
                        })
                    }
                </Box>
                : null}
            <Box>
                {(typeof items !== "undefined" && !itemsLoading) ?
                    <StyledGridContainer
                        container
                        spacing={2}
                    >
                        {items.map(item => (
                            <StyledGridItem
                                item
                                maxWidth={gridItemMaxWidth + " !important"}
                                key={item.id}>
                                <StyledCard
                                    item={item}
                                    setItemId={setItemId}
                                    editHref={editHref}
                                    editFunction={editFunction}
                                    dropdownItems={("active" in item && item.active) ? dropdownItems : (typeof nonActiveDropdownItems !== "undefined") ? nonActiveDropdownItems : dropdownItems}
                                />
                            </StyledGridItem>
                        ))}
                    </StyledGridContainer>
                    :
                    <StyledGridContainer
                        container
                        spacing={2}
                    >
                        {limit ? [...Array(limit)].map((_, i) => {
                            return (
                                <StyledGridItem
                                    key={"skeletonGridItem_" + i}
                                    item
                                    width={"100%"}
                                    maxWidth={gridItemMaxWidth + " !important"}
                                >
                                    <Skeleton variant="rectangular" sx={{ borderRadius: "16px", width: "100%", height: "250px" }} />
                                </StyledGridItem>
                            )
                        }) : null}
                    </StyledGridContainer>
                }
            </Box>
            <ItemsFooterBox>
                <VideosFooterActionBox>
                    {width < theme.breakpoints.values.md ?
                        <Box sx={{ marginRight: "16px" }}>
                            <StyledButton onClick={() => setOpenFilters(true)} variant="contained" sx={{ padding: width > 450 ? "6px 6px 6px 12px" : "6px" }}>
                                {width > 450 ? <StyledText text={genericText("filters")} sx={{ fontSize: "17px", marginRight: "4px" }} />
                                    : null}
                                <IconContainerGrey>
                                    <FilterAltOutlined />
                                </IconContainerGrey>
                            </StyledButton>
                        </Box>
                        :
                        null}
                    <Box sx={{ position: "relative" }}>
                        <GridArrow
                            disabled={offset === 0}
                            onClick={() => { setArrowClicked(true); if (limit) setOffset((offset - limit) < 0 ? 0 : offset - limit); }}
                            variant="contained"
                        >
                            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                                <ArrowBack />
                            </IconContainerGrey>
                        </GridArrow>
                        <GridArrow
                            disabled={limit ? offset + limit >= totalItems : false}
                            onClick={() => { setArrowClicked(true); if (limit) setOffset((offset + limit) > totalItems ? offset : offset + limit); }}
                            variant="contained"
                        >
                            <IconContainerGrey className="darker" sx={{ fontSize: "24px" }}>
                                <ArrowForward />
                            </IconContainerGrey>
                        </GridArrow>
                    </Box>
                </VideosFooterActionBox>
            </ItemsFooterBox>
        </ItemsContainerBox>
    )
}

export default StyledGrid;