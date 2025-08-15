import { memo } from "react";
import { Box, VStack, Heading, Flex, HStack } from "@chakra-ui/react";
import { VariablesTable } from "./VariableEditor/Table/VariablesTable";
import { VariableEditor } from "./VariableEditor/VariableEditor";
import { DataObjectsTable } from "./ConnectionEditor/Table/Table";
import { ConnectionParamContainer } from "./ConnectionEditor/ConnectionParamContainer";
import { EditorBreadcrumb } from "../Breadcrumb";
import { EditorInformer } from "./EditorInformer";
import { useSelectedData } from "@/hooks/useSelectedData";
import { EditorLayout } from "./EditorLayout";
import { InputFactory } from "../InputComponents/InputFactory";
import { configuratorConfig } from "@/utils/configurationParser";
import { NodeError } from "./NodeError";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useValidationStore } from "@/store/validation-store";
//import { ContainerNodeEditor } from "./ConnectionEditor/ContainerNodeEditor";

// TODO Лишний ререндер, мб вынести логику с выбором данных в другое место?
export const EditorWrapper = memo(function EditorWrapper({ type }) {
    //console.log("Render EditorWrapper", type);

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

const TITLE = {
    root: <Heading>Корневой узел</Heading>,
    dataObject: <Heading>Объект данных</Heading>,
};

const EditorWrapperSingle = memo(function EditorWrapperSingle({ data, type }) {
    const [{ node, children }] = data;
    /* let content;
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
    } */

    const Parameters =
        configuratorConfig.nodePaths[node.path] &&
        (node.path === "#/variable"
            ? VariableEditor
            : ConnectionParamContainer);

    const isVariable = children.every((node) => node.type === "variable");
    const Table = isVariable ? VariablesTable : DataObjectsTable;
    const breadcrumbs = useBreadcrumb(node.id);

    const validationErrors = useValidationStore((state) =>
        state.errorsTree.get(node.id)?.get("node")
    );

    return (
        <EditorLayout
            breadcrumbs={<EditorBreadcrumb breadcrumbs={breadcrumbs} />}
            title={
                <HStack>
                    {TITLE[node.type] || (
                        <InputFactory
                            type={"name"}
                            id={node.id}
                            inputParam={"name"}
                            path={node.path}
                            value={node.name}
                            label={"Название"}
                            showLabel
                        />
                    )}
                </HStack>
            }
            errors={<NodeError validationErrors={validationErrors} />}
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
                ["folder", "protocolSpecific", "protocol"].includes(
                    node.type
                ) && (
                    <Box w={"100%"} h={"100%"} overflow={"auto"}>
                        <Table data={children} />
                    </Box>
                )
            }
        />
    );
});
