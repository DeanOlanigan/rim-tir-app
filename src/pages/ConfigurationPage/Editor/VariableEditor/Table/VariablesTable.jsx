import { memo, useState } from "react";
import {
    Box,
    Table as ChakraTable,
    Flex,
    IconButton,
    Text,
} from "@chakra-ui/react";
import { VariablesTableHeader } from "./VariablesTableHeader";
import { VariablesTableBody } from "./VariablesTableBody";
import { AutoSizer, Table, Column, ColumnSizer } from "react-virtualized";
import { LuPencil, LuPencilOff } from "react-icons/lu";
import { dataTypesBytes } from "../../../../../config/filterOptions";

export const VariablesTable = memo(function TableConfig({ data }) {
    //console.log("RENDER VariablesTable");
    const [isEditing, setIsEditing] = useState(false);
    const [editingRowIndex, setEditingRowIndex] = useState(null);

    return (
        <ChakraTable.Root>
            <VariablesTableHeader />
            <VariablesTableBody data={data} />
        </ChakraTable.Root>
        /* <AutoSizer>
            {({ height, width }) => (
                <Table
                    headerHeight={40}
                    height={height}
                    width={width}
                    rowCount={data.length}
                    rowGetter={({ index }) => data[index]}
                    rowHeight={40}
                    rowRenderer={rowRenderer}
                    headerRowRenderer={rowRenderer}
                >
                    <Column
                        width={55}
                        headerRenderer={labelRenderer}
                        cellRenderer={(cellProps) =>
                            ToggleEditingCell({
                                ...cellProps,
                                isEditing,
                                setIsEditing,
                                setEditingRowIndex,
                            })
                        }
                    />
                    <Column
                        width={150}
                        label="Имя"
                        dataKey="name"
                        headerRenderer={labelRenderer}
                    />
                    <Column width={150} headerRenderer={labelRenderer} />
                    <Column
                        width={150}
                        flexGrow={1}
                        label="Тип данных"
                        dataKey="type"
                        cellDataGetter={selectTypeGetter}
                        headerRenderer={labelRenderer}
                    />
                    <Column
                        width={150}
                        flexGrow={1}
                        label="Lua выражение"
                        dataKey="luaExpression"
                        cellDataGetter={({ rowData }) =>
                            rowData.setting.luaExpression
                        }
                        headerRenderer={labelRenderer}
                        cellRenderer={(cellProps) =>
                            LuaViewCell({
                                ...cellProps,
                                isEditing,
                                setIsEditing,
                            })
                        }
                    />
                    <Column
                        width={150}
                        flexGrow={1}
                        label="Описание"
                        dataKey="description"
                        cellDataGetter={({ rowData }) =>
                            rowData.setting.description
                        }
                        headerRenderer={labelRenderer}
                    />
                </Table>
            )}
        </AutoSizer> */
    );
});

const rowRenderer = (props) => {
    const { key, className, columns, style } = props;
    return (
        <Box
            key={key}
            className={`${className} group`}
            style={style}
            borderBottom={"1px solid"}
            borderColor={"border"}
        >
            {columns}
        </Box>
    );
};

const labelRenderer = ({ label }) => {
    return (
        <Text
            textTransform={"none"}
            fontSize={"sm"}
            fontWeight={"500"}
            color={"fg"}
        >
            {label}
        </Text>
    );
};

const selectTypeGetter = (props) => {
    const { rowData } = props;
    return dataTypesBytes.items.find(
        (item) => item.value === rowData.setting.type
    ).label;
};

const ToggleEditingCell = ({
    rowIndex,
    isEditing,
    setIsEditing,
    setEditingRowIndex,
}) => {
    return (
        <Flex gap={"1"} justify={"center"}>
            {isEditing ? (
                <>
                    <IconButton
                        size={"xs"}
                        variant={"plain"}
                        onClick={() => {
                            //setIsEditing(false);
                            setEditingRowIndex(null);
                        }}
                        opacity={"0"}
                        _groupHover={{ opacity: 1 }}
                    >
                        <LuPencilOff />
                    </IconButton>
                </>
            ) : (
                <IconButton
                    size={"xs"}
                    variant={"plain"}
                    onClick={() => {
                        //setIsEditing(true);
                        setEditingRowIndex(rowIndex);
                    }}
                    opacity={"0"}
                    _groupHover={{ opacity: 1 }}
                >
                    <LuPencil />
                </IconButton>
            )}
        </Flex>
    );
};
import { DebouncedEditor } from "../../../InputComponents";
const LuaViewCell = ({ rowData, isEditing }) => {
    if (isEditing) {
        return (
            <DebouncedEditor
                id={rowData.id}
                luaExpression={rowData.setting.luaExpression}
                height={"253px"}
                width={"450px"}
            />
        );
    } else {
        return (
            rowData.setting.luaExpression && (
                <CodePreview code={rowData.setting.luaExpression} />
            )
        );
    }
};

import { Editor } from "@monaco-editor/react";
import { useColorMode } from "../../../../../components/ui/color-mode";
import { HoverCard, Code, Portal } from "@chakra-ui/react";
const CodePreview = ({ code }) => {
    const { colorMode } = useColorMode();
    return (
        <HoverCard.Root lazyMount unmountOnExit>
            <HoverCard.Trigger>
                <Code size={"sm"} maxW={"150px"} truncate lineClamp={2}>
                    {code}
                </Code>
            </HoverCard.Trigger>
            <Portal>
                <HoverCard.Positioner>
                    <HoverCard.Content w={"400px"} h={"300px"} p={"2"}>
                        <Editor
                            defaultLanguage="lua"
                            theme={colorMode === "light" ? "vs" : "vs-dark"}
                            defaultValue={code}
                            options={{
                                readOnly: true, // редактор только для чтения
                                minimap: { enabled: false }, // скрыть мини-карту
                                lineNumbers: "off", // отключить нумерацию строк
                                renderLineHighlight: "none", // убрать подсветку текущей строки
                                contextmenu: false, // отключить контекстное меню
                                scrollBeyondLastLine: false, // чтобы не было лишнего прокручивания
                                scrollbar: {
                                    vertical: "hidden", // скрыть вертикальный скролл
                                    horizontal: "hidden", // скрыть горизонтальный скролл
                                },
                            }}
                        />
                    </HoverCard.Content>
                </HoverCard.Positioner>
            </Portal>
        </HoverCard.Root>
    );
};
