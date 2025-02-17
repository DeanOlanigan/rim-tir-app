import { Box, AbsoluteCenter, Alert, VStack } from "@chakra-ui/react";
import { FolderHeader } from "./Folder/Folder";
import { TableConfig } from "./Table/Table";
import { VariableEditor } from "./VariableEditor/VariableEditor";
import { memo } from "react";

export const VariableMenu = memo(function VariableMenu({selectedData = []}) {
    console.log("Render VariableEditor");

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
        return singleNode.children === undefined ? (
            <VariableEditor data={singleNode}/>
        ) : (
            <VStack
                gap={"4"}
                px={"1"}
                h={"100%"}
            >
                <FolderHeader data={singleNode} />
                <Box w={"100%"} h={"100%"} overflow={"auto"}>
                    <TableConfig data={singleNode.children} />
                </Box>
            </VStack>
        );
    }
    
    if (selectedData.length > 1) {
        const [first] = selectedData;
        const sameLevelAndType = selectedData.every((element) => 
            /* element.level === first.level &&  */element.type === first.type
        );
        if (sameLevelAndType) {
            return <TableConfig data={selectedData}/>;
        };
    };

    return (
        <Box w={"100%"} h={"100%"} position={"relative"}>
            <AbsoluteCenter>
                <Alert.Root status="error">
                    <Alert.Indicator />
                    <Alert.Content>
                        <Alert.Title>Ошибка</Alert.Title>
                        <Alert.Description>
                        Выберите узлы одинакового уровня и типа.
                        </Alert.Description>
                    </Alert.Content>
                </Alert.Root>
            </AbsoluteCenter>
        </Box>
    );
});
