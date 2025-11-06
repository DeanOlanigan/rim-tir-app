import { Box, IconButton, Text } from "@chakra-ui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useFilterStore } from "../JournalStores/FilterStore";
import { useStickToBottom } from "use-stick-to-bottom";
import { NoData } from "@/components/NoData";
import { Loader } from "@/components/Loader";
import { useJournalStream } from "../JournalStores/journal-stream-store";
import { useJournalData } from "../hooks/useJournalData";
import { useFilterData } from "../hooks/useFilterData";
import { useFilterColumns } from "../hooks/useFilterColumns";
import { HeaderCell, TableData, useCreateTable } from "../hooks/useCreateTable";
import { LuArrowDown } from "react-icons/lu";

const tableColumns = [
    { label: "Дата и время", value: "date", size: 250 },
    { label: "Тип", value: "type", size: 145 },
    { label: "Группа", value: "group", size: 140 },
    { label: "Переменная", value: "var", size: 140 },
    { label: "Значение", value: "val", size: 140 },
    { label: "Описание", value: "desc", size: 240 },
];

export const JournalTable = () => {
    const { isLoading, isError, error } = useJournalData();
    const { selectedGroups, selectedMessages, tableColumnsZus } =
        useFilterStore();
    const { live } = useJournalStream();

    const sticky = useStickToBottom({
        initial: "instant",
        resize: "instant",
    });

    const filtredData = useFilterData(live, selectedGroups, selectedMessages);
    const filtreColon = useFilterColumns(tableColumns, tableColumnsZus);

    const table = useCreateTable(filtreColon, filtredData);

    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => 34,
        overscan: 5,
    });

    const virtualRows = virtualizer.getVirtualItems();

    if (isLoading) return <Loader text={"Загрузка данных"} />;
    if (isError) return <Text>Error: {error.message}</Text>;

    return (
        <div
            ref={sticky.scrollRef}
            style={{
                overflow: "auto",
                position: "relative",
                width: "100%",
                height: "1000px",
            }}
        >
            {(filtredData.length === 0 || filtreColon.length === 0) && (
                <NoData />
            )}
            <table
                style={{
                    tableLayout: "fixed",
                    width: "100%",
                }}
            >
                <colgroup>
                    {table.getVisibleLeafColumns().map((column) => (
                        <col
                            key={column.id}
                            style={{ width: `${column.getSize()}px` }}
                        />
                    ))}
                </colgroup>
                <thead
                    style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                    }}
                >
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} style={{}}>
                            {headerGroup.headers.map((header) => (
                                <HeaderCell key={header.id} header={header} />
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                    }}
                    ref={sticky.contentRef}
                >
                    {virtualRows.length > 0 && virtualRows[0].start > 0 && (
                        <tr style={{ height: virtualRows[0].start }}>
                            <td
                                colSpan={table.getVisibleLeafColumns().length}
                            />
                        </tr>
                    )}
                    <TableData rows={rows} virtualRows={virtualRows} />
                    {virtualRows.length > 0 && (
                        <tr
                            style={{
                                height:
                                    virtualizer.getTotalSize() -
                                    virtualRows[virtualRows.length - 1].end,
                            }}
                        >
                            <td
                                colSpan={table.getVisibleLeafColumns().length}
                            />
                        </tr>
                    )}
                </tbody>
            </table>
            {!sticky.isAtBottom && (
                <Box
                    position="sticky"
                    float="right"
                    bottom="2"
                    right="2"
                    zIndex="10"
                >
                    <IconButton
                        size={"sm"}
                        onClick={() => {
                            sticky.scrollToBottom("instant");
                            virtualizer.measure();
                        }}
                        variant={"solid"}
                    >
                        <LuArrowDown />
                    </IconButton>
                </Box>
            )}
        </div>
    );
};
