import { Card, Flex, IconButton, Link, Box, CheckboxGroup, Text } from "@chakra-ui/react";
import { useColorModeValue } from "../../../components/ui/color-mode";
import { Checkbox } from "../../../components/ui/checkbox";
import {
    MenuContent,
    MenuRoot,
    MenuTrigger
} from "../../../components/ui/menu";
import { LuPause, LuPlay, LuDownload } from "react-icons/lu";
import { useJournalContext } from "../../../providers/JournalProvider/JournalContext";
import { tableColumns } from "../JournalFilter/filterOptions";
import { useMemo } from "react";
import {
    AutoSizer,
    Table,
    Column,
} from "react-virtualized";
import "react-virtualized/styles.css";

const columnsConfig = [
    { dataKey: "date", label: "Дата" },
    { dataKey: "type", label: "Тип" },
    { dataKey: "var", label: "Переменная" },
    { dataKey: "desc", label: "Описание" },
    { dataKey: "val", label: "Значение" },
    { dataKey: "group", label: "Группа" },
];

function JournalView() {
    const { isPaused, journalHeaders, journalRows, setIsPaused, setHeaders } = useJournalContext();
    console.log("Render JournalView");
    
    const visibleColumns = useMemo(
        () => 
            columnsConfig.filter((col) => 
                journalHeaders.includes(col.dataKey)
            ),
        [journalHeaders]
    );

    return (
        <Card.Root
            w={"100%"}
            h={"100%"}
            shadow={"xl"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Flex justifyContent={"space-between"}>
                    <Flex gap={"1"}>
                        <IconButton variant={"outline"} size={"xs"}><LuDownload/></IconButton>
                        <IconButton 
                            variant={"outline"}
                            size={"xs"}
                            onClick={() => setIsPaused(!isPaused)}
                        >
                            {
                                isPaused ? <LuPause/> : <LuPlay/>
                            }
                        </IconButton>
                    </Flex>
                    <MenuRoot>
                        <MenuTrigger asChild>
                            <Link variant={"underline"} fontSize={"sm"}>
                                показать/спрятать столбцы
                            </Link>
                        </MenuTrigger>
                        <MenuContent>
                            <Box p={"2"}>
                                <CheckboxGroup
                                    value={journalHeaders}
                                    onValueChange={(columns) => setHeaders(columns)}
                                >
                                    {tableColumns.map((column) => (
                                        <Checkbox key={column.value} value={column.value}>
                                            {column.label}
                                        </Checkbox>
                                    ))}
                                </CheckboxGroup>
                            </Box>
                        </MenuContent>
                    </MenuRoot>
                </Flex>
            </Card.Header>
            <Card.Body h={"100%"} overflow={"auto"} pt={"0"} mt={"1rem"}>
                <Box w={"100%"} h={"100%"}>
                    <DynamicTable rows={journalRows} columns={visibleColumns}/>
                </Box>
            </Card.Body>
        </Card.Root>
    );
}

/* const JournalRow = memo(function JournalRow({index, style, data}) {
    const item = data.journalRows[index];
    if (!item) return null;

    return (
        
        <Flex
            style={style}
            display={"table-row"}
            background={item.mark ? "green.200" : ""}
        >
            {
                data.journalHeaders.map((column) => (
                    <Box
                        key={column}
                        textAlign={"start"}
                        display={"table-cell"}
                        borderBottom={"1px solid black"}
                        px={"1"}
                        py={"1"}
                        minW={data.tableHeadersMap[column].minWidth}
                        maxW={data.tableHeadersMap[column].maxWidth}
                    >
                        {item[column]}
                    </Box>
                ))
            }
        </Flex>
        
    );
});

function rowRenderer(props) {
    const {
        index,
        style,
    } = props;
    return (
        <JournalRow index={index} style={style} data={rowData}/>
    );
}; */

function DynamicTable({ columns = columnsConfig, rows }) {
    const oddBackgroundColor = useColorModeValue("white", "#111111");
    const evenBackgroundColor = useColorModeValue("#e4e4e7", "#27272a");

    const rowGetter = ({ index }) => rows[index];

    const rowRenderer = (props) => {
        const {
            index,
            style,
            key,
            className,
            columns,
            rowData
        } = props;

        if (rowData.mark) {
            return (
                <Box
                    key={key}
                    className={className}
                    style={style}
                    bg={"green.200"}
                    borderBottom={"1px solid #ccc"}
                />
            );
        }

        //const rowData = rows[index];
        if (!rowData) return null;
        const backgroundColor = index % 2 === 0 ? oddBackgroundColor : evenBackgroundColor;

        return (
            <Box
                key={key}
                className={className}
                style={style}
                bg={backgroundColor}
                borderBottom={"1px solid #ccc"}
                fontSize={"sm"}
            >
                {columns}
            </Box>
        );
    };
    const cellRenderer = (props) => {
        const {
            cellData,
            columnData,
            columnIndex,
            dataKey,
            rowData,
            rowIndex,
        } = props;

        if (dataKey === "date") {
            return <Text textWrap={"wrap"}>{cellData}</Text>;
        }

        return <Text textWrap={"wrap"} textAlign={"start"} textOverflow={"ellipsis"}>{cellData}</Text>;
    };

    return (
        <Box w={"100%"} h={"100%"}>
            <AutoSizer>
                {({height, width}) => (
                    <Table
                        width={width}
                        height={height}
                        headerHeight={30}
                        rowHeight={45}
                        rowCount={rows.length}
                        rowGetter={rowGetter}
                        rowRenderer={rowRenderer}
                        headerStyle={{
                            "fontSize": "14px",
                            "text-transform": "capitalize"
                        }}
                        rowStyle={{
                            borderBottom: "1px solid #ccc"
                        }}
                    >
                        {columns.map((col) => (
                            <Column
                                key={col.dataKey}
                                dataKey={col.dataKey}
                                label={col.label}
                                width={80}
                                flexGrow={1}
                                flexShrink={1}
                                style={{
                                    textAlign: "start",
                                    textOverflow: "ellipsis",
                                    textWrap: "wrap",
                                    hyphens: "auto",
                                    alignSelf: "start",
                                }}
                            />
                        ))}
                    </Table>
                )}
            </AutoSizer>
        </Box>
    );
}

export default JournalView;
