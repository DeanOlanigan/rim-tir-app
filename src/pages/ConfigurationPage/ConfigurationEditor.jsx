import {
    AbsoluteCenter,
    Badge,
    Box,
    Editable,
    Field,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    SimpleGrid,
    Stack,
    StackSeparator,
    Text,
    Textarea,
    VStack,
    Tabs,
    Icon
} from "@chakra-ui/react";
import { 
    LuInfinity,
    LuArchive,
    LuSquareTerminal
} from "react-icons/lu";
import { CheckboxCard } from "../../components/ui/checkbox-card";
import { useEffect, useState } from "react";
import { LuCheck, LuPencilLine, LuX } from "react-icons/lu";
import {
    NumberInputField,
    NumberInputLabel,
    NumberInputRoot
} from "../../components/ui/number-input";
import { Switch } from "../../components/ui/switch";
import { headerMapping } from "../MonitoringPage/mappings";

const nameMapping = {
    dataObject: "Информационный объект",
};

function inputTypeMapping(inputType, value) {
    switch (inputType) {
    case "isSpecial":
    case "isLua":
    case "cmd":
    case "archive":
        return (
            <Switch size={"sm"} checked={value} />
        );
    case "description":
        return (
            <Textarea size={"xs"} value={value}/>
        );
    case "coefficient":
    case "specialCycleDelay":
        return (
            <NumberInputRoot size={"xs"} defaultValue={value}>
                <NumberInputField/>
            </NumberInputRoot>
        );
    default:
        return (
            <Input defaultValue={value} size={"xs"}/>
        );
    }
}

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

export const ConfigurationEditor = ({data}) => {
    console.log("Render ConfigurationEditor");
    console.log("ConfigurationEditor data:", data);

    return (
        <Flex
            direction={"row"}
            w={"100%"}
            h={"100%"}
            overflow={"auto"}
            p={"2"}
            gap={"2"}
        >
            { renderData(data) }
        </Flex>
    );
};

function DataObjectHeader({element}) {
    const [name, setName] = useState(element.data.name);

    return (
        <Flex align={"center"} gap={"2"}>
            <Text fontWeight={"medium"} textWrap={"nowrap"}>{nameMapping[element.data.type]}</Text>
            <Editable.Root 
                value={name}
                fontWeight={"medium"}
                color={"green"}
                onChange={() => setName(name)}
                size={"xs"}
            >
                <Editable.Preview/>
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
        </Flex>
    );
}

export const VariableEditor = ({data}) => {
    console.log("Render VariableEditor");

    if (!data) return null;

    if (data.length === 1) {
        if (data[0].isLeaf) {
            return (
                <FullVariableEditor data={data[0]}/>
            );
        } else {
            return (
                <Box>
                    <Box 
                        background={"bg.muted"}
                        p={"2"}
                        borderTopLeftRadius={"md"}
                        borderEndRadius={"md"}
                    >
                        <FolderEditor data={data[0]}/>
                    </Box>
                    <Flex 
                        h={"100%"}
                    >
                        <Box 
                            background={"bg.muted"}
                            w={"15px"}
                            borderBottomRadius={"md"}
                        />
                        {
                            data[0].children.length === 1 
                                ? <FullVariableEditor data={data[0].children[0]}/> 
                                : <MultipleVariableEditor data={data[0].children}/>
                        }
                    </Flex>
                </Box>
            );
        };
    } else if (data.length > 1) {
        const sameLevel = data.every((element, index, array) => 
            index === 0 ? true : element.level === array[0].level
        );
        if (sameLevel) {
            return (
                <Stack
                    direction={"column"}
                    align={"end"}
                    gap={"2"}
                >
                    {
                        data.map((element, index) => {
                            return (
                                <SimpleVariableEditor key={index} data={element}/>
                            );
                        })
                    }
                </Stack>
            );
        }
    };

    return null;
};

const FolderEditor = ({data}) => {
    console.log("Render FolderEditor");
    
    return (
        <Box>
            <Box my={"2"}>
                <Heading>
                    Папка {data.data.name}
                </Heading>
            </Box>
            <Flex
                h={"100%"}
                w={"100%"}
                direction={"row"}
                gap={"2"}
                align={"end"}
            >
                {
                    Object.keys(data.data.setting).map((key, index) => {
                        return (
                            <Field.Root key={index} flex={"1 1 200px"}>
                                <Field.Label>
                                    {headerMapping[key]}
                                </Field.Label>
                                { inputTypeMapping(key, data.data.setting[key]) }
                                {/* <Input defaultValue={data.data.setting[key]} size={"xs"}/> */}
                            </Field.Root>
                        );
                    })
                }
            </Flex>
        </Box>
    );
};

const MultipleVariableEditor = ({data}) => {
    console.log("Render MultipleVariableEditor");

    return (
        <Box>
            <Box>Отображение первого уровня вложенности</Box>
            <Flex
                direction={"column"}
            >
                {data.map((element, index) => {
                    if (!element.isLeaf) return null;
                    return (
                        <SimpleVariableEditor key={index} data={element}/>
                    );
                })}
            </Flex>
        </Box>
    );
};

const SimpleVariableEditor = ({data}) => {
    console.log("Render SimpleVariableEditor");
    
    return (
        <Flex
            direction={"column"}
            w={"100%"}
            h={"100%"}
        >
            <Box 
                my={"2"}
                background={"bg.muted"}
            >
                <Heading>
                    Конфигурация переменной {data.data.name}
                </Heading>
            </Box>

            <Flex
                w={"100%"}
                direction={"row"}
                wrap={"wrap"}
                alignContent={"start"}
                gap={"1"}
                ps={"2"}
            >
                {
                    Object.keys(data.data.setting).map((key, index) => {
                        return (
                            <Field.Root key={index} flex={"1 1 200px"}>
                                <Field.Label>
                                    {headerMapping[key]}
                                </Field.Label>
                                { inputTypeMapping(key, data.data.setting[key]) }
                                {/* <Input defaultValue={data.data.setting[key]} size={"xs"}/> */}
                            </Field.Root>
                        );
                    })
                }
            </Flex>

        </Flex>
    );
};

const FullVariableEditor = ({data}) => {
    console.log("Render SingleVariableEditor");
    const { isLua: luaToggle, luaExpression: luaCode, ...rest } = data.data.setting;

    return (
        <Flex direction={"column"} w={"100%"} h={"100%"}>
            <HStack
                my={"2"}
                border={"1px solid"}
                borderColor={"border"}
                borderRadius={"md"}
                shadow={"md"}
                p={"4"}
            >
                <Heading textWrap={"nowrap"}>Конфигурация переменной</Heading>
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
            <HStack gap={"2"} py={"2"} px={"4"} align={"start"} w={"100%"}>
                <Flex
                    w={"calc(100% - 500px)"}
                    h={"100%"}
                    maxH={"500px"}
                    direction={"row"}
                    wrap={"wrap"}
                    alignContent={"start"}
                    gap={"4"}
                    border={"1px solid"}
                    borderColor={"border"}
                    borderRadius={"md"}
                    shadow={"md"}
                    p={"2"}
                >
                    <Flex
                        gap={"2"}
                        wrap={"wrap"}
                    >
                        <CheckboxCard
                            size={"md"}
                            align={"center"}
                            label={headerMapping["isSpecial"]}
                            defaultValue={data.data.setting.isSpecial}
                            icon={<Icon size={"lg"}><LuInfinity/></Icon>}
                            indicator={false}
                        />
                        <CheckboxCard
                            size={"md"}
                            align={"center"}
                            label={headerMapping["archive"]}
                            defaultValue={data.data.setting.archive}
                            icon={<Icon size={"lg"}><LuArchive/></Icon>}
                            indicator={false}
                        />
                        <CheckboxCard
                            size={"md"}
                            align={"center"}
                            label={headerMapping["cmd"]}
                            defaultValue={data.data.setting.cmd}
                            icon={<Icon size={"lg"}><LuSquareTerminal/></Icon>}
                            indicator={false}
                        />
                    </Flex>
                    <Flex
                        border={"1px solid"}
                        borderColor={"border"}
                        borderRadius={"md"}
                        gap={"2"}
                    >
                        <Box p={"2"}>
                            <Field.Root>
                                <Field.Label>{headerMapping["type"]}</Field.Label>
                                <Input size={"xs"} defaultValue={data.data.setting.type}/>
                            </Field.Root>
                        </Box>
                        <Box p={"2"}>
                            <Field.Root>
                                <Field.Label>{headerMapping["group"]}</Field.Label>
                                <Input size={"xs"} defaultValue={data.data.setting.group}/>
                            </Field.Root>
                        </Box>
                    </Flex>
                    <Flex
                        border={"1px solid"}
                        borderColor={"border"}
                        borderRadius={"md"}
                        gap={"2"}
                    >
                        <Box p={"2"} w={"100%"}>
                            <Field.Root>
                                <Field.Label>{headerMapping["coefficient"]}</Field.Label>
                                <NumberInputRoot size={"xs"} defaultValue={data.data.setting.coefficient}>
                                    <NumberInputField/>
                                </NumberInputRoot>
                            </Field.Root>
                        </Box>
                        <Box p={"2"} w={"100%"}>
                            <Field.Root>
                                <Field.Label>{headerMapping["specialCycleDelay"]}</Field.Label>
                                <NumberInputRoot size={"xs"} defaultValue={data.data.setting.specialCycleDelay}>
                                    <NumberInputField/>
                                </NumberInputRoot>
                            </Field.Root>
                        </Box>
                    </Flex>
                    <Flex
                        gap={"2"}
                        w={"100%"}
                    >
                        <Box p={"2"} w={"100%"}>
                            <Field.Root>
                                <Field.Label>{headerMapping["description"]}</Field.Label>
                                <Textarea size={"xs"} value={data.data.setting.description}/>
                            </Field.Root>
                        </Box>
                    </Flex>
                    {/* {Object.keys(rest).map((key, index) => {
                        return (
                            <Field.Root key={index} flex={"1 1 200px"}>
                                <Field.Label>{headerMapping[key]}</Field.Label>
                                {inputTypeMapping(key, rest[key])}
                            </Field.Root>
                        );
                    })} */}
                </Flex>
                <VStack
                    w={"500px"}
                    h={"500px"}
                    borderRadius={"md"}
                    border={"1px solid"}
                    borderColor={"border"}
                    shadow={"md"}
                    p={"2"}
                    gap={"2"}
                    direction={"column"}
                >
                    <Tabs.Root
                        defaultValue={"1"}
                        size={"sm"}
                        variant={"plain"}
                        w={"100%"}
                        h={"100%"}
                        lazyMount
                        unmountOnExit
                    >
                        <Tabs.List w={"100%"} justifyContent={"stretch"} bg="bg.muted" rounded="l3" p="1">
                            <Tabs.Trigger value="1" w={"100%"} justifyContent={"center"}>Коэффициент</Tabs.Trigger>
                            <Tabs.Trigger value="2" w={"100%"} justifyContent={"center"}>Lua</Tabs.Trigger>
                            <Tabs.Indicator rounded="l2" />
                        </Tabs.List>
                        <Box 
                            position={"relative"}
                            w={"100%"}
                            h={"100%"}
                        >
                            <Tabs.Content
                                value={"1"}
                                position={"absolute"}
                                inset={"0"}
                                _open={{
                                    animationName: "fade-in, scale-in",
                                    animationDuration: "300ms",
                                }}
                                _closed={{
                                    animationName: "fade-out, scale-out",
                                    animationDuration: "120ms",
                                }}
                            >

                            </Tabs.Content>
                            <Tabs.Content
                                value={"2"}
                                position={"absolute"}
                                inset={"0"}
                                _open={{
                                    animationName: "fade-in, scale-in",
                                    animationDuration: "300ms",
                                }}
                                _closed={{
                                    animationName: "fade-out, scale-out",
                                    animationDuration: "120ms",
                                }}
                            >
                                <Box w={"100%"} h={"100%"}>
                                    <AbsoluteCenter>
                                        {data.data.setting.luaExpression}
                                    </AbsoluteCenter>
                                </Box>
                            </Tabs.Content>
                        </Box>
                    </Tabs.Root>
                </VStack>
            </HStack>
        </Flex>
    );
};
