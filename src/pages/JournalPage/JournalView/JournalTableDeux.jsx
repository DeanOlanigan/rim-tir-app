import { Box, Text, IconButton, ColorPicker, Badge } from "@chakra-ui/react";
import { LuArrowDown } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useGroupStore } from "../JournalStores/GroupFilterStore";
import { useMessageFilterStore } from "../JournalStores/MessageFilterStore";
import { useColumnsStore } from "../JournalStores/ColumnsStore";
import { useMemo } from "react";
import { useStickToBottom } from "use-stick-to-bottom";
import { NoData } from "@/components/NoData";
import { Loader } from "@/components/Loader";

const tableColumns = [
    { label: "Дата и время", value: "date", size: 200 },
    { label: "Тип", value: "type", size: 80 },
    { label: "Группа", value: "group", size: 120 },
    { label: "Переменная", value: "var", size: 120 },
    { label: "Значение", value: "val", size: 100 },
    { label: "Описание", value: "desc", size: 200 },
];

const colors = {
    danger: "#E53E3E",     // red.600
    warn: "#DD6B20",       // orange.600 
    state: "#3182CE",      // blue.600
    noGroup: undefined     
};

const useJournalHistory = () => {
    const q = useQuery({
        queryKey: ["journal"],
        queryFn: async () => {
            const out = [];
            const count = 1000;

            for (let i = 0; i < count; i++) {
                out.push({
                    date: new Date().toLocaleString(),
                    type: ["ts", "tu"][Math.floor(Math.random() * 2)],
                    var: "test",
                    val: Math.floor(Math.random() * 100),
                    group: ["noGroup", "danger", "warn", "state"][
                        Math.floor(Math.random() * 4)
                    ],
                    desc: "test Description"
                });
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return out;
        },
    });
    return q;
};

export const TestTablesDeux = () => {
    const { data, isLoading, isError, error } = useJournalHistory();
    const selectedGroups = useGroupStore(state => state.selectedGroups);
    const selectedMessages = useMessageFilterStore(state => state.selectedMessages);
    const tableColumnsZus = useColumnsStore(state => state.tableColumnsZus);

    const sticky = useStickToBottom();

    const FilterData = (data, selectedGroups, selectedMessages) => {
        if (!data) return [];
        const filteredDataFunc = data.filter((item) => {
            if (!selectedGroups || !selectedMessages) return false;
            return selectedGroups.includes(item.group) && selectedMessages.includes(item.type);
        });
        return filteredDataFunc;
    };

    const FilterColumns = (tableColumns, tableColumnsZus) => {
        const filteredColumnsFunc = tableColumns.filter((colon) => {
            if (!tableColumnsZus) return false;
            return tableColumnsZus.includes(colon.value);
        });
        return filteredColumnsFunc;
    };

    const filtredData = useMemo(() => FilterData(data, selectedGroups, selectedMessages), [data, selectedGroups, selectedMessages]);
    const filtreColon = useMemo(() => FilterColumns(tableColumns, tableColumnsZus), [tableColumnsZus]);

    // Определяем колонки для TanStack Table
    const columns = useMemo(() => 
        filtreColon.map(column => ({
            accessorKey: column.value,
            header: column.label,
            size: column.size,
            cell: ({ getValue }) => {
                const value = getValue();
                
                if (column.value === "group") {
                    const colorScheme = {
                        danger: "red",
                        warn: "orange",
                        state: "blue",
                        noGroup: "purple"
                    }[value];
                

                    return (
                        <Badge
                            colorPalette={colorScheme}
                            variant={"subtle"}
                            fontSize={"500"}
                        >
                            {value}
                        </Badge>
                    );
                }
                return <Text>{value}</Text>;
            },
        })),
    [filtreColon]
    );

    const table = useReactTable({
        data: filtredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => 34,

        overscan: 5,
    });

    const virtualRows = virtualizer.getVirtualItems();;

    if (isLoading) return (
        <Loader />
    );
    if (isError) return <Text>Error: {error.message}</Text>;

    return (
        <Box
            height="100%" 
            overflow="auto"
            borderRadius={"sm"}
            ref={sticky.scrollRef}
        >
            {(filtredData.length === 0 || filtreColon.length === 0) && (
                <NoData />
            )}
            <Box style={{ position: "sticky", top: "0", zIndex: 1, }}>
                <table style={{ width: "100%", tableLayout: "fixed" }}>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <Box as={"th"}
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            bg={"colorPalette.solid"}
                                            style={{ 
                                                width: header.getSize(),
                                                textAlign: "center",
                                                padding: "8px",                       
                                                fontWeight: "bold",
                                                fontSize: "sm",
                                                color: "white",
                                            }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <Box>
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                </Box>
                                            )}
                                        </Box>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                </table>
            </Box>
            <Box 
                style={{ 
                    height: `${virtualizer.getTotalSize()}px`, 
                    position: "relative",
                    width: "100%"
                }}

            >
                {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    const rowData = row.original;
                    return (
                        <Box
                            data-index={row.id}
                            
                            key={row.id}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                                display: "table",
                                tableLayout: "fixed",
                                fontWeight: "normal"
                            }}
                        >
                            <table style={{ width: "100%", tableLayout: "fixed" }}>
                                <tbody>
                                    <tr>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <td 
                                                    key={cell.id}
                                                    style={{
                                                        width: cell.column.getSize(),
                                                        textAlign: "center",
                                                        padding: "8px",
                                                        borderBottom: "2px solid #f1f5f9",
                                                        fontSize: "sm",
                                                        fontWeight: "500",                                 
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
                                </tbody>
                            </table>
                        </Box>
                    );
                })}
            </Box>
            {!sticky.isAtBottom && (
                <Box position="absolute" bottom="6" right="8" zIndex="10">
                    <IconButton
                        size="sm"
                        onClick={() => {
                            sticky.scrollToBottom();
                            virtualizer.measure();
                        }}
                        colorScheme="blue"
                        variant="solid"
                    >
                        <LuArrowDown />
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};