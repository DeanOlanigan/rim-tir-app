import {
    Box,
    AbsoluteCenter,
    Alert,
    VStack,
    Heading,
    Flex,
} from "@chakra-ui/react";
import { VariablesTable } from "./VariableEditor/Table/VariablesTable";
import { VariableEditor } from "./VariableEditor/VariableEditor";
import { memo, useMemo } from "react";
import { useVariablesStore } from "../../../store/variables-store";
import { selectSelectedData } from "../../../store/selectors";
import { DataObjectsTable } from "./ConnectionEditor/Table/Table";
import { ContainerNodeEditor } from "./ConnectionEditor/ContainerNodeEditor";
import { DataObjectEditor } from "./ConnectionEditor/DataObjectEditor";
import { EditorBreadcrumb } from "./Breadcrumb";

// TODO Лишний ререндер, мб вынести логику с выбором данных в другое место?
export const EditorWrapper = memo(function EditorWrapper({ type }) {
    console.log("Render EditorWrapper");
    //const selectedData = useVariablesStore((state) => state.selectedNode);
    //const selectedData = [];

    const settings = useVariablesStore((state) => state.settings);
    const selectedIds = useVariablesStore((state) => state.selectedIds[type]);

    const selectedData = useMemo(() => {
        return selectSelectedData(settings, selectedIds);
    }, [settings, selectedIds]);

    //const selectedData = [];

    if (!selectedData || selectedData.length === 0) {
        return <EditorAlert status={"info"} type={type} />;
    }

    if (selectedData.length === 1) {
        const [singleNode] = selectedData;
        const nodeType = singleNode.type;

        if (singleNode.children === undefined) {
            return type === "connections" ? (
                <DataObjectEditor data={singleNode} />
            ) : (
                <VariableEditor data={singleNode} />
            );
        }

        const childrens = Array.from(singleNode.children)
            .map((key) => settings[key])
            .filter(Boolean);

        if (nodeType === "protocol" || nodeType === "interface") {
            return (
                <VStack gap={"4"} px={"1"} h={"100%"} align={"start"}>
                    <EditorBreadcrumb data={singleNode} />
                    <ContainerNodeEditor data={singleNode} />
                </VStack>
            );
        }

        if (
            nodeType === "functionGroup" ||
            nodeType === "asdu" ||
            nodeType === "folder"
        ) {
            return (
                <VStack gap={"4"} px={"1"} h={"100%"} align={"start"}>
                    <EditorBreadcrumb data={singleNode} />
                    <ContainerNodeEditor data={singleNode} />
                    <Box w={"100%"} h={"100%"} overflow={"auto"}>
                        {type === "connections" && childrens.length > 0 && (
                            <DataObjectsTable data={childrens} />
                        )}
                        {type === "variables" && (
                            <VariablesTable data={childrens} />
                        )}
                    </Box>
                </VStack>
            );
        }

        return <div>Неизвестный узел</div>;
    }

    if (selectedData.length > 1) {
        const [first] = selectedData;
        const sameLevelAndType = selectedData.every(
            (element) =>
                /* element.level === first.level &&  */ element.type ===
                first.type
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
                            Выбрано: {selectedData.length}
                        </Heading>
                    </Flex>
                    <Box w={"100%"} h={"100%"} overflow={"auto"}>
                        <VariablesTable data={selectedData} />
                    </Box>
                </VStack>
            );
        }
    }

    return <EditorAlert status={"error"} type={type} />;
});

const EditorAlert = ({ status, type }) => {
    return (
        <Box w={"100%"} h={"100%"} position={"relative"}>
            <AbsoluteCenter>
                <Alert.Root status={status}>
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>
                            {status === "error" && "Ошибка"}
                            {status === "info" && "Ничего не выбрано"}
                        </Alert.Title>
                        <Alert.Description>
                            {status !== "error"
                                ? type === "connections"
                                    ? "Выберите узел в дереве приема или передачи"
                                    : "Выберите узел в дереве переменных"
                                : "Выберите узлы одинакового типа."}
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            </AbsoluteCenter>
        </Box>
    );
};
