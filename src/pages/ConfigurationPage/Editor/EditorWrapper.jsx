import { Box, VStack, Heading, Flex } from "@chakra-ui/react";
import { VariablesTable } from "./VariableEditor/Table/VariablesTable";
import { VariableEditor } from "./VariableEditor/VariableEditor";
import { memo, useMemo } from "react";
import { useVariablesStore } from "../../../store/variables-store";
import { selectSelectedData } from "../../../store/selectors";
import { DataObjectsTable } from "./ConnectionEditor/Table/Table";
import { ContainerNodeEditor } from "./ConnectionEditor/ContainerNodeEditor";
import { DataObjectEditor } from "./ConnectionEditor/DataObjectEditor";
import { EditorBreadcrumb } from "./Breadcrumb";
import { getParentTypeNormalized } from "../../../utils/utils";
import { EditorInformer } from "./EditorInformer";

// TODO Лишний ререндер, мб вынести логику с выбором данных в другое место?
export const EditorWrapper = memo(function EditorWrapper({ type }) {
    //console.log("Render EditorWrapper");

    const settings = useVariablesStore((state) => state.settings);
    const selectedIds = useVariablesStore((state) => state.selectedIds[type]);
    const selectedData = useMemo(() => {
        return selectSelectedData(settings, selectedIds);
    }, [settings, selectedIds]);
    const [singleNode] = selectedData;
    const meaningfulParentType = getParentTypeNormalized({
        data: settings,
        id: singleNode?.id,
    });

    console.log(
        `%c${meaningfulParentType}`,
        "color: white; background: green;"
    );

    if (!selectedData || selectedData.length === 0) {
        return <EditorInformer status={"info"} type={type} />;
    }

    if (selectedData.length === 1) {
        const nodeType = singleNode.type;

        console.log(`%c${nodeType}`, "color: white; background: darkgreen;");

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
        //.reverse();

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
            let cType = childrens.find((row) => row.type !== "folder")?.type;
            console.log(
                `%c${singleNode.type}
${cType}`,
                "color: white; background: green;"
            );

            return (
                <VStack gap={"4"} px={"1"} h={"100%"} align={"start"}>
                    <EditorBreadcrumb data={singleNode} />
                    <ContainerNodeEditor data={singleNode} />
                    <Box w={"100%"} h={"100%"} overflow={"auto"} px={"2"}>
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
        const sameLevelAndType = selectedData.every(
            (element) =>
                /* element.level === first.level &&  */ element.type ===
                singleNode.type
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

    return <EditorInformer status={"error"} type={type} />;
});
