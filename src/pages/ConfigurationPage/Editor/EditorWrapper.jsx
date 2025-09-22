import { memo } from "react";
import {
    Box,
    VStack,
    Heading,
    Flex,
    HStack,
    AbsoluteCenter,
    Icon,
    Text,
} from "@chakra-ui/react";
import { VariablesTable } from "./VariableEditor/Table/VariablesTable";
import { VariableEditor } from "./VariableEditor/VariableEditor";
import { DataObjectsTable } from "./ConnectionEditor/Table/Table";
import { ConnectionParamContainer } from "./ConnectionEditor/ConnectionParamContainer";
import { EditorBreadcrumb } from "../Breadcrumb/Breadcrumb";
import { useSelectedData } from "@/hooks/useSelectedData";
import { EditorLayout } from "./EditorLayout";
import { InputFactory } from "../InputComponents/InputFactory";
import { configuratorConfig } from "@/utils/configurationParser";
import { NodeError } from "./NodeError";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useValidationStore } from "@/store/validation-store";
import { LuCog, LuVariable } from "react-icons/lu";
import {
    useChildrenNodes,
    useNodesByIds,
    useSelectedIds,
} from "@/store/selectors";

// TODO Лишний ререндер, мб вынести логику с выбором данных в другое место?
export const EditorWrapper = memo(function EditorWrapper({ type }) {
    /* const data = useSelectedData(type); */
    const ids = useSelectedIds(type);
    const size = ids.size;

    if (size === 0) return <EditorHint type={type} />;
    if (size === 1) {
        const id = Array.from(ids);
        return <EditorWrapperSingleTEST id={id} type={type} />;
    }
    /* if (size > 1) return <EditorWrapperMultiple data={data} type={type} />; */

    /* if (data.length === 0) {
        return <EditorHint type={type} />;
    }

    if (data.length === 1) {
        return <EditorWrapperSingle data={data} type={type} />;
    }

    if (data.length > 1) {
        const sameLevelAndType = data.every(
            (element) => element.node.type === data[0].node.type
        );
        if (sameLevelAndType) {
            return <EditorWrapperMultiple data={data} type={type} />;
        }
    } */
});

const TITLE = {
    root: <Heading>Корневой узел</Heading>,
    dataObject: <Heading>Объект данных</Heading>,
};

const EditorWrapperSingleTEST = memo(function EditorWrapperSingleTEST({
    id,
    type,
}) {
    console.log("Render EditorWrapperSingleTEST");
    const [node] = useNodesByIds(id);
    const children = useChildrenNodes(node.id);

    console.log(node, children);

    const Parameters =
        configuratorConfig.nodePaths[node.path] &&
        (node.path === "#/variable"
            ? VariableEditor
            : ConnectionParamContainer);

    const isVariableTable =
        children.length > 0 && children.every((n) => n.type === "variable");
    const Table = isVariableTable ? VariablesTable : DataObjectsTable;

    const breadcrumbs = useBreadcrumb(node.id);

    const validationErrors = useValidationStore((state) =>
        state.errorsTree.get(node.id)?.get("node")
    );

    const renderTable = () => {
        if (
            children.length > 0 &&
            ["folder", "protocolSpecific", "protocol"].includes(node.type)
        ) {
            if (
                node.type === "folder" &&
                node.path === "#/folder" &&
                type === "connections"
            )
                return null;
            return (
                <Box w={"100%"} h={"100%"} overflow={"auto"}>
                    <Table data={children} />
                </Box>
            );
        }
    };

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
            id={
                <Text
                    fontWeight={"medium"}
                    fontFamily={"mono"}
                    fontSize={"xs"}
                    color={"fg.subtle"}
                >
                    {node.id}
                </Text>
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
            table={renderTable()}
        />
    );
});

const EditorWrapperSingle = memo(function EditorWrapperSingle({ data, type }) {
    const [{ node, children }] = data;
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

    const renderTable = () => {
        if (
            children.length > 0 &&
            ["folder", "protocolSpecific", "protocol"].includes(node.type)
        ) {
            if (
                node.type === "folder" &&
                node.path === "#/folder" &&
                type === "connections"
            )
                return null;
            return (
                <Box w={"100%"} h={"100%"} overflow={"auto"}>
                    <Table data={children} />
                </Box>
            );
        }
    };

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
            id={
                <Text
                    fontWeight={"medium"}
                    fontFamily={"mono"}
                    fontSize={"xs"}
                    color={"fg.subtle"}
                >
                    {node.id}
                </Text>
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
            table={renderTable()}
        />
    );
});

const EditorWrapperMultiple = memo(function EditorWrapperMultiple({
    data,
    type,
}) {
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
                <Heading textWrap={"nowrap"}>Множественный выбор</Heading>
                <Heading textWrap={"nowrap"}>Выбрано: {data.length}</Heading>
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
});

const EditorHint = ({ type }) => {
    const hintText =
        type === "connections"
            ? "Выберите узел в дереве приема или передачи"
            : "Выберите узел в дереве переменных";
    const HintIcon = type === "connections" ? LuCog : LuVariable;
    return (
        <Box w={"100%"} h={"100%"} position={"relative"}>
            <AbsoluteCenter>
                <VStack textAlign={"center"}>
                    <Icon as={HintIcon} fontSize={"164px"} color={"bg.muted"} />
                    <Text color={"fg.subtle"} fontWeight={"medium"}>
                        {hintText}
                    </Text>
                </VStack>
            </AbsoluteCenter>
        </Box>
    );
};
