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
import { useFilterData } from "../hooks/useFilterData";
import { useFilterColumns } from "../hooks/useFilterColumns";

const ROW_HEIGHT = 36;
const OVERSCAN = 10;

const tableColumns = [
    { label: "Дата и время", value: "ts", size: 250 },
    { label: "Тип", value: "type", size: 145 },
    { label: "Группа", value: "group", size: 140 },
    { label: "Переменная", value: "var", size: 140 },
    { label: "Значение", value: "val", size: 140 },
    { label: "Описание", value: "desc", size: 240 },
];

export const JournalTable = () => {
    // TODO
    // eslint-disable-next-line
    /* const { isLoading, isError, error } = useJournalData(); */
    const selectedGroups = useFilterStore((s) => s.selectedGroups);
    const selectedMessages = useFilterStore((s) => s.selectedMessages);
    const tableColumnsZus = useFilterStore((s) => s.tableColumnsZus);

    const live = useJournalStream((s) => s.live);

    const sticky = useStickToBottom({
        initial: "instant",
        resize: "instant",
    });

    const filteredData = useFilterData(live, selectedGroups, selectedMessages);
    const filteredColumns = useFilterColumns(tableColumns, tableColumnsZus);
    const table = useCreateTable(filteredColumns, filteredData);

    //if (isLoading) return <Loader text={"Загрузка данных"} />;
    //if (isError) return <Text>Error: {error.message}</Text>;

    if (!filteredData.length || !filteredColumns.length) return <NoData />;

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
                <JournalHeader table={table} />
                <JournalBody table={table} sticky={sticky} />
            </table>
            {!sticky.isAtBottom && (
                <Box
                    position="sticky"
                    float="right"
                    bottom="2"
                    right="2"
                    zIndex="sticky"
                >
                    <IconButton
                        size={"sm"}
                        onClick={() => sticky.scrollToBottom("instant")}
                        variant={"solid"}
                    >
                        <LuArrowDown />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

const JournalHeader = ({ table }) => {
    return (
        <thead
            style={{
                display: "grid",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}
        >
            {table.getHeaderGroups().map((headerGroup) => (
                <tr
                    key={headerGroup.id}
                    style={{
                        display: "flex",
                        width: "100%",
                    }}
                >
                    {headerGroup.headers.map((header) => (
                        <Box
                            as="th"
                            key={header.id}
                            display={"flex"}
                            justifyContent={"center"}
                            bg="colorPalette.muted"
                            py="1"
                            fontWeight="medium"
                            style={{
                                width: header.getSize(),
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
                            {header.isPlaceholder
                                ? null
                                : flexRender(
                                      header.column.columnDef.header,
                                      header.getContext(),
                                  )}
                        </Box>
                    ))}
                </tr>
            ))}
        </thead>
    );
};

const JournalBody = memo(({ table, sticky }) => {
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

const JournalRow = memo(({ row, virtualRow }) => {
    return (
        <tr
            data-index={virtualRow.index}
            style={{
                display: "flex",
                position: "absolute",
                transform: `translateY(${virtualRow.start}px)`,
                width: "100%",
                height: `${virtualRow.size}px`,
            }}
        >
            {row.getVisibleCells().map((cell) => (
                <td
                    key={cell.id}
                    style={{
                        display: "flex",
                        width: `${cell.column.getSize()}px`,
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "0 8px",
                        overflow: "hidden",
                    }}
                >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
});
JournalRow.displayName = "JournalRow";
