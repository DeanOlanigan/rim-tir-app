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
import { EditorLayout } from "./EditorLayout";
import { InputFactory } from "../InputComponents/InputFactory";
import { configuratorConfig } from "@/utils/configurationParser";
import { NodeError } from "./NodeError";
import { useBreadcrumbParts } from "@/hooks/useBreadcrumb";
import { LuCog, LuVariable } from "react-icons/lu";
import {
    useChildrenNodes,
    useNodesByIds,
    useSelectedIds,
} from "@/store/selectors";
import { TREE_TYPES } from "@/config/constants";

export const EditorWrapper = memo(function EditorWrapper({ type }) {
    const ids = useSelectedIds(type);
    const size = ids.size;
    const idsArr = Array.from(ids);

    if (size === 0 || ids.has("__REACT_ARBORIST_INTERNAL_ROOT__"))
        return <EditorHint type={type} />;
    if (size === 1) {
        return <EditorWrapperSingle id={idsArr} type={type} />;
    }
    if (size > 1) return <EditorWrapperMultiple ids={idsArr} type={type} />;
});

const TITLE = {
    root: <Heading>Корневой узел</Heading>,
    dataObject: <Heading>Объект данных</Heading>,
};

const EditorWrapperSingle = memo(function EditorWrapperSingleTEST({
    id,
    type,
}) {
    const [node] = useNodesByIds(id);
    const children = useChildrenNodes(node.id);

    const Parameters =
        configuratorConfig.nodePaths[node.path] &&
        (node.path === "#/variable"
            ? VariableEditor
            : ConnectionParamContainer);

    const breadcrumbsParts = useBreadcrumbParts(node.id);

    return (
        <EditorLayout
            breadcrumbs={<EditorBreadcrumb breadcrumbs={breadcrumbsParts} />}
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
            errors={<NodeError id={node.id} />}
            counter={
                children.length > 0 && (
                    <Heading textWrap={"nowrap"}>
                        Элементов: {children.length}
                    </Heading>
                )
            }
            parameters={<Parameters data={node} />}
            table={<TableWrapper nodes={children} type={type} />}
        />
    );
});

const TableWrapper = memo(function TableWrapper({ nodes, type }) {
    if (nodes.length === 0) return null;
    const isSameType = nodes.every((n) => n.type === nodes[0].type);
    if (!isSameType) return null;
    const isVariableTable = type === TREE_TYPES.variables;
    const Table = isVariableTable ? VariablesTable : DataObjectsTable;

    return (
        <Box w={"100%"} h={"100%"} overflow={"auto"}>
            <Table data={nodes} />
        </Box>
    );
});

const EditorWrapperMultiple = memo(function EditorWrapperMultiple({
    ids,
    type,
}) {
    const nodes = useNodesByIds(ids);

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
                <Heading textWrap={"nowrap"}>Выбрано: {nodes.length}</Heading>
            </Flex>
            <Box w={"100%"} h={"100%"} overflow={"auto"}>
                <TableWrapper nodes={nodes} type={type} />
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
