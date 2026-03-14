import { Box, IconButton } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useFilterStore } from "../JournalStores/filter-store";
import { useStickToBottom } from "use-stick-to-bottom";
import { NoData } from "@/components/NoData";
import { useJournalStream } from "../JournalStores/journal-stream-store";
import { useCreateTable } from "../hooks/useCreateTable";
import { LuArrowDown, LuCheckCheck } from "react-icons/lu";
import { flexRender } from "@tanstack/react-table";
import { memo, useMemo } from "react";
import { useFilterDataM } from "../hooks/useFilterData";
import { useFilterColumns } from "../hooks/useFilterColumns";
import { MenuTypes } from "../JournalFilter/MenuFilters/MenuTypes";
import { Tooltip } from "@/components/ui/tooltip";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import {
    JOURNAL_INFO_DRAWER_ID,
    journalAdditionalInfoDrawer,
} from "@/journalAdditionalInfoDrawer";

const ROW_HEIGHT = 36;
const OVERSCAN = 10;

const tableColumns = [
    { label: "Тип", value: "type", minSize: 75, grow: 0 },
    { label: "Метка времени", value: "tsText", minSize: 170, grow: 1 },
    { label: "Событие", value: "event", minSize: 200, grow: 2 },
    { label: "Информация", value: "info", minSize: 400, grow: 3 },
    { label: "Пользователь", value: "user", minSize: 140, grow: 1 },
    {
        label: "Время квитирования",
        value: "ackTimeText",
        minSize: 170,
        grow: 1,
    },
    { label: "Квитировал", value: "who_ack", minSize: 140, grow: 1 },
    { label: "", value: "needAck", minSize: 75, grow: 0 },
];

export const JournalTable = () => {
    // TODO
    // eslint-disable-next-line
    /* const { isLoading, isError, error } = useJournalData(); */
    const tableColumnsZus = useFilterStore((s) => s.tableColumnsZus);
    const sticky = useStickToBottom({
        initial: "instant",
        resize: "instant",
    });
    const filteredColumns = useFilterColumns(tableColumns, tableColumnsZus);

    //if (isLoading) return <Loader text={"Загрузка данных"} />;
    //if (isError) return <Text>Error: {error.message}</Text>;

    if (!filteredColumns.length) return <NoData />;

    return (
        <Box w={"full"} h={"full"} minH={0} position={"relative"}>
            <Box
                ref={sticky.scrollRef}
                overflow={"auto"}
                position={"relative"}
                w={"full"}
                h={"full"}
                minH={0}
            >
                <table
                    style={{
                        display: "grid",
                        width: "100%",
                        minWidth: "700px",
                    }}
                >
                    <JournalHeader columns={filteredColumns} />
                    <JournalBody
                        filteredColumns={filteredColumns}
                        sticky={sticky}
                    />
                </table>
            </Box>
            <ScrollToBottomButton
                isAtBottom={sticky.isAtBottom}
                onClick={() => sticky.scrollToBottom("instant")}
            />
        </Box>
    );
};

const ScrollToBottomButton = memo(({ isAtBottom, onClick }) => {
    if (isAtBottom) return null;

    return (
        <Box
            position="absolute"
            float="right"
            bottom="2"
            right="2"
            zIndex="overlay"
        >
            <IconButton size="sm" onClick={onClick} variant="solid">
                <LuArrowDown />
            </IconButton>
        </Box>
    );
});
ScrollToBottomButton.displayName = "ScrollToBottomButton";

const renderHeaderContent = (column) => {
    switch (column.value) {
        case "type":
            return <MenuTypes name={column.label} />;
        case "needAck":
            return (
                <Tooltip
                    showArrow
                    content={"Квитировать все события за период"}
                >
                    <IconButton
                        variant="ghost"
                        size="2xs"
                        color={"fg"}
                        onClick={() =>
                            confirmDialog.open(CONFIRM_DIALOG_ID, {
                                onAccept: () => console.log("ACK ALL"),
                                title: "Квитировать все события?",
                                message:
                                    "Будут квитированы все события за выбранный период.",
                            })
                        }
                    >
                        <LuCheckCheck />
                    </IconButton>
                </Tooltip>
            );
        default:
            return column.label;
    }
};

const JournalHeader = memo(({ columns }) => {
    return (
        <thead
            style={{
                display: "grid",
                position: "sticky",
                width: "100%",
                top: 0,
                zIndex: 10,
            }}
        >
            <tr
                style={{
                    display: "flex",
                    width: "100%",
                }}
            >
                {columns.map((column) => (
                    <Box
                        as="th"
                        key={column.value}
                        display={"flex"}
                        justifyContent={"center"}
                        bg="colorPalette.muted"
                        py="1"
                        fontWeight="medium"
                        style={{
                            minWidth: column.minSize,
                            flexGrow: column.grow ?? 1,
                            flexBasis: column.minSize,
                        }}
                        _first={{
                            borderTopLeftRadius: "l2",
                            borderBottomLeftRadius: "l2",
                        }}
                        _last={{
                            borderTopRightRadius: "l2",
                            borderBottomRightRadius: "l2",
                        }}
                    >
                        {renderHeaderContent(column)}
                    </Box>
                ))}
            </tr>
        </thead>
    );
});
JournalHeader.displayName = "JournalHeader";

const JournalBody = memo(({ filteredColumns, sticky }) => {
    const ids = useJournalStream((s) => s.ids);
    const entities = useJournalStream((s) => s.entities);
    const selectedMessages = useFilterStore((s) => s.selectedMessages);

    const data = useMemo(() => ids.map((id) => entities[id]), [ids, entities]);

    const filteredData = useFilterDataM(data, selectedMessages);
    const table = useCreateTable(filteredColumns, filteredData);

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: OVERSCAN,
        getItemKey: (index) => rows[index]?.id ?? index,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();

    return (
        <tbody
            ref={sticky.contentRef}
            style={{
                display: "grid",
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
            }}
        >
            {virtualRows.map((virtualRow) => {
                const row = rows[virtualRow.index];
                return (
                    <JournalRow
                        key={row.id}
                        row={row}
                        virtualRow={virtualRow}
                    />
                );
            })}
        </tbody>
    );
});
JournalBody.displayName = "JournalBody";

const JournalRow = ({ row, virtualRow }) => {
    const isWarning = row.original.severity === "warning";
    const isError =
        row.original.severity === "error" ||
        row.original.severity === "critical";
    const isNeedAck = row.original.ack?.state === "pending";

    let bg;
    if (isError) bg = "var(--chakra-colors-bg-error)";
    else if (isWarning) bg = "var(--chakra-colors-bg-warning)";
    else if (isNeedAck) bg = "var(--chakra-colors-bg-info)";

    return (
        <tr
            data-index={virtualRow.index}
            key={row.id}
            style={{
                display: "flex",
                position: "absolute",
                transform: `translateY(${virtualRow.start}px)`,
                width: "100%",
                height: `${virtualRow.size}px`,
                background: bg,
            }}
        >
            {row.getVisibleCells().map((cell) => {
                const isInfo = cell.column.id === "info";
                const infoStyle = isInfo ? { cursor: "pointer" } : undefined;
                return (
                    <td
                        key={cell.id}
                        style={{
                            minWidth: cell.column.columnDef.minSize,
                            flexGrow: cell.column.columnDef.meta.grow ?? 1,
                            flexBasis: cell.column.columnDef.minSize,
                            alignContent: "center",
                            padding: "0 8px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            fontWeight: "500",
                            fontSize: "0.875rem",
                            ...infoStyle,
                        }}
                        onClick={() => {
                            if (isInfo)
                                journalAdditionalInfoDrawer.open(
                                    JOURNAL_INFO_DRAWER_ID,
                                    { eventId: cell.row.id },
                                );
                        }}
                    >
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                        )}
                    </td>
                );
            })}
        </tr>
    );
};
