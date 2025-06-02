import { memo, useEffect, useState } from "react";
import { Box, VStack, Heading, Flex, HStack, Input } from "@chakra-ui/react";
import { VariablesTable } from "./VariableEditor/Table/VariablesTable";
import { VariableEditor } from "./VariableEditor/VariableEditor";
import { DataObjectsTable } from "./ConnectionEditor/Table/Table";
import { ContainerNodeEditor } from "./ConnectionEditor/ContainerNodeEditor";
import { ConnectionParamContainer } from "./ConnectionEditor/ConnectionParamContainer";
import { EditorBreadcrumb } from "./Breadcrumb";
import { EditorInformer } from "./EditorInformer";
import { useSelectedData } from "@/hooks/useSelectedData";
import { Wrapper } from "./Header";
import { PARENT_NAMES } from "@/config/paramDefinitions";
import { useVariablesStore } from "@/store/variables-store";

// TODO Лишний ререндер, мб вынести логику с выбором данных в другое место?
export const EditorWrapper = memo(function EditorWrapper({ type }) {
    //console.log("Render EditorWrapper");

    const data = useSelectedData(type);

    if (data.length === 0) {
        return <EditorInformer status={"info"} type={type} />;
    }

    if (data.length === 1) {
        return <EditorWrapperSingle data={data} type={type} />;
    }

    if (data.length > 1) {
        const sameLevelAndType = data.every(
            (element) => element.node.type === data[0].node.type
        );
        if (sameLevelAndType) {
            return (
                <VStack gap={"4"} px={"1"} h={"100%"}>
                    <Flex
                        w={"100%"}
                        border={"1px solid"}
                        borderColor={"border"}
                        borderRadius={"md"}
                        shadow={"md"}
                        p={"4"}
                        justify={"space-between"}
                    >
                        <Heading textWrap={"nowrap"}>
                            Множественный выбор
                        </Heading>
                        <Heading textWrap={"nowrap"}>
                            Выбрано: {data.length}
                        </Heading>
                    </Flex>
                    <Box w={"100%"} h={"100%"} overflow={"auto"}>
                        {type === "connections" && (
                            <DataObjectsTable
                                data={data.map((element) => element.node)}
                            />
                        )}
                        {type === "variables" && (
                            <VariablesTable
                                data={data.map((element) => element.node)}
                            />
                        )}
                    </Box>
                </VStack>
            );
        }
    }

    return <EditorInformer status={"error"} type={type} />;
});

const PARAMETER_COMPONENTS = {
    root: ConnectionParamContainer,
    protocol: ConnectionParamContainer,
    interface: ConnectionParamContainer,
    functionGroup: ConnectionParamContainer,
    asdu: ConnectionParamContainer,
    folder: ConnectionParamContainer,
    dataObject: ConnectionParamContainer,
    variable: VariableEditor,
    tcpBridge: ConnectionParamContainer,
};

const TABLE_COMPONENTS = {
    connections: DataObjectsTable,
    variables: VariablesTable,
};

const EditorWrapperSingle = memo(function EditorWrapperSingle({ data, type }) {
    const [{ node, children }] = data;
    let content;
    switch (node.type) {
        case "protocol":
        case "interface": {
            content = <ContainerNodeEditor data={node} />;
            break;
        }
        case "functionGroup":
        case "asdu":
        case "folder": {
            content = (
                <>
                    <ContainerNodeEditor data={node} />
                    <Box w={"100%"} h={"100%"} overflow={"auto"} px={"2"}>
                        {type === "connections" && (
                            <DataObjectsTable data={children} />
                        )}
                        {type === "variables" && (
                            <VariablesTable data={children} />
                        )}
                    </Box>
                </>
            );
            break;
        }
        case "tcpBridge":
        case "dataObject": {
            content = <ConnectionParamContainer data={node} />;
            break;
        }
        case "variable": {
            content = <VariableEditor data={node} />;
            break;
        }
        default: {
            content = <div>Неизвестный узел</div>;
        }
    }

    const nodeType = node.subType || node.type;
    const Parameters =
        PARAMETER_COMPONENTS[node.type] || (() => "Неизвестный узел");
    const Table = TABLE_COMPONENTS[type];

    return (
        <Wrapper
            breadcrumbs={<EditorBreadcrumb data={node} />}
            title={
                <HStack>
                    <Heading textWrap={"nowrap"}>
                        {PARENT_NAMES[node.type]} &quot;
                        <RenameInput id={node.id} name={node.name} />
                        &quot;
                    </Heading>
                </HStack>
            }
            counter={
                children.length > 0 && (
                    <Heading textWrap={"nowrap"}>
                        Элементов: {children.length}
                    </Heading>
                )
            }
            parameters={<Parameters data={node} />}
            table={
                children.length > 0 &&
                ["folder", "functionGroup", "asdu", "gpio"].includes(
                    nodeType
                ) && <Table data={children} />
            }
        />
        /* <VStack gap={"4"} px={"1"} h={"100%"} align={"start"}>
            <EditorBreadcrumb data={node} />
            {content}
        </VStack> */
    );
});

const RenameInput = ({ id, name }) => {
    const [innerName, setInnerName] = useState(name);
    const renameNodeSetting = useVariablesStore(
        (state) => state.renameNodeSetting
    );

    useEffect(() => {
        setInnerName(name);
    }, [name]);

    return (
        <Input
            size={"sm"}
            textAlign={"center"}
            variant={"flushed"}
            value={innerName}
            onChange={(e) => setInnerName(e.target.value)}
            onBlur={(e) => renameNodeSetting(id, e.target.value)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    renameNodeSetting(id, e.target.value);
                }
                if (e.key === "Escape") {
                    setInnerName(name);
                }
            }}
        />
    );
};
