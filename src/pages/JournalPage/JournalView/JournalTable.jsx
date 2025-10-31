import { Box, IconButton, Text } from "@chakra-ui/react";
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
import { LuArrowDown } from "react-icons/lu";

const tableColumns = [
    { label: "Дата и время", value: "date", size: 250 },
    { label: "Тип", value: "type", size: 145 },
    { label: "Группа", value: "group", size: 140 },
    { label: "Переменная", value: "var", size: 140 },
    { label: "Значение", value: "val", size: 140 },
    { label: "Описание", value: "desc", size: 240 },
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
                    display: "grid",
                    width: "100%",
                }}
            >
                <thead
                    style={{
                        display: "grid",
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        width: "100%",
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
                                <HeaderCell key={header.id} header={header} />
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody
                    style={{
                        display: "grid",
                        height: `${virtualizer.getTotalSize()}px`,
                        position: "relative",
                        width: "100%",
                    }}
                    ref={sticky.contentRef}
                >
                    {virtualRows.map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        return (
                            <tr
                                key={row.id}
                                style={{
                                    position: "absolute",
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
                                    display: "flex",
                                    width: "100%",
                                }}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <td
                                        key={cell.id}
                                        style={{
                                            width: `${cell.column.getSize()}px`,
                                            textAlign: "center",
                                            fontSize: "sm",
                                            fontWeight: "500",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                            padding: "4px",
                                        }}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </td>
                                ))}
                            </tr>
                        );
                    })}
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

const HeaderCell = ({ header }) => {
    if (header.isPlaceholder) return null;

    const content = flexRender(
        header.column.columnDef.header,
        header.getContext()
    );

    return (
        <Box
            as="th"
            key={header.id}
            colSpan={header.colSpan}
            bg="colorPalette.solid"
            color="fg.inverted"
            w={`${header.getSize()}px`}
            py="1"
            fontWeight="medium"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
        >
            {cellType[header.id] ? cellType[header.id](content) : content}
        </Box>
    );
};
