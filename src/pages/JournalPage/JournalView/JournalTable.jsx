import { Box, Text, Table, IconButton } from "@chakra-ui/react";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { LuArrowDown } from "react-icons/lu";
import { useColorModeValue } from "@/components/ui/color-mode";
import { AutoSizer, Column } from "react-virtualized";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/api";
import { useGraphStore } from "@/pages/GraphsPage/store/store";
import { useGroupStore } from "../JournalStores/GroupFilterStore";
import { useMessageFilterStore } from "../JournalStores/MessageFilterStore";
import { useColumnsStore } from "../JournalStores/ColumnsStore";
import { useEffect, useMemo, useRef } from "react";
import { measureElement, useVirtualizer } from "@tanstack/react-virtual";
import { useStickToBottom } from "use-stick-to-bottom";

const tableColumns = [
    { label: "Дата и время", value: "date" },
    { label: "Тип", value: "type" },
    { label: "Группа", value: "group" },
    { label: "Переменная", value: "var" },
    { label: "Значение", value: "val" },
    { label: "Описание", value: "desc" },
];


const useJournalHistory = () => {
    const q = useQuery({
        queryKey: ["journal"],
        queryFn: async () => {
            const out = [];
            // eslint-disable-next-line
            //const count = Math.floor(Math.random() * 30);
            const count = 1000;

            for (let i = 0; i < count; i++) {
                out.push({
                    date: new Date().toLocaleString(),
                    // eslint-disable-next-line
                    type: ["ts", "tu"][Math.floor(Math.random() * 2)],
                    var: "test",
                    // eslint-disable-next-line
                    val: Math.floor(Math.random() * 100),
                    group: ["noGroup", "danger", "warn", "state"][
                        // eslint-disable-next-line
                        Math.floor(Math.random() * 4)
                    ],
                    desc: "test Decrip"
                });
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
            console.log(out);
            return out;
        },
    });

    return q;
};

export const TestTables = () => {
    const { data, isLoading, isError, error } = useJournalHistory();
    const selectedGroups = useGroupStore(state => state.selectedGroups);
    const selectedMessages = useMessageFilterStore(state => state.selectedMessages) 
    const tableColumnsZus = useColumnsStore(state => state.tableColumnsZus)

    const FilterData = (data, selectedGroups, selectedMessages) => {
        if (!data) return [];
        const filteredDataFunc = data.filter((item) => {
            if (!selectedGroups || !selectedMessages) return false;
            return selectedGroups.includes(item.group) && selectedMessages.includes(item.type)
        });
        console.log(filteredDataFunc);
        return filteredDataFunc;
    };

    const FilterColumns = (tableColumns, tableColumnsZus) => {
        const filteredColumnsFunc = tableColumns.filter((colon) => {
            if (!tableColumnsZus) return false;
            return tableColumnsZus.includes(colon.value); 
        });
        return filteredColumnsFunc;
    };

    const filtredData = useMemo(() => FilterData(data, selectedGroups, selectedMessages), [data, selectedGroups, selectedMessages])

    const filtreColon = useMemo(() => FilterColumns(tableColumns, tableColumnsZus), [tableColumnsZus])

    const sticky = useStickToBottom();

    const columns = useMemo(() => 
        filtreColon.map(column => ({
            accessorKey: column.value,
            header: column.label,
            size: column.size,
            cell: ({ getValue }) => (
                <Text fontSize="sm">{getValue()}</Text>
            ),
        })),
    [filtreColon]
    );

    const table = useReactTable({
        data: filtredData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const { rows } = table.getRowModel();

    const tableVirualizer = useVirtualizer({
        count: filtredData.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => 34,
        overscan: 20,
    });

    const virtualRows = tableVirualizer.getVirtualItems();

    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error: {error.message}</Text>;

    return ( 
        <Table.Root size="sm" stickyHeader ref={sticky.scrollRef} colorPalette={"current"}>
            <thead style={{position: "sticky"}}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <th
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    style={{ 
                                        width: header.getSize(),
                                        textAlign: "center",
                                        padding: "8px",                       
                                        fontWeight: "bold",
                                        fontSize: "sm",
                                        position: "sticky"
                                    }}
                                >
                                    {header.isPlaceholder ? null : (
                                        flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                ))}
            </thead>
            <tbody>
                {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                        <tr key={row.id}>
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
                    );})}
            </tbody>
        </Table.Root>
    );
};