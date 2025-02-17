import {
    AbsoluteCenter,
    Alert,
    Box,
    Flex,
    HStack,
    Heading,
    IconButton,
    Editable,
    VStack,
} from "@chakra-ui/react";
import { PARAM_DEFINITIONS, PARENT_NAMES } from "../../../config/paramDefinitions";
import { LuPencilLine, LuX, LuCheck } from "react-icons/lu";
import { ModbusFunctionGroupTable } from "../Table/Table";
import { BaseInput } from "../InputComponents/BaseInput";

const getTypes = (node, types = []) => {
    if (!node) return [];
    if (node.level !== -1) {
        types.push(node.data.type);
        getTypes(node.parent, types);
    }
    return types;
};

export const ConfigurationEditor = ({data = []}) => {
    console.log("Render ConfigurationEditor");
    console.log("ConfigurationEditor data:", data);
    console.log("Types depth:", getTypes(data[0]));

    if (!data || data.length === 0) {
        return (
            <Box w={"100%"} h={"100%"} position={"relative"}>
                <AbsoluteCenter>
                    <Alert.Root status="info">
                        <Alert.Indicator />
                        <Alert.Content>
                            <Alert.Title>Ничего не выбрано</Alert.Title>
                            <Alert.Description>
                            Выберите узел в дереве приема или передачи.
                            </Alert.Description>
                        </Alert.Content>
                    </Alert.Root>
                </AbsoluteCenter>
            </Box>
        );
    };

    if (data.length === 1) {
        const [singleNode] = data;
        const type = singleNode.data.type;
        const subType = singleNode.data?.subType;
        if (singleNode.isLeaf) {
            return (
                <Box px={"1"} w={"100%"} h={"100%"} overflow={"auto"}>
                    <ModbusFunctionGroupTable data={data}/>
                </Box>
            );
        }
        if (type === "functionGroup" || type === "asdu" || type === "folder") {
            return (
                <VStack
                    gap={"4"}
                    px={"1"}
                    h={"100%"}
                >
                    <ParentNodeConfiguration data={singleNode}/>
                    <Box w={"100%"} h={"100%"} overflow={"auto"}>
                        <ModbusFunctionGroupTable data={singleNode.children}/>
                    </Box>
                </VStack>
            );
        };
        if (type === "protocol" || type === "interface") {
            return (
                <VStack
                    gap={"4"}
                    px={"1"}
                    h={"100%"}
                >
                    <ParentNodeConfiguration data={singleNode}/>
                </VStack>
            );
        };
    };

    if (data.length > 1) {
        const [first] = data;
        const sameLevelAndType = data.every((element) => 
            element.level === first.level && element.data.type === first.data.type
        );
        if (sameLevelAndType) {
            return (
                <Box px={"1"} w={"100%"} h={"100%"} overflow={"auto"}>
                    <ModbusFunctionGroupTable data={data}/>
                </Box>
            );
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

export const ParentNodeConfiguration = ({data}) => {
    return (
        <VStack
            w={"100%"}
            border={"1px solid"}
            borderColor={"border"}
            borderRadius={"md"}
            shadow={"md"}
            p={"4"}
            align={"self-start"}
            gap={"4"}
        >
            <HStack w={"100%"}>
                <Heading textWrap={"nowrap"}>{PARENT_NAMES[data.data.type]}</Heading>
                <Editable.Root
                    maxW={"300px"}
                    fontSize={"lg"}
                    fontWeight={"medium"}
                    defaultValue={data.data.name}
                >
                    <Editable.Preview />
                    <Editable.Input />
                    <Editable.Control>
                        <Editable.EditTrigger asChild>
                            <IconButton variant="ghost" size="xs">
                                <LuPencilLine />
                            </IconButton>
                        </Editable.EditTrigger>
                        <Editable.CancelTrigger asChild>
                            <IconButton variant="outline" size="xs">
                                <LuX />
                            </IconButton>
                        </Editable.CancelTrigger>
                        <Editable.SubmitTrigger asChild>
                            <IconButton variant="outline" size="xs">
                                <LuCheck />
                            </IconButton>
                        </Editable.SubmitTrigger>
                    </Editable.Control>
                </Editable.Root>
            </HStack>
            <Flex
                w={"100%"}
                gap={"4"}
                wrap={"wrap"}
            >
                {Object.keys(data.data.setting).map((item, index) => {
                    const definition = PARAM_DEFINITIONS[item];
                    if (!definition) return null;
                    if (definition.dependsOn) {
                        const { key, value } = definition.dependsOn;
                        if (data.data.setting[key] !== value) return null;
                    }
                    return <BaseInput key={index} definition={PARAM_DEFINITIONS[item]} value={data.data.setting[item]} showLabel/>;
                })}
            </Flex>
        </VStack>
    );
};
