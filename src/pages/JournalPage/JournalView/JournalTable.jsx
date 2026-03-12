import { Box, IconButton } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useFilterStore } from "../JournalStores/filter-store";
import { useStickToBottom } from "use-stick-to-bottom";
import { NoData } from "@/components/NoData";
import { useJournalStream } from "../JournalStores/journal-stream-store";
import { useCreateTable } from "../hooks/useCreateTable";
import { LuArrowDown } from "react-icons/lu";
import { flexRender } from "@tanstack/react-table";
import { memo } from "react";
import { useFilterDataM } from "../hooks/useFilterData";
import { useFilterColumns } from "../hooks/useFilterColumns";
import { MenuGroups } from "../JournalFilter/MenuFilters/MenuGroups";
import { MenuTypes } from "../JournalFilter/MenuFilters/MenuTypes";

const ROW_HEIGHT = 36;
const OVERSCAN = 10;

const tableColumns = [
    { label: "Тип", value: "type", size: 75 },
    { label: "Метка времени", value: "tsText", size: 200 },
    { label: "Событие", value: "event", size: 300 },
    { label: "Информация", value: "info", size: 400 },
    //{ label: "Группа", value: "group", size: 140 }, // ?
    //{ label: "Переменная", value: "var", size: 140 }, // ?
    //{ label: "Значение", value: "val", size: 100 }, // ?
    //{ label: "Описание", value: "desc", size: 240 }, // ?
    { label: "Пользователь", value: "user", size: 140 },
    { label: "Время квитирования", value: "ackTimeText", size: 200 },
    { label: "Квитировал", value: "who_ack", size: 200 },
    { label: "", value: "needAck", size: 75 },
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
                    textAlign: "center",
                }}
            >
                <JournalHeader columns={filteredColumns} />
                <JournalBody
                    filteredColumns={filteredColumns}
                    scroll={sticky.scrollRef}
                    content={sticky.contentRef}
                />
            </table>

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
            position="sticky"
            float="right"
            bottom="2"
            right="2"
            zIndex="sticky"
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
        case "group":
            return <MenuGroups name={column.label} />;
        case "type":
            return <MenuTypes name={column.label} />;
        default:
            return column.label;
    }
};

const JournalHeader = memo(({ columns }) => {
    console.log("render header");
    return (
        <thead
            style={{
                display: "grid",
                position: "sticky",
                justifyContent: "center",
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
                            width: column.size,
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

const JournalBody = memo(({ filteredColumns, scroll, content }) => {
    const live = useJournalStream((s) => s.live);
    const selectedMessages = useFilterStore((s) => s.selectedMessages);

    const filteredData = useFilterDataM(live, selectedMessages);

    const table = useCreateTable(filteredColumns, filteredData);

    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scroll.current,
        estimateSize: () => ROW_HEIGHT,
        overscan: OVERSCAN,
        getItemKey: (index) => rows[index]?.id ?? index,
    });

    const virtualRows = rowVirtualizer.getVirtualItems();

    console.log("render t body", rows, virtualRows);

    return (
        <tbody
            ref={content}
            style={{
                display: "grid",
                height: `${rowVirtualizer.getTotalSize()}px`,
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
    const isPause = row.original.type === "pause";
    const isResume = row.original.type === "resume";

    const bg =
        isPause || isResume ? "var(--chakra-colors-bg-success)" : undefined;

    return (
        <tr
            data-index={virtualRow.index}
            key={row.id}
            style={{
                display: "flex",
                justifyContent: "center",
                position: "absolute",
                transform: `translateY(${virtualRow.start}px)`,
                width: "100%",
                height: `${virtualRow.size}px`,
                background: bg,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <td
                    key={cell.id}
                    style={{
                        width: cell.column.getSize(),
                        alignContent: "center",
                        padding: "0 8px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        fontWeight: "500",
                        fontSize: "0.875rem",
                    }}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
};
