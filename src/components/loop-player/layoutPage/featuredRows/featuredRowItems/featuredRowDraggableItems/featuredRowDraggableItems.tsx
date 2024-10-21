import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';
import { Box } from "@mui/material";
import { SetStateAction } from "react";
import { RowItem } from "../../../../../../interfaces/projectPlayer/rowItem";
import useTranslation from "../../../../../../utility/useTranslation";
import { DragHandle } from "../../../../../common/dragHandle/dragHandle";
import { RowBgGray, RowBgWhite } from "../../../../../common/rowBackgrounds/rowBackgrounds";
import { ItemContainerBox } from "../../../styledComponents/rowsStyledComponents";
import FeaturedRowContent from "../../featuredRowsContent";
import { FeaturedRowsStrings } from "../../lang/featuredRowsStrings";
import FeaturedRowItems from "../featuredRowItems";

interface FeaturedRowDraggableItemsProps {
    id: string;
    rowsProp: {
        id: string;
        title?: string | undefined;
        items: RowItem[];
        type: string;
        locked: string | null;
    }[];
    item: {
        id: string;
        title?: string;
        items: RowItem[];
        type: string;
        locked: string | null;
    },
    index: number,
    lockedItem?: { id: string, locked: boolean, lockedBy: string },
    isItemLocked: {
        id: string;
        locked: boolean;
        lockedBy: string;
    }[],
    handleItemLock: (id: string, type?: "lock" | "unlock") => Promise<false | "locked" | "unlocked" | undefined>,
    handleTimeExtend: (id: string) => void,
    handleEditClick: (id: string, title: string) => void,
    handleAddItemToRow: (id: string) => void,
    setDeleteId: (id: string) => void,
    setDeleteType: (type: string) => void,
    setDeleteTitle: (title: string) => void,
    setDeletePromptOpen: (open: boolean) => void,
    setRowsProps: (value: SetStateAction<{
        id: string;
        title?: string | undefined;
        items: RowItem[];
        type: string;
        locked: string | null;
    }[] | null>) => void,
    fetchData: () => void,
    isSlideAdded: boolean,
    setIsSlideAdded: React.Dispatch<React.SetStateAction<boolean>>,
    handleCategoryChange: (id: string, category: string) => void,
}
const FeaturedRowDraggableItems = ({
    id,
    rowsProp,
    item,
    index,
    isItemLocked,
    lockedItem,
    handleItemLock,
    handleTimeExtend,
    handleEditClick,
    handleAddItemToRow,
    setDeleteId,
    setDeleteType,
    setDeleteTitle,
    setDeletePromptOpen,
    setRowsProps,
    fetchData,
    isSlideAdded,
    setIsSlideAdded,
    handleCategoryChange,
}: FeaturedRowDraggableItemsProps) => {
    const { t } = useTranslation(FeaturedRowsStrings);

    const {
        attributes,
        isDragging,
        listeners,
        transform,
        transition,
        setNodeRef } = useSortable({
            id: id,
        });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition,
        position: 'relative' as const,
        zIndex: isDragging ? 100 : undefined,
        opacity: isDragging ? 0.4 : undefined,
    };

    return (
        <Box>
            {!(index % 2) ?
                <RowBgWhite
                    ref={setNodeRef}
                    style={style}
                >
                    <ItemContainerBox>
                        {rowsProp && rowsProp.length > 1
                            ?
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
                                <DragHandle
                                    {...attributes}
                                    {...listeners}
                                />
                            </Box>
                            :
                            null
                        }
                        <FeaturedRowContent
                            item={item}
                            index={index}
                            isItemLocked={lockedItem}
                            handleItemLock={handleItemLock}
                            handleTimeExtend={handleTimeExtend}
                            handleEditClick={handleEditClick}
                            editRowTitle={t("editRowTitle")}
                            handleAddItemToRow={handleAddItemToRow}
                            addItemText={t("addItem")}
                            setDeleteId={setDeleteId}
                            setDeleteType={setDeleteType}
                            setDeleteTitle={setDeleteTitle}
                            setDeletePromptOpen={setDeletePromptOpen}
                            clearRowText={t("clearRow")}
                            deleteRowText={t("deleteRow")}
                            handleCategoryChange={handleCategoryChange}
                        />
                        <FeaturedRowItems
                            slideItems={item.items}
                            itemId={item.id}
                            items={rowsProp}
                            index={index}
                            setItems={setRowsProps}
                            fetchData={fetchData}
                            isSlideAdded={isSlideAdded}
                            setIsSlideAdded={setIsSlideAdded}
                            isItemLocked={isItemLocked}
                            handleItemLock={handleItemLock}
                        />
                    </ItemContainerBox>
                </RowBgWhite>
                :
                <RowBgGray
                    ref={setNodeRef}
                    style={style}
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
                            <DragHandle
                                {...attributes}
                                {...listeners}
                            />
                        </Box>
                        <FeaturedRowContent
                            item={item}
                            index={index}
                            isItemLocked={lockedItem}
                            handleItemLock={handleItemLock}
                            handleTimeExtend={handleTimeExtend}
                            handleEditClick={handleEditClick}
                            editRowTitle={t("editRowTitle")}
                            handleAddItemToRow={handleAddItemToRow}
                            addItemText={t("addItem")}
                            setDeleteId={setDeleteId}
                            setDeleteType={setDeleteType}
                            setDeleteTitle={setDeleteTitle}
                            setDeletePromptOpen={setDeletePromptOpen}
                            clearRowText={t("clearRow")}
                            deleteRowText={t("deleteRow")}
                            handleCategoryChange={handleCategoryChange}
                        />
                        <FeaturedRowItems
                            slideItems={item.items}
                            itemId={item.id}
                            items={rowsProp}
                            index={index}
                            setItems={setRowsProps}
                            fetchData={fetchData}
                            isSlideAdded={isSlideAdded}
                            setIsSlideAdded={setIsSlideAdded}
                            isItemLocked={isItemLocked}
                            handleItemLock={handleItemLock}
                        />
                    </ItemContainerBox>
                </RowBgGray>
            }
        </Box>
    )
}

export default FeaturedRowDraggableItems;