import { Box, Text, IconButton, Badge } from "@chakra-ui/react";
import { LuArrowDown } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table";
import { useGroupStore } from "../JournalStores/GroupFilterStore";
import { useMessageFilterStore } from "../JournalStores/MessageFilterStore";
import { useColumnsStore } from "../JournalStores/ColumnsStore";
import { useEffect, useMemo } from "react";
import { useStickToBottom } from "use-stick-to-bottom";
import { NoData } from "@/components/NoData";
import { Loader } from "@/components/Loader";
import { MenuGroups } from "../JournalFilter/MenuFilters/MenuGroups";
import { MenuTypes } from "../JournalFilter/MenuFilters/MenuTypes";
import { usePauseStore } from "../JournalStores/pause-store";

const tableColumns = [
    { label: "Дата и время", value: "date", size: 200 },
    { label: "Тип", value: "type", size: 80 },
    { label: "Группа", value: "group", size: 120 },
    { label: "Переменная", value: "var", size: 120 },
    { label: "Значение", value: "val", size: 100 },
    { label: "Описание", value: "desc", size: 200 },
];

const useJournalHistory = (options = {}) => {

    const {
        enabled = true,
        refetchInterval = 5000, 
    } = options;

    const q = useQuery({
        queryKey: ["journal"],
        queryFn: async () => {
            const out = [];
            // eslint-disable-next-line sonarjs/pseudo-random
            const count = Math.floor(Math.random() * 10);

            for (let i = 0; i < count; i++) {
                out.push({
                    date: new Date().toLocaleString(),
                    // eslint-disable-next-line sonarjs/pseudo-random                    
                    type: ["ТС", "ТУ"][Math.floor(Math.random() * 2)],
                    var: "тест",
                    // eslint-disable-next-line sonarjs/pseudo-random
                    val: Math.floor(Math.random() * 100),
                    group: ["Без Группы", "Аварийная", "Предупредительная", "Состояние"][
                        // eslint-disable-next-line sonarjs/pseudo-random
                        Math.floor(Math.random() * 4)
                    ],
                    desc: "test Descripbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbtion"
                });
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return out;
        },
        refetchInterval,
        refetchIntervalInBackground: true,
        enabled,
        staleTime: 0,
    });
    return q;
};


export const TestTablesDeux = () => {
    const { data, isLoading, isError, error } = useJournalHistory();
    const selectedGroups = useGroupStore(state => state.selectedGroups);
    const selectedMessages = useMessageFilterStore(state => state.selectedMessages);
    const tableColumnsZus = useColumnsStore(state => state.tableColumnsZus);
    const {
        live,
        push,
        isPaused
    } = usePauseStore();

    useEffect(() => {
        if (data) push(data);
    }, [data, push]);

    useEffect(() => {
        sticky.scrollToBottom();
    }, [isPaused]);

    const sticky = useStickToBottom();

    const FilterData = (live, selectedGroups, selectedMessages) => {
        if (!live) return [];
        const filteredDataFunc = live.filter((item) => {
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

    const filtredData = useMemo(() => FilterData(live, selectedGroups, selectedMessages), [live, selectedGroups, selectedMessages]);
    const filtreColon = useMemo(() => FilterColumns(tableColumns, tableColumnsZus), [tableColumnsZus]);

    const columns = useMemo(() => 
        filtreColon.map(column => ({
            accessorKey: column.value,
            header: column.label,
            size: column.size,
            cell: ({ getValue }) => {
                const value = getValue();
                
                if (column.value === "group") {
                    const colorScheme = {
                        Аварийная: "red",
                        Предупредительная: "orange",
                        Состояние: "blue",
                        Пауза: "cyan",
                        Возобновлен: "green"
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
                return <Text truncate title={value}>{value}</Text>;
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
            overflow={"hidden"}
            borderRadius={"sm"}
        >
            {(filtredData.length === 0 || filtreColon.length === 0) && (
                <NoData />
            )}
            <table style={{top: 0, left: 0,width: "100%" }}>
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id} >
                            {headerGroup.headers.map((header) => {
                                if (header.id === "group" || header.id === "type") return (
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
                                        {header.id === "group"
                                            ? <MenuGroups header={header}/>
                                            : <MenuTypes header={header} />
                                        }
                                    </Box>
                                );
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
            <Box ref={sticky.scrollRef} height="95%" overflow={"auto"}>
                <Box 
                    style={{ 
                        height: `${virtualizer.getTotalSize()}px`, 
                        position: "relative",
                    }}
                    ref={sticky.contentRef}
                >
                    {virtualRows.map((virtualRow) => {
                        const row = rows[virtualRow.index];
                        return (
                            <Box
                                key={row.id}
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    height: `${virtualRow.size}px`,
                                    transform: `translateY(${virtualRow.start}px)`,
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
                                                            padding: "5px",
                                                            paddingLeft: "10px",
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


