import { useState } from "react";
import { Flex, Box, Field, AbsoluteCenter, Textarea, Stack } from "@chakra-ui/react";
import {
    NumberInputField,
    NumberInputRoot
} from "../../../components/ui/number-input";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../../components/ui/select";
import { VariableEditorHeader } from "./VariableEditorHeader";
import { ToggleSection } from "./ToggleSection";
import { headerMapping } from "../../MonitoringPage/mappings";
import { dataTypes, groups } from "../../../config/filterOptions";

export const VariableEditor = ({data}) => {
    const [isLuaBlockVisible, setIsLuaBlockVisible] = useState(data.data.setting.isLua);
    const [isSpecialBlockVisible, setIsSpecialBlockVisible] = useState(data.data.setting.isSpecial);

    return (
        <Flex
            direction={"column"}
            gap={"4"}
            w={"100%"}
            h={"100%"}
            px={"1"}
            align={"center"}
        >
            <VariableEditorHeader data={data} />
            <Box
                maxW={"6xl"}
                w={"100%"}
                overflow={"auto"}
                border={"1px solid"}
                borderColor={"border"}
                borderRadius={"md"}
                shadow={"md"}
                p={"2"}
            >
                <Stack 
                    direction={{ base: "column", md: "row" }}
                >
                    <Box
                        w={"100%"}
                    >
                        <ToggleSection
                            data={data}
                            setIsLuaBlockVisible={setIsLuaBlockVisible}
                            setIsSpecialBlockVisible={setIsSpecialBlockVisible}
                        />
                        <Flex gap={"2"} p={"2"}>
                            <SelectRoot size={"xs"} collection={dataTypes}>
                                <SelectLabel>{headerMapping["type"]}</SelectLabel>
                                <SelectTrigger>
                                    <SelectValueText placeholder="Выберите тип" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dataTypes.items.map((row) => (
                                        <SelectItem item={row} key={row.value}>
                                            {row.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectRoot>
                            <SelectRoot size={"xs"} collection={groups}>
                                <SelectLabel>{headerMapping["group"]}</SelectLabel>
                                <SelectTrigger>
                                    <SelectValueText placeholder="Выберите группу" />
                                </SelectTrigger>
                                <SelectContent>
                                    {groups.items.map((row) => (
                                        <SelectItem item={row} key={row.value}>
                                            {row.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </SelectRoot>
                        </Flex>
                        <Flex p={"2"} gap={"2"}>
                            <Field.Root hidden={!isLuaBlockVisible}>
                                <Field.Label>
                                    {headerMapping["coefficient"]}
                                </Field.Label>
                                <NumberInputRoot
                                    size={"xs"}
                                    defaultValue={data.data.setting.coefficient}
                                >
                                    <NumberInputField />
                                </NumberInputRoot>
                            </Field.Root>
                            <Field.Root hidden={isSpecialBlockVisible}>
                                <Field.Label>
                                    {headerMapping["specialCycleDelay"]}
                                </Field.Label>
                                <NumberInputRoot
                                    size={"xs"}
                                    defaultValue={
                                        data.data.setting.specialCycleDelay
                                    }
                                >
                                    <NumberInputField />
                                </NumberInputRoot>
                            </Field.Root>
                        </Flex>
                        <Flex p={"2"}>
                            <Field.Root>
                                <Field.Label>
                                    {headerMapping["description"]}
                                </Field.Label>
                                <Textarea size={"xs"} resize={"none"} rows={"5"} />
                            </Field.Root>
                        </Flex>
                    </Box>
                    <Box
                        hidden={isLuaBlockVisible}
                        w={"100%"}
                        p={"2"}
                        position={"relative"}
                        borderRadius={"sm"}
                        border={"1px solid"}
                        borderColor={"border"}
                        background={"bg.muted"}
                    >
                        <AbsoluteCenter>
                            {data.data.setting.luaExpression}
                        </AbsoluteCenter>
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
};
