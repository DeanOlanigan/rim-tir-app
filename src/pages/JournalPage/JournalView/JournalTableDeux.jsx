import { Box, Text, IconButton } from "@chakra-ui/react";
import { LuArrowDown } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from '@tanstack/react-virtual';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useGroupStore } from "../JournalStores/GroupFilterStore";
import { useMessageFilterStore } from "../JournalStores/MessageFilterStore";
import { useColumnsStore } from "../JournalStores/ColumnsStore";
import { useEffect, useMemo, useRef } from "react";
import { useStickToBottom } from "use-stick-to-bottom";

const tableColumns = [
    { label: "Дата и время", value: "date", size: 200 },
    { label: "Тип", value: "type", size: 80 },
    { label: "Группа", value: "group", size: 120 },
    { label: "Переменная", value: "var", size: 120 },
    { label: "Значение", value: "val", size: 100 },
    { label: "Описание", value: "desc", size: 200 },
];

const useJournalHistory = () => {
    const q = useQuery({
        queryKey: ['journal'],
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
    }

    const FilterColumns = (tableColumns, tableColumnsZus) => {
        const filteredColumnsFunc = tableColumns.filter((colon) => {
            if (!tableColumnsZus) return false;
            return tableColumnsZus.includes(colon.value);
        });
        return filteredColumnsFunc;
    }

    const filtredData = useMemo(() => FilterData(data, selectedGroups, selectedMessages), [data, selectedGroups, selectedMessages]);
    const filtreColon = useMemo(() => FilterColumns(tableColumns, tableColumnsZus), [tableColumnsZus]);

    // Определяем колонки для TanStack Table
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

    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => 34,
        measureElement: (el) => {
            if (!el) return 34;
            return el.getBoundingClientRect().height
        },
        overscan: 20,
    });

    const virtualRows = virtualizer.getVirtualItems();

    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error: {error.message}</Text>;

    return (
        <Box 
            ref={sticky.scrollRef} 
            height="100%" 
            overflow="auto"
            className="container"
        >
            {(filtredData.length === 0 || filtreColon.length === 0) && (
                <Box 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        padding: '20px'
                    }}
                >
                    <Text color="gray.500">NO DATA</Text>
                </Box>
            )}
            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                <thead style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{ 
                                            width: header.getSize(),
                                            textAlign: 'center',
                                            padding: '8px',
                                            borderBottom: '2px solid #e2e8f0',
                                            fontWeight: 'semibold',
                                            fontSize: 'sm',
                                            backgroundColor: 'ButtonShadow',
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
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
            </table>
            
            <Box 
                style={{ 
                    height: `${virtualizer.getTotalSize()}px`, 
                    position: 'relative',
                    width: '100%'
                }}
            >
                {virtualRows.map((virtualRow) => {
                    const row = rows[virtualRow.index];
                    return (
                        <Box
                            data-index={row.id}
                            ref={virtualizer.measureElement}
                            key={row.id}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: `${virtualRow.size}px`,
                                transform: `translateY(${virtualRow.start}px)`,
                                display: 'table',
                                tableLayout: 'fixed'
                            }}
                        >
                            <table style={{ width: '100%', tableLayout: 'fixed' }}>
                                <tbody>
                                    <tr>
                                        {row.getVisibleCells().map((cell) => {
                                            return (
                                                <td 
                                                    key={cell.id}
                                                    style={{
                                                        width: cell.column.getSize(),
                                                        textAlign: 'center',
                                                        padding: '8px',
                                                        borderBottom: '1px solid #f1f5f9',
                                                        fontSize: 'sm'
                                                    }}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext(),
                                                    )}
                                                </td>
                                            )
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    );
};