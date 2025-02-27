import { Box, AbsoluteCenter, Alert, VStack, Heading } from "@chakra-ui/react";
import { FolderHeader } from "../Folder/Folder";
import { TableConfig } from "../Table/Table";
import { VariableEditor } from "./VariableEditor";
import { memo, useMemo } from "react";
import { useVariablesStore } from "../../../store/variables-store";

export const VariableMenu = memo(function VariableMenu() {
    console.log("Render VariableEditor");
    //const selectedData = useVariablesStore((state) => state.selectedNode);
    //const selectedData = [];

    const settings = useVariablesStore((state) => state.settings);
    const selectedIds = useVariablesStore(
        (state) => state.selectedIds.variables
    );

    const selectedData = useMemo(() => {
        return Array.from(selectedIds)
            .map((key) => settings[key])
            .filter(Boolean);
        /* return Object.fromEntries(
            Object.entries(settings).filter(([key]) => selectedIds.has(key))
        ); */
    }, [settings, selectedIds]);

    //const selectedData = [];

    if (!selectedData || selectedData.length === 0) {
        return (
            <Box w={"100%"} h={"100%"} position={"relative"}>
                <AbsoluteCenter>
                    <Alert.Root status="info">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Ничего не выбрано</Alert.Title>
                            <Alert.Description>
                                Выберите узел в дереве переменных.
                            </Alert.Description>
                        </Alert.Content>
                    </Alert.Root>
                </AbsoluteCenter>
            </Box>
        );
    }

    if (selectedData.length === 1) {
        const [singleNode] = selectedData;
        if (singleNode.children === undefined) {
            return <VariableEditor data={singleNode} />;
        }

        const childrens = Array.from(singleNode.children)
            .map((key) => settings[key])
            .filter(Boolean);

        return (
            <VStack gap={"4"} px={"1"} h={"100%"}>
                <FolderHeader data={singleNode} />
                <Box w={"100%"} h={"100%"} overflow={"auto"}>
                    <TableConfig data={childrens} />
                </Box>
            </VStack>
        );
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
                    <Box
                        w={"100%"}
                        border={"1px solid"}
                        borderColor={"border"}
                        borderRadius={"md"}
                        shadow={"md"}
                        p={"4"}
                    >
                        <Heading textWrap={"nowrap"}>
                            Множественный выбор
                        </Heading>
                    </Box>
                    <Box w={"100%"} h={"100%"} overflow={"auto"}>
                        <TableConfig data={selectedData} />
                    </Box>
                </VStack>
            );
        }
    }

    return (
        <Box w={"100%"} h={"100%"} position={"relative"}>
            <AbsoluteCenter>
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>Ошибка</Alert.Title>
                        <Alert.Description>
                            Выберите узлы одинакового типа.
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            </AbsoluteCenter>
        </Box>
    );
});
