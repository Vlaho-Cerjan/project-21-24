import { RemoveNullValues } from '@/utility/removeNullValues';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    closestCenter,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Add } from '@mui/icons-material';
import { Box, Divider } from "@mui/material";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { SetStateAction, useContext, useEffect, useState } from "react";
import { Error } from "../../../../interfaces/error/error";
import { RowItem } from "../../../../interfaces/projectPlayer/rowItem";
import { ExceptionStrings } from '../../../../lang/common/exceptions';
import { RefreshIfLoggedOut } from "../../../../lib/refreshIfLoggedOut";
import { LoadingContext } from "../../../../store/providers/loadingProvider";
import { LockContext } from '../../../../store/providers/lockProvider';
import useTranslation from '../../../../utility/useTranslation';
import StyledButtonWithIcon from '../../../common/buttons/buttonWithIcon';
import StyledDeletePrompt from "../../../common/deletePrompt/deletePrompt";
import LayoutActionComponent from "../../action/layout/layoutActionComponent";
import { AddRowContainer } from "../styledComponents/rowsStyledComponents";
import AddRow from "./addRow/addRow";
import EditRow from "./editRow/editRow";
import FeaturedRowDragOverlayItem from "./featuredRowItems/featuredRowDragOverlayItem/featuredRowDragOverlayItem";
import FeaturedRowDraggableItems from "./featuredRowItems/featuredRowDraggableItems/featuredRowDraggableItems";
import { FeaturedRowsStrings } from './lang/featuredRowsStrings';

interface FeaturedRowProps {
    rowsProp: {
        id: string;
        title?: string;
        items: RowItem[];
        type: string;
        locked: string | null;
    }[];
    setRowsProps: (value: SetStateAction<{
        id: string;
        title?: string;
        items: RowItem[];
        type: string;
        locked: string | null;
    }[] | null>) => void;
}

const FeaturedRows = ({ rowsProp, setRowsProps }: FeaturedRowProps) => {
    const { t } = useTranslation(FeaturedRowsStrings);
    const exception = useTranslation(ExceptionStrings).t;
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const [rows, setRows] = useState<typeof rowsProp>([]);
    const [rowId, setRowId] = useState<string>();
    const [openAddRowItem, setOpenAddRowItem] = useState(false);
    const [addRowOpen, setAddRowOpen] = useState(false);
    const [editOpen, setEditOpen] = useState<boolean>(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState<string | null>(null);
    const [isSlideAdded, setIsSlideAdded] = useState<boolean>(false);
    const [isItemLocked, setIsItemLocked] = useState<{ id: string, locked: boolean, lockedBy: string }[]>(
        rowsProp.map(row => ({ id: row.id, locked: (row.locked !== null) ? true : false, lockedBy: (row.locked !== null) ? row.locked : "" }))
    );

    const [deletePromptOpen, setDeletePromptOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleteType, setDeleteType] = useState<string | null>(null);
    const [deleteTitle, setDeleteTitle] = useState<string | null>(null);

    const { lockEntity } = useContext(LockContext);
    const { setLoading } = useContext(LoadingContext);

    const abortController = new AbortController();

    function fetchData() {
        fetch('/api/project-player/layout', {
            method: "POST",
            body: JSON.stringify({
                action: "layoutRows",
                id: router.query.layoutId,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }
                return Promise.reject(await response.json());
            })
            .then((data) => {
                const tempRows = data.filter((row: any) => row.featured === false)
                setRowsProps(tempRows);
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("noRowItemsFound"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
    }

    async function orderRows(rowIds: string[]) {
        try {
            const response = await fetch('/api/project-player/layout', {
                method: "POST",
                body: JSON.stringify({
                    action: "orderLayout",
                    id: router.query.layoutId,
                    layoutRowIds: rowIds,
                }),
                signal: abortController.signal,
            });

            if (response.ok) {
                enqueueSnackbar(exception('reorderedSuccess'), { variant: 'success' });
                return true;
            }
            return Promise.reject(await response.json());
        }
        catch (err: any) {
            if (abortController.signal.aborted) {
                console.log('The user aborted the request');
            } else {
                console.log(err, 'order error');
                if (err && err.message) RefreshIfLoggedOut(err.message);
                enqueueSnackbar(exception('couldntReorderItems'), { variant: 'error' });
                //console.error('The request failed');
            }
        }
    }

    const deletePromptFunction = (id: string) => {
        if (deleteType) {
            if (deleteType === "delete") {
                deleteRow(id);
            }
            else {
                clearRow(id);
            }
        }
        else enqueueSnackbar(exception("deleteTypeMissing"), { variant: "error" });
    }

    const setTitle = (id: string, title: string) => {
        setLoading(true);
        fetch('/api/project-player/layout/row', {
            method: "POST",
            body: JSON.stringify({
                action: "update",
                id: id,
                title: title
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    fetchData();
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("couldntUpdateRow"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const clearRow = (id: string) => {
        setLoading(true);
        fetch('/api/project-player/layout/row', {
            method: "POST",
            body: JSON.stringify({
                action: "clearLayoutItems",
                id: id,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    fetchData();
                    enqueueSnackbar(exception('clearedRowSuccess'), { variant: 'success' });
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("couldntClearRow"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
                setDeletePromptOpen(false);
            });
    }

    const deleteRow = (id: string) => {
        setLoading(true);
        fetch('/api/project-player/layout/row', {
            method: "POST",
            body: JSON.stringify({
                action: "delete",
                id: id,
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    fetchData();
                    enqueueSnackbar(exception('deletedRowSuccess'), { variant: 'success' });
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("couldntDeleteRow"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
                setDeletePromptOpen(false);
            });
    }

    const addRow = (title: string | undefined, type: string | null) => {
        setLoading(true);
        fetch('/api/project-player/layout/row', {
            method: "POST",
            body: JSON.stringify(RemoveNullValues({
                action: "create",
                layoutId: router.query.layoutId,
                title: title,
                type: type,
            })),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    fetchData();
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("couldntCreateRow"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const handleAddRowClick = () => {
        setAddRowOpen(true);
    }

    const handleEditClick = (id: string, title: string) => {
        setEditTitle(title);
        setEditId(id);
        setEditOpen(true);
    }

    const handleItemLock = async (id: string, type?: "lock" | "unlock") => {
        setLoading(true);
        let apiAction = "";
        if (type === "lock" || type === "unlock") {
            apiAction = type;
        }
        else if (!isItemLocked.find(item => item.id === id)?.locked) apiAction = "lock";
        else apiAction = "unlock";
        if (id) {
            const lockSuccess = await lockEntity("layout_row", id, apiAction);
            if (lockSuccess) {
                if (apiAction === "lock") {
                    setIsItemLocked(isItemLocked.map((item: any) => item.id === id ? { ...item, locked: true, lockedBy: "You" } : item));
                    enqueueSnackbar(exception("rowLockSuccess"), { variant: 'success' });
                    setLoading(false);
                    return "locked";
                } else {
                    setIsItemLocked(isItemLocked.map((item: any) => item.id === id ? { ...item, locked: false, lockedBy: "" } : item));
                    enqueueSnackbar(exception("rowUnlockSuccess"), { variant: 'success' });
                    setLoading(false);
                    return "unlocked";
                }
            }
            else {
                setLoading(false);
                return false;
            }
        }
        else {
            setLoading(false);
            return false;
        }
    }

    const handleTimeExtend = async (id: string) => {
        setLoading(true);
        if (id) {
            const lockSuccess = await lockEntity("layout_row", id, "lock");
            if (lockSuccess) {
                setIsItemLocked(isItemLocked.map((item: any) => item.id === id ? { ...item, remainingTime: 600 } : item));
                enqueueSnackbar(exception("timeExtendSuccess"), { variant: 'success' });
            }
        }
        setLoading(false);
    }

    const handleAddItemToRow = (rowId: string) => {
        setRowId(rowId);
        setOpenAddRowItem(true);
    }

    const handleCategoryChange = (id: string, category: string) => {
        setLoading(true);
        fetch('/api/project-player/layout/row', {
            method: "POST",
            body: JSON.stringify({
                action: "update",
                id: id,
                type: category
            }),
            signal: abortController.signal,
        })
            .then(async (response) => {
                if (response.ok) {
                    fetchData();
                    enqueueSnackbar(exception('updateCategorySuccess'), { variant: 'success' });
                    return true;
                }
                return Promise.reject(await response.json());
            })
            .catch((err: Error) => {
                if (abortController.signal.aborted) {
                    console.log('The user aborted the request');
                } else {
                    RefreshIfLoggedOut(err.message);
                    enqueueSnackbar(exception("couldntUpdateRow"), { variant: "error" });
                    //console.error('The request failed');
                }
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        if (typeof rowsProp !== "undefined" && rowsProp) {
            setIsItemLocked(rowsProp.map((row: any) => {
                // const item = isItemLocked.find(item => item.id === row.id);
                return {
                    id: row.id,
                    locked: row.locked ? true : false,
                    lockedBy: row.locked,
                }
            }));
            setRows(rowsProp);
        }
    }, [rowsProp]);

    /*
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (typeof isItemLocked !== "undefined" && isItemLocked.length > 0 && Object.entries(isItemLocked).find(([key, value]) => value.remainingTime !== null)) {
            timeout = setTimeout(() => {
                setIsItemLocked(isItemLocked.map((item: any) => {
                    if (item.remainingTime !== null && item.remainingTime > 0) {
                        return {
                            ...item,
                            remainingTime: item.remainingTime - 1
                        }
                    } else if (item.remainingTime === 0) {
                        handleItemLock(item.id);
                    }
                    return item;
                }));
            }, 1000);
        }

        return () => {
            clearTimeout(timeout);
        }
    }, [isItemLocked])

    */

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setRows((rows) => {
                if (rows) {
                    const oldIndex = rows.findIndex((item: any) => item.id === active.id);
                    const newIndex = rows.findIndex((item: any) => item.id === over.id);

                    return arrayMove(rows, oldIndex, newIndex);
                }
                return rows;
            });


            setActiveItem(null);

            const oldIndex = rowsProp.findIndex((item: any) => item.id === active.id);
            const newIndex = rowsProp.findIndex((item: any) => item.id === over.id);

            const tempItems = arrayMove([...rowsProp], oldIndex, newIndex);

            const tempRowIds = tempItems.map((row: any) => row.id);

            orderRows(tempRowIds);
        }
        else setActiveItem(null);
    }


    const sensors = useSensors(
        useSensor(MouseSensor, {
            // Require the mouse to move by 1 pixels before activating
            activationConstraint: {
                distance: 1,
            },
        }),
        useSensor(TouchSensor, {
            // Press delay of 100ms, with tolerance of 5px of movement
            activationConstraint: {
                delay: 100,
                tolerance: 1,
            },
        })
    );

    const [activeItem, setActiveItem] = useState<{
        id: string;
        title?: string | undefined;
        items: RowItem[];
        locked: string | null;
    } | undefined | null>(null);

    return (
        <Box
            sx={{
                position: 'relative',
            }}
        >
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
                onDragStart={(event) => {
                    if (event.active) setActiveItem(rows.find((item: any) => item.id === event.active.id));
                }}
            >
                <SortableContext
                    items={rows}
                    strategy={verticalListSortingStrategy}
                >
                    {rows ? rows.map((item, index) => {
                        const lockedItem = isItemLocked.find(temp => temp.id === item.id);
                        return (
                            <FeaturedRowDraggableItems
                                key={item.id}
                                rowsProp={rows}
                                id={item.id}
                                item={item}
                                index={index}
                                isItemLocked={isItemLocked}
                                lockedItem={lockedItem}
                                handleItemLock={handleItemLock}
                                handleAddItemToRow={handleAddItemToRow}
                                handleEditClick={handleEditClick}
                                handleTimeExtend={handleTimeExtend}
                                fetchData={fetchData}
                                setDeleteId={setDeleteId}
                                setIsSlideAdded={setIsSlideAdded}
                                setDeletePromptOpen={setDeletePromptOpen}
                                isSlideAdded={isSlideAdded}
                                setDeleteTitle={setDeleteTitle}
                                setDeleteType={setDeleteType}
                                setRowsProps={setRowsProps}
                                handleCategoryChange={handleCategoryChange}
                            />
                        )
                    })
                        :
                        null
                    }
                </SortableContext>
                <DragOverlay>
                    {activeItem ?
                        <FeaturedRowDragOverlayItem
                            id={activeItem.id+"_dragOverlay"}
                            item={activeItem}
                        />
                        :
                        null
                    }
                </DragOverlay>
            </DndContext>
            <Divider sx={{ borderBottomWidth: "2px" }} />
            <AddRowContainer>
                <StyledButtonWithIcon
                    startIcon={<Add />}
                    buttonText={t("ADD_ROW")}
                    buttonFunction={handleAddRowClick}
                    buttonSx={{
                        '& span': {
                            textTransform: "uppercase",
                        }
                    }}
                />
            </AddRowContainer>
            <LayoutActionComponent
                action="add"
                type="row"
                rowId={rowId}
                open={openAddRowItem}
                setOpen={setOpenAddRowItem}
                fetchRowData={fetchData}
                setIsSlideAdded={setIsSlideAdded}
            />
            <AddRow addRow={addRow} open={addRowOpen} setOpen={setAddRowOpen} items={rowsProp} />
            <EditRow id={editId} title={editTitle} setTitle={setTitle} open={editOpen} setOpen={setEditOpen} items={rowsProp} />
            <StyledDeletePrompt
                open={deletePromptOpen}
                setOpen={setDeletePromptOpen}
                confirmFunction={deletePromptFunction}
                title={deleteTitle ? deleteTitle : undefined}
                cancelFunction={() => setDeletePromptOpen(false)}
                id={deleteId ? deleteId : ""}
            />
        </Box>
    )
}

export default FeaturedRows;