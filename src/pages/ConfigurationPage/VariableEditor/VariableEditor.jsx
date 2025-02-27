import { useState, memo } from "react";
import {
    Flex,
    Box,
    Field,
    AbsoluteCenter,
    Textarea,
    Stack,
} from "@chakra-ui/react";
import { useColorMode } from "../../../components/ui/color-mode";
import {
    NumberInputField,
    NumberInputRoot,
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
import { useVariablesStore } from "../../../store/variables-store";
import { CodeInput } from "@srsholmes/react-code-input";
import hljs from "highlight.js/lib/core";
import lua from "highlight.js/lib/languages/lua";
import Prism from "prismjs";
import "prismjs/components/prism-lua";
import { Editor } from "@monaco-editor/react";

hljs.registerLanguage("lua", lua);

const VariableEditorMemo = ({ data }) => {
    const setSettings = useVariablesStore((state) => state.setSettings);
    const { colorMode } = useColorMode();
    const [code, setCode] = useState("TEST");

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
            <Box maxW={"6xl"} w={"100%"} overflow={"auto"}>
                <Stack direction={{ base: "column", md: "row" }}>
                    <Box w={"100%"}>
                        <ToggleSection data={data} />
                        <Flex gap={"2"} p={"2"}>
                            <SelectRoot
                                size={"xs"}
                                collection={dataTypes}
                                value={[data.setting.type]}
                                onValueChange={(details) => {
                                    setSettings(data.id, {
                                        type: details.value[0],
                                    });
                                }}
                            >
                                <SelectLabel>
                                    {headerMapping["type"]}
                                </SelectLabel>
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
                            <SelectRoot
                                size={"xs"}
                                collection={groups}
                                value={[data.setting.group]}
                                onValueChange={(details) => {
                                    setSettings(data.id, {
                                        group: details.value[0],
                                    });
                                }}
                            >
                                <SelectLabel>
                                    {headerMapping["group"]}
                                </SelectLabel>
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
                            <Field.Root hidden={data.setting.isLua}>
                                <Field.Label>
                                    {headerMapping["coefficient"]}
                                </Field.Label>
                                <NumberInputRoot
                                    size={"xs"}
                                    value={data.setting.coefficient}
                                    onValueChange={(e) => {
                                        setSettings(data.id, {
                                            coefficient: e.value,
                                        });
                                    }}
                                >
                                    <NumberInputField />
                                </NumberInputRoot>
                            </Field.Root>
                            <Field.Root hidden={!data.setting.isSpecial}>
                                <Field.Label>
                                    {headerMapping["specialCycleDelay"]}
                                </Field.Label>
                                <NumberInputRoot
                                    size={"xs"}
                                    value={data.setting.specialCycleDelay}
                                    onValueChange={(e) => {
                                        setSettings(data.id, {
                                            specialCycleDelay: e.value,
                                        });
                                    }}
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
                                <Textarea
                                    size={"xs"}
                                    resize={"none"}
                                    rows={"5"}
                                    value={data.setting.description}
                                    onChange={(e) => {
                                        setSettings(data.id, {
                                            description: e.target.value,
                                        });
                                    }}
                                />
                            </Field.Root>
                        </Flex>
                    </Box>
                    <Box hidden={!data.setting.isLua} w={"100%"}>
                        <Editor
                            defaultLanguage="lua"
                            defaultValue={data.setting.luaExpression}
                            theme={colorMode === "light" ? "vs" : "vs-dark"}
                            onChange={(value, event) => {
                                //console.log("value", value);
                                setSettings(data.id, {
                                    luaExpression: value,
                                });
                            }}
                        />
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
};

export const VariableEditor = memo(VariableEditorMemo);
