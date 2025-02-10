import { Box, AbsoluteCenter, Alert } from "@chakra-ui/react";
import { Folder } from "./Folder/Folder";
import { MultipleVariableEditor } from "./VariableEditor/MultipleVariableEditor";
import { VariableEditor } from "./VariableEditor/VariableEditor";

export const VariableMenu = ({selectedData = [], setSelectedData}) => {
    console.log("Render VariableEditor");

    const handleSelect = (data) => {
        setSelectedData([data]);
    };

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
        return singleNode.isLeaf ? (
            <VariableEditor data={singleNode}/>
        ) : (
            <Folder data={singleNode} onSelect={handleSelect}/>
        );
    }
    
    if (selectedData.length > 1) {
        const [first] = selectedData;
        const sameLevelAndType = selectedData.every((element) => 
            element.level === first.level && element.data.type === first.data.type
        );
        if (sameLevelAndType) {
            return <MultipleVariableEditor data={selectedData[0]}/>;
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
};
