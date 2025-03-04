import {
    Box,
    AbsoluteCenter,
    Alert,
    VStack,
    Heading,
    Flex,
} from "@chakra-ui/react";
import { FolderHeader } from "../Folder/Folder";
import { VariablesTable } from "../Table/Variables/VariablesTable";
import { VariableEditor } from "./VariableEditor/VariableEditor";
import { memo, useMemo } from "react";
import { useVariablesStore } from "../../../store/variables-store";
import { selectSelectedData } from "../../../store/selectors";

// TODO Этот компонент тоже можно унифицировать
export const VariableMenu = memo(function VariableMenu() {
    console.log("Render VariableMenu");
    //const selectedData = useVariablesStore((state) => state.selectedNode);
    //const selectedData = [];

    const settings = useVariablesStore((state) => state.settings);
    const selectedIds = useVariablesStore(
        (state) => state.selectedIds.variables
    );

    const selectedData = useMemo(() => {
        return selectSelectedData(settings, selectedIds);
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
                <FolderHeader name={singleNode.name} count={childrens.length} />
                <Box w={"100%"} h={"100%"} overflow={"auto"}>
                    <VariablesTable data={childrens} />
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
