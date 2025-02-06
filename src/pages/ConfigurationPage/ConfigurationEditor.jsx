import { Box, Stack, StackSeparator, Text, Input, Field, Flex, Editable, IconButton, Badge, AbsoluteCenter } from "@chakra-ui/react";
import { LuPencilLine, LuX, LuCheck } from "react-icons/lu";
import { headerMapping } from "../MonitoringPage/mappings";
import { useState } from "react";
import { Switch } from "../../components/ui/switch";

const nameMapping = {
    dataObject: "Информационный объект",
};

const renderData = (row) => {
    if (!row) return null;
    return row.map((element, index) => {
        if (element.children !== null && row.length <= 1) {
            return renderData(element.children);
        }
        return (    
            <Box key={index}>
                {/* <DataObjectHeader element={element} /> */}
                <Flex gap={"2"}>
                    {
                        Object.keys(element.data.setting).map((key, index) => {
                            return (
                                <Field.Root key={index}>
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
                </Flex>
            </Box>
        );
    });
};

export const ConfigurationEditor = ({data}) => {
    console.log("Render ConfigurationEditor");
    console.log("ConfigurationEditor data:", data);

    return (
        <Stack 
            direction={"column"} 
            separator={<StackSeparator />}
            w={"100%"}
            h={"100%"}
            overflow={"auto"}
            p={"2"}
        >
            { renderData(data) }
        </Stack>
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

    return (
        <Flex direction={"row"} w={"100%"} h={"100%"} gap={"2"}>
            <Flex w={"100%"} h={"100%"}>
                { renderData(data) }
            </Flex>
            <Flex
                h={"100%"}
                w={"750px"}
                background={"bg.muted"}
                borderRadius={"sm"}
                p={"2"}
                gap={"2"}
                direction={"column"}
            >
                <Switch>Lua</Switch>
                <Box 
                    w={"100%"}
                    h={"100%"}
                    background={"bg.emphasized"}
                    borderRadius={"sm"}
                    position={"relative"}
                >
                    <AbsoluteCenter>
                        Тут будет lua код
                    </AbsoluteCenter>
                </Box>
            </Flex>
        </Flex>
    );
};
