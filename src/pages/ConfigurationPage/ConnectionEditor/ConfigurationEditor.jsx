import {
    AbsoluteCenter,
    Alert,
    Box,
    Field,
    Flex,
    Input,
    HStack,
    Heading,
    IconButton,
    Editable,
    VStack,
    DataList
} from "@chakra-ui/react";
import { modbusFunctionGroupTypes } from "../filterOptions";
import { headerMapping } from "../../MonitoringPage/mappings";
import { LuPencilLine, LuX, LuCheck } from "react-icons/lu";
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectLabel,
    SelectTrigger,
    SelectValueText,
} from "../../../components/ui/select";
import { ModbusFunctionGroupTable } from "../Table/Table";

const renderData = (row) => {
    if (!row) return null;
    return row.map((element) => {
        if (element.children !== null && row.length <= 1) {
            return renderData(element.children);
        }
        return (
            <>
                {
                    Object.keys(element.data.setting).map((key, index) => {
                        return (
                            <Field.Root key={index} flex={"1 1 200px"}>
                                <Field.Label>
                                    {headerMapping[key]}
                                </Field.Label>
                                {/* <Text
                                    wordBreak={"break-all"}
                                    fontSize={"sm"}
                                >
                                    {element.data.setting[key]}
                                </Text> */}
                                <Input defaultValue={element.data.setting[key]} size={"xs"}/>
                            </Field.Root>
                        );
                    })
                }
            </>
        );
    });
};

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
                <Box>TEST LEAF: {type}</Box>
            );
        }
        if (type === "functionGroup") {
            return (
                <VStack
                    gap={"4"}
                    px={"1"}
                    h={"100%"}
                >
                    <FunctionGroupHeader data={singleNode}/>
                    <Box w={"100%"} h={"100%"} overflow={"auto"}>
                        <ModbusFunctionGroupTable data={singleNode.children}/>
                    </Box>
                </VStack>
            );
        };
        if (type === "protocol" && subType === "modbus-rtu") {
            return (
                <VStack
                    gap={"4"}
                    px={"1"}
                    h={"100%"}
                >
                    <ModbusSettings data={singleNode}/>
                </VStack>
            );
        };

        return <Box>TEST FOLDER {type}</Box>;
    };

    if (data.length > 1) {
        const [first] = data;
        const sameLevelAndType = data.every((element) => 
            element.level === first.level && element.data.type === first.data.type
        );
        if (sameLevelAndType) {
            return <Box>MULTIPLE SELECTION</Box>;
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

export const FunctionGroupHeader = ({data}) => {
    return (
        <Box
            w={"100%"}
            border={"1px solid"}
            borderColor={"border"}
            borderRadius={"md"}
            shadow={"md"}
            p={"4"}
        >
            <HStack>
                <Heading textWrap={"nowrap"}>Функциональная группа</Heading>
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
            <Box maxW={"250px"}>
                <SelectRoot size={"xs"} collection={modbusFunctionGroupTypes}>
                    <SelectLabel>Функция</SelectLabel>
                    <SelectTrigger>
                        <SelectValueText placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                        {modbusFunctionGroupTypes.items.map((row) => (
                            <SelectItem item={row} key={row.value}>
                                {row.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </SelectRoot>
            </Box>
        </Box>
    );
};

export const ModbusSettings = ({data}) => {
    return (
        <Box
            w={"100%"}
            border={"1px solid"}
            borderColor={"border"}
            borderRadius={"md"}
            shadow={"md"}
            p={"4"}
        >
            <HStack mb={"2"}>
                <Heading textWrap={"nowrap"}>Протокол</Heading>
                <Editable.Root
                    maxW={"300px"}
                    fontSize={"lg"}
                    fontWeight={"medium"}
                    value={data.data.name}
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
            <DataList.Root variant={"bold"} orientation={"horizontal"} divideY={"1px"} maxW={"md"}>
                {Object.keys(data.data.setting).map((item, index) => (
                    <DataList.Item key={index}>
                        <DataList.ItemLabel>{headerMapping[item]}</DataList.ItemLabel>
                        <DataList.ItemValue>{data.data.setting[item].toString()}</DataList.ItemValue>
                    </DataList.Item>
                ))}
            </DataList.Root>
        </Box>
    );
};
