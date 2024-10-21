import { Box } from "@mui/material";
import { useContext } from "react";
import { RowItem } from "../../../../../../interfaces/projectPlayer/rowItem";
import { AccessibilityContext } from "../../../../../../store/providers/accessibilityProvider";
import { DragHandle } from "../../../../../common/dragHandle/dragHandle";
import { RowBgWhite } from "../../../../../common/rowBackgrounds/rowBackgrounds";
import { TextMedium16 } from "../../../../../common/styledText/styledText";
import { ItemContainerBox } from "../../../styledComponents/rowsStyledComponents";

interface FeaturedRowDragOverlayItemProps {
    id: string;
    item: {
        id: string;
        title?: string;
        items: RowItem[];
        locked: string | null;
    }
}
const FeaturedRowDragOverlayItem = ({
    id,
    item
}: FeaturedRowDragOverlayItemProps) => {
    const { theme } = useContext(AccessibilityContext);

    return (
        <Box>
            <RowBgWhite
            >
                <ItemContainerBox>
                    <Box
                        sx={{
                            textAlign: "center",
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            width: "60px",
                            cursor: "grab",
                        }}
                    >
                        <DragHandle />
                    </Box>
                    <Box
                        sx={{
                            padding: "0 40px",

                            [theme.breakpoints.down("lg")]: {
                                padding: "0 30px",
                            },

                            [theme.breakpoints.down("md")]: {
                                padding: "0 20px",
                            }
                        }}
                    >
                        <TextMedium16
                            text={item.title ? item.title : ""}
                        />
                    </Box>
                </ItemContainerBox>
            </RowBgWhite>
        </Box>
    )
}

export default FeaturedRowDragOverlayItem;