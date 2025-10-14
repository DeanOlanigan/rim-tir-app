import { Box, Text, Table, ScrollArea } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { AutoSizer, Column } from "react-virtualized";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/api";
import { useGraphStore } from "@/pages/GraphsPage/store/store";
import { useGroupStore } from "../JournalStores/GroupFilterStore";
import { useMessageFilterStore } from "../JournalStores/MessageFilterStore";
import { useColumnsStore } from "../JournalStores/ColumnsStore";

// export const JournalTable = ({ scrollRef, columns, rows }) => {
//     const oddBackgroundColor = useColorModeValue("white", "#111111");
//     const evenBackgroundColor = useColorModeValue("#e4e4e7", "#27272a");

//     const rowGetter = ({ index }) => rows[index];

//     const rowRenderer = (props) => {
//         const { index, style, key, className, columns, rowData } = props;

//         if (rowData.mark) {
//             return (
//                 <Box
//                     key={key}
//                     className={className}
//                     style={style}
//                     bg={"green.200"}
//                     borderBottom={"1px solid #ccc"}
//                     textAlign={"center"}
//                     justifyContent={"center"}
//                 >
//                     {rowData.message}
//                 </Box>
//             );
//         }

//         //const rowData = rows[index];
//         if (!rowData) return null;
//         const backgroundColor =
//             index % 2 === 0 ? oddBackgroundColor : evenBackgroundColor;

//         return (
//             <Box
//                 key={key}
//                 className={className}
//                 style={style}
//                 bg={backgroundColor}
//                 borderBottom={"1px solid #ccc"}
//                 fontSize={"sm"}
//             >
//                 {columns}
//             </Box>
//         );
//     };
//     const cellRenderer = (props) => {
//         const {
//             cellData,
//             columnData,
//             columnIndex,
//             dataKey,
//             rowData,
//             rowIndex,
//         } = props;

//         if (dataKey === "date") {
//             return <Text textWrap={"wrap"}>{cellData}</Text>;
//         }

//         return (
//             <Text
//                 textWrap={"wrap"}
//                 textAlign={"start"}
//                 textOverflow={"ellipsis"}
//             >
//                 {cellData}
//             </Text>
//         );
//     };

//     return (
//         <Box w={"100%"} h={"100%"}>
//             <AutoSizer>
//                 {({ height, width }) => (
//                     <Table
//                         ref={scrollRef}
//                         width={width}
//                         height={height}
//                         headerHeight={30}
//                         rowHeight={45}
//                         rowCount={rows.length}
//                         rowGetter={rowGetter}
//                         rowRenderer={rowRenderer}
//                         headerStyle={{
//                             fontSize: "14px",
//                             textTransform: "math-auto",
//                         }}
//                         rowStyle={{
//                             borderBottom: "1px solid #ccc",
//                         }}
//                     >
//                         {columns.map((col) => (
//                             <Column
//                                 key={col.value}
//                                 dataKey={col.value}
//                                 label={col.label}
//                                 width={80}
//                                 flexGrow={1}
//                                 flexShrink={1}
//                                 style={{
//                                     textAlign: "start",
//                                     textOverflow: "ellipsis",
//                                     textWrap: "wrap",
//                                     hyphens: "auto",
//                                     alignSelf: "start",
//                                 }}
//                             />
//                         ))}
//                     </Table>
//                 )}
//             </AutoSizer>
//         </Box>
//     );
// };

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
            const count = Math.floor(Math.random() * 30);

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

    if (isLoading) return <Text>Loading...</Text>;
    if (isError) return <Text>Error: {error.message}</Text>

    const filtredData = data.filter((item) => {
        if (!selectedGroups || !selectedMessages) return false;
        return selectedGroups.includes(item.group) && selectedMessages.includes(item.type)
    })

    const filtreColon = tableColumns.filter((colon) => {
        if (!tableColumnsZus) return false;
        return tableColumnsZus.includes(colon.value); 
    })



    return (
        <Table.ScrollArea>
            <Table.Root striped='true' size='sm' stickyHeader>
                <Table.Header>
                        <Table.Row >
                            {filtreColon.map((colon, index) => (
                                <Table.ColumnHeader textAlign='center' key={index}>{colon.label}</Table.ColumnHeader>
                            ))}
                        </Table.Row>
                </Table.Header>
                <Table.Body>
                    {filtredData.map((item, index) => (
                        <Table.Row key={index}>
                            {filtreColon.map((colon, indexCol) => 
                                <Table.Cell textAlign='center' key={indexCol}>{item[colon.value]}</Table.Cell>
                            )}
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>    
    )
}