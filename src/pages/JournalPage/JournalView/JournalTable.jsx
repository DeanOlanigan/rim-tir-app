import { Box, Text, IconButton } from "@chakra-ui/react";
import { LuArrowDown } from "react-icons/lu";
import { useVirtualizer } from "@tanstack/react-virtual";
import { flexRender } from "@tanstack/react-table";
import { useGroupStore } from "../JournalStores/GroupFilterStore";
import { useMessageFilterStore } from "../JournalStores/MessageFilterStore";
import { useColumnsStore } from "../JournalStores/ColumnsStore";
import { useStickToBottom } from "use-stick-to-bottom";
import { NoData } from "@/components/NoData";
import { Loader } from "@/components/Loader";
import { MenuGroups } from "../JournalFilter/MenuFilters/MenuGroups";
import { MenuTypes } from "../JournalFilter/MenuFilters/MenuTypes";
import { useJournalStream } from "../JournalStores/journal-stream-store";
import { useJournalData } from "../hooks/useJournalData";
import { useFilterData } from "../hooks/useFilterData";
import { useFilterColumns } from "../hooks/useFilterColumns";
import { useCreateTable } from "../hooks/useCreateTable";

const tableColumns = [
    { label: "Дата и время", value: "date", size: 200 },
    { label: "Тип", value: "type", size: 80 },
    { label: "Группа", value: "group", size: 120 },
    { label: "Переменная", value: "var", size: 120 },
    { label: "Значение", value: "val", size: 100 },
    { label: "Описание", value: "desc", size: 200 },
];

const cellType = {
    group: (content) => <MenuGroups name={content} />,
    type: (content) => <MenuTypes name={content} />,
};

export const JournalTable = () => {
    const { isLoading, isError, error } = useJournalData();
    const selectedGroups = useGroupStore((state) => state.selectedGroups);
    const selectedMessages = useMessageFilterStore(
        (state) => state.selectedMessages
    );
    const tableColumnsZus = useColumnsStore((state) => state.tableColumnsZus);
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
        <>
            {(filtredData.length === 0 || filtreColon.length === 0) && (
                <NoData />
            )}
            <table style={{ top: 0, left: 0, width: "100%" }}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <HeaderCell key={header.id} header={header} />
                            ))}
                        </tr>
                    ))}
                </thead>
            </table>
            <Box ref={sticky.scrollRef} height="95%" overflow={"auto"}>
                <div
                    style={{
                        height: `${virtualizer.getTotalSize()}px`,
                        position: "relative",
                    }}
                    ref={sticky.contentRef}
                >
                    {virtualRows.map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        return (
                            <div
                                key={row.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                }}
                            >
                                <table
                                    style={{
                                        width: "100%",
                                        tableLayout: "fixed",
                                    }}
                                >
                                    <tbody>
                                        <tr>
                                            {row
                                                .getVisibleCells()
                                                .map((cell) => {
                                                    return (
                                                        <td
                                                            key={cell.id}
                                                            style={{
                                                                width: cell.column.getSize(),
                                                                textAlign:
                                                                    "center",
                                                                fontSize: "sm",
                                                                fontWeight:
                                                                    "500",
                                                            }}
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext()
                                                            )}
                                                        </td>
                                                    );
                                                })}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
                </div>
            </Box>
            {!sticky.isAtBottom && (
                <Box position="absolute" bottom="8" right="8" zIndex="10">
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
        </>
    );
};

const HeaderCell = ({ header }) => {
    if (header.isPlaceholder) return null;

    const content = flexRender(
        header.column.columnDef.header,
        header.getContext()
    );

    return (
        <Box
            as={"th"}
            key={header.id}
            colSpan={header.colSpan}
            bg={"colorPalette.solid"}
            color={"fg.inverted"}
            w={`${header.getSize()}px`}
            py={"1"}
            fontWeight={"medium"}
        >
            {cellType[header.id] ? cellType[header.id](content) : content}
        </Box>
    );
};
