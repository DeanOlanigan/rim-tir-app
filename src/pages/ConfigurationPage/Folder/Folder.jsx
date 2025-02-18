import {
    Box,
    Flex,
    Heading,
    Icon,
    HStack,
    Badge,
    VStack,
    Editable,
    IconButton,
    Input,
    Text,
} from "@chakra-ui/react";
import {
    LuVariable,
    LuFolder,
    LuInfinity,
    LuArchive,
    LuSquareTerminal,
    LuCode,
    LuPencilLine,
    LuX,
    LuCheck
} from "react-icons/lu";

const iconMap = {
    isLua: <LuCode/>,
    isSpecial: <LuInfinity/>,
    archive: <LuArchive/>,
    cmd: <LuSquareTerminal/>
};

export const Folder = ({data, onDoubleClick}) => {
    return (
        <VStack
            mt={"2"}
            gap={"4"}
            px={"1"}
        >
            <FolderHeader data={data}/>
            <Flex
                maxW={"6xl"}
                w={"100%"}
                h={"100%"}
                p={"2"}
                border={"1px solid"}
                borderColor={"border"}
                borderRadius={"md"}
                shadow={"md"}
                gap={"2"}
                wrap={"wrap"}
                alignContent={"start"}
            >
                {
                    data.children.map((child, index) => {
                        if (child.isLeaf) return <VariablePreview key={index} data={child} onDoubleClick={onDoubleClick}/>;
                        return <FolderPreview key={index} data={child} />;
                    })
                }
            </Flex>
        </VStack>
    );
};

export const FolderHeader = ({data}) => {
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
                <Heading textWrap={"nowrap"}>Директория</Heading>
                <Editable.Root
                    maxW={"300px"}
                    fontSize={"lg"}
                    fontWeight={"medium"}
                    value={data.name}
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
            <HStack>
                <Text textWrap={"nowrap"} fontWeight={"medium"}>Описание:</Text>
                <Editable.Root
                    value={data.setting.description}
                >
                    <Editable.Preview />
                    <Editable.Textarea />
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
        </Box>
    );
};

const FolderPreview = ({data}) => {
    return (
        <HStack
            w={"220px"}
            h={"100px"}
            border={"1px solid"}
            borderColor={"border"}
            borderRadius={"md"}
            p={"2"}
            gap={"4"}
        >
            <Flex
                direction={"column"}
                p={"2"}
                align={"center"}
            >
                <Icon size={"lg"}>
                    <LuFolder />
                </Icon>
                <Heading>{data.data.name}</Heading>
            </Flex>
            <Box>
                <Badge variant={"solid"} colorPalette={"purple"}>{data.data.setting.group}</Badge>
            </Box>
        </HStack>
    );
};

const VariablePreview = ({data, onDoubleClick}) => {
    return (
        <HStack
            w={"220px"}
            h={"100px"}
            border={"1px solid"}
            borderColor={"border"}
            borderRadius={"md"}
            p={"2"}
            gap={"4"}
            onDoubleClick={() => {
                console.log("onDoubleClick");
                onDoubleClick(data);
            }}
        >
            <Flex
                direction={"column"}
                p={"2"}
                align={"center"}
            >
                <Icon size={"lg"}>
                    <LuVariable />
                </Icon>
                <Heading>{data.data.name}</Heading>
            </Flex>
            <HStack>
                {Object.keys(data.data.setting).map((key, index) => {
                    if (data.data.setting[key] && iconMap[key]) {
                        return <Icon key={index} size={"lg"}>{iconMap[key]}</Icon>;
                    }
                })}
            </HStack>
        </HStack>
    );
};
