import { Box, Text, Table, IconButton } from "@chakra-ui/react";
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
        queryKey: ['journal'],
        queryFn: async () => {
            const out = [];
            // eslint-disable-next-line
            //const count = Math.floor(Math.random() * 30);
            const count = 1000;

            for (let i = 0; i < count; i++) {
                out.push({
                    date: Date.now(),
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

export const TestTablesDeux = () => {
    const { data, isLoading, isError, error } = useJournalHistory();
    const selectedGroups = useGroupStore(state => state.selectedGroups);
    const selectedMessages = useMessageFilterStore(state => state.selectedMessages) 
    const tableColumnsZus = useColumnsStore(state => state.tableColumnsZus)

    const FilterData = (data, selectedGroups, selectedMessages) => {
        if (!data) return [];
        const filteredDataFunc = data.filter((item) => {
        if (!selectedGroups || !selectedMessages) return false;
        return selectedGroups.includes(item.group) && selectedMessages.includes(item.type)
        })
        console.log(filteredDataFunc);
        return filteredDataFunc;
    }

    const FilterColumns = (tableColumns, tableColumnsZus) => {
        const filteredColumnsFunc = tableColumns.filter((colon) => {
        if (!tableColumnsZus) return false;
        return tableColumnsZus.includes(colon.value); 
        })
        return filteredColumnsFunc;
    }

    const filtredData = useMemo(() => FilterData(data, selectedGroups, selectedMessages), [data, selectedGroups, selectedMessages])

    const filtreColon = useMemo(() => FilterColumns(tableColumns, tableColumnsZus), [tableColumnsZus])

    const sticky = useStickToBottom()

    const tableVirualizer = useVirtualizer({
        count: filtredData.length,
        getScrollElement: () => sticky.scrollRef.current,
        estimateSize: () => 20,
        measureElement: (el) => {
            if(!el) return 20;
            return el.getBoundingClientRect().height;
        },
        overscan: 20,
    })

    const virtualRows = tableVirualizer.getVirtualItems();

    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error: {error.message}</Text>

    /*return (
        <Table.ScrollArea ref={sticky.scrollRef}>
            <Table.Root size='sm' stickyHeader>
                <Table.Header>
                        <Table.Row >
                            {filtreColon.map((colon, index) => (
                                <Table.ColumnHeader textAlign='center' key={index}>{colon.label}</Table.ColumnHeader>
                            ))}
                        </Table.Row>
                </Table.Header>
                <Table.Body>
                    {(virtualRows.length > 0)
                    ? (virtualRows.map((virtualItem) => {
                        const item = filtredData[virtualItem.index];
                        return (
                            <Table.Row 
                                style={{
                                    //position: 'absolute',
                                    //top: `${virtualItem.start}px`,
                                    //left: '0',
                                    //transform: `translateY(${virtualItem.start}px)`
                                }}
                                data-index={virtualItem.index}
                                key={virtualItem.index}
                                ref={tableVirualizer.measureElement}    
                            >
                                {filtreColon.map((colon, indexCol) => 
                                    <Table.Cell textAlign='center' key={indexCol}>{item[colon.value]}</Table.Cell>
                                )}
                            </Table.Row>
                        )
                    }))
                    : (
                        <Table.Row>
                            <Table.Cell 
                                colSpan={filtreColon.length} 
                                textAlign='center'
                            >
                                NO DATA
                            </Table.Cell>
                        </Table.Row>)}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    )*/

    return (
        <Table.ScrollArea ref={sticky.scrollRef}>       
            <Table.Root size='sm' stickyHeader tableLayout='fixed'>
                <Table.Header position="sticky"  zIndex={1}>
                    <Table.Row>
                        {filtreColon.map((colon, index) => (
                            <Table.ColumnHeader textAlign='center' width={`${100 / filtreColon.length}%`} key={index}>
                                {colon.label}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                
                <Table.Body
                    style={{
                        height: `${tableVirualizer.getTotalSize()}px`,
                        position: 'relative',
                    }}
                >
                    {virtualRows.map((virtualItem) => {
                        const item = filtredData[virtualItem.index];
                        return (
                            <Table.Row 
                                key={virtualItem.index}
                                colSpan={filtreColon.length}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    transform: `translateY(${virtualItem.start}px)`,
                                    display: 'table-row'
                                }}
                                ref={tableVirualizer.measureElement}
                                data-index={virtualItem.index}
                            >
                                {filtreColon.map((colon, indexCol) => 
                                    <Table.Cell
                                        width={`${100 / filtreColon.length + 1.13}%`} 
                                        tableLayout='fixed'
                                        textAlign='center' 
                                        key={indexCol}
                                    >
                                        {item[colon.value]}
                                    </Table.Cell>
                                )}
                            </Table.Row>
                        );
                    })}
                    
                    {filtredData.length === 0 && (
                        <Table.Row>
                            <Table.Cell 
                                colSpan={filtreColon.length} 
                                textAlign='center'
                            >
                                NO DATA
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea> 
    )
}