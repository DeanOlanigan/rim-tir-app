import { Card, Flex, IconButton, Link, Box, CheckboxGroup } from "@chakra-ui/react";
import { Checkbox } from "../../../components/ui/checkbox";
import {
    MenuContent,
    MenuRoot,
    MenuTrigger
} from "../../../components/ui/menu";
import { LuPause, LuPlay, LuDownload } from "react-icons/lu";
import { useJournalContext } from "../../../providers/JournalProvider/JournalContext";
import { tableColumns } from "../JournalFilter/filterOptions";
import { memo, useMemo, useRef } from "react";
import {
    AutoSizer,
    Table,
    Column,
    CellMeasurer,
    CellMeasurerCache
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
    const tableHeadersMap = {
        date: { label: "Дата и время", minWidth: "100px", maxWidth: "120px" },
        type: { label: "Тип", minWidth: "145px", maxWidth: "100px" },
        var: { label:"Переменная", minWidth: "100px", maxWidth: "100px" },
        desc: { label: "Описание", minWidth: "100px", maxWidth: "100px" },
        val: { label: "Значение", minWidth: "100px", maxWidth: "100px" },
        group: { label: "Группа", minWidth: "100px", maxWidth: "100px" }
    };
    
    const rowData = {
        journalHeaders,
        journalRows,
        tableHeadersMap
    };

    const RowRenderer = ({ index, style }) => {
        return (
            <JournalRow index={index} style={style} data={rowData}/>
        );
    };

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
                                        <Checkbox key={column.value} value={column.value}>{column.label}</Checkbox>
                                    ))}
                                </CheckboxGroup>
                            </Box>
                        </MenuContent>
                    </MenuRoot>
                </Flex>
            </Card.Header>
            <Card.Body h={"100%"} overflow={"auto"} pt={"0"} mt={"1rem"}>
                <Box
                    w={"100%"}
                    h={"100%"}
                >
                    <DynamicTable rows={journalRows} columns={columnsConfig}/>
                </Box>
                {/* <Box 
                    h={"100%"}
                    w={"100%"}
                    display={"table"}
                    tableLayout={"fixed"}
                >
                    <Box display={"table-header-group"}>
                        <Box display={"table-row"}>
                            {
                                journalHeaders.map((item) => {
                                    return (
                                        <Box
                                            key={item}
                                            display={"table-cell"}
                                            textAlign={"start"}
                                            fontWeight={"medium"}
                                            py={"3"}
                                            minW={tableHeadersMap[item].minWidth}
                                            maxW={tableHeadersMap[item].maxWidth}
                                        >
                                            {tableHeadersMap[item].label}
                                        </Box>
                                    );
                                })
                            }
                        </Box>
                    </Box>
                    <Box display={"table-row-group"}>
                        <AutoSizer>
                            {({ width, height }) => (
                                <List
                                    height={height}
                                    itemCount={journalRows.length}
                                    itemSize={60}
                                    width={width}
                                >
                                    {RowRenderer}
                                </List>
                            )}
                        </AutoSizer>
                    </Box>
                </Box> */}
                {
                    /* journalRows.map((item, index) => {
                        return (
                            <Table.Row as={"div"} key={index} background={item.mark ? "green.200" : ""}>
                                {
                                    journalHeaders.map((column)=> {
                                        return (
                                            <Table.Cell as={"div"} textAlign={"center"} key={column}>{item[column]}</Table.Cell>
                                        );
                                    })
                                }
                            </Table.Row>
                        );
                    }) */
                }
            </Card.Body>
        </Card.Root>
    );
}

const JournalRow = memo(function JournalRow({index, style, data}) {
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

function DynamicTable({ columns = columnsConfig, rows }) {
    const cache = useMemo(() => {
        return new CellMeasurerCache({
            fixedHeight: true,
            minWidth: 100, 
        });
    }, []);

    const tableRef = useRef(null);

    const cellRenderer = ({
        dataKey,
        columnIndex,
        rowIndex,
        key,
        parent,
        style 
    }) => {

        const rowData = rows[rowIndex];
        const cellValue = rowData[dataKey];

        return (
            <CellMeasurer
                key={key}
                cache={cache}
                columnIndex={columnIndex}
                rowIndex={rowIndex}
                parent={parent}
            >
                {({measure}) => (
                    <div
                        style={{
                            ...style,
                            whiteSpace: "nowrap", // чтобы строка не переносилась
                            overflow: "visible",  // или hidden, если хотите обрезать
                            textOverflow: "ellipsis"
                        }}
                        onLoad={measure} // если вдруг есть картинки, measure нужно дергать по факту загрузки
                    >
                        {cellValue}
                    </div>
                )}
            </CellMeasurer>
        );
    };

    const rowGetter = ({index}) => rows[index];

    return (
        <div>
            <AutoSizer>
                {({height, width}) => (
                    <Table
                        ref={tableRef}
                        width={width}
                        height={500}
                        headerHeight={30}
                        rowHeight={cache.rowHeight}
                        rowCount={rows.length}
                        rowGetter={rowGetter}
                        deferredMeasurementCache={cache}
                    >
                        {columns.map((col,columnIndex) => (
                            <Column
                                key={col.dataKey}
                                dataKey={col.dataKey}
                                label={col.label}
                                width={100}
                                flexGrow={1}
                                cellRenderer={(props) => 
                                    cellRenderer({
                                        ...props,
                                        columnIndex
                                    })
                                }
                            />
                        ))}
                    </Table>
                )}
            </AutoSizer>
        </div>
    );
}

export default JournalView;
