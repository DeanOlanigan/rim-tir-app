import { memo } from "react";
import { Box, VStack, Heading, Flex } from "@chakra-ui/react";
import { VariablesTable } from "./VariableEditor/Table/VariablesTable";
import { VariableEditor } from "./VariableEditor/VariableEditor";
import { DataObjectsTable } from "./ConnectionEditor/Table/Table";
import { ContainerNodeEditor } from "./ConnectionEditor/ContainerNodeEditor";
import { DataObjectEditor } from "./ConnectionEditor/DataObjectEditor";
import { EditorBreadcrumb } from "./Breadcrumb";
import { EditorInformer } from "./EditorInformer";
import { useSelectedData } from "@/hooks/useSelectedData";

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
        case "dataObject": {
            content = <DataObjectEditor data={node} />;
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
    return (
        <VStack gap={"4"} px={"1"} h={"100%"} align={"start"}>
            <EditorBreadcrumb data={node} />
            {content}
        </VStack>
    );
});
