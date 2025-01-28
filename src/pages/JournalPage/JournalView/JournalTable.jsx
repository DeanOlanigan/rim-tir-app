import { Box, Text } from "@chakra-ui/react";
import { useColorModeValue } from "../../../components/ui/color-mode";
import { AutoSizer, Table, Column } from "react-virtualized";

function JournalTable({ scrollRef, columns, rows }) {
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
                    textAlign={"center"}
                    justifyContent={"center"}
                >
                    {rowData.message}
                </Box>
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
                        ref={scrollRef}
                        width={width}
                        height={height}
                        headerHeight={30}
                        rowHeight={45}
                        rowCount={rows.length}
                        rowGetter={rowGetter}
                        rowRenderer={rowRenderer}
                        headerStyle={{
                            fontSize: "14px",
                            textTransform: "math-auto"
                        }}
                        rowStyle={{
                            borderBottom: "1px solid #ccc"
                        }}
                    >
                        {columns.map((col) => (
                            <Column
                                key={col.value}
                                dataKey={col.value}
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
export default JournalTable;
