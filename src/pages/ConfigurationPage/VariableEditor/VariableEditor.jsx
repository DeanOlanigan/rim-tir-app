import { useState } from "react";
import {
    Flex,
    Box,
    Field,
    AbsoluteCenter,
    Textarea,
    Stack,
} from "@chakra-ui/react";
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
import Prism from "prismjs";
import "prismjs/components/prism-lua";
import "prismjs/themes/prism-tomorrow.css";

export const VariableEditor = ({ data }) => {
    const setSettings = useVariablesStore((state) => state.setSettings);
    const [code, setCode] = useState();

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
                                value={[data.type]}
                                onValueChange={(details) => {
                                    setSettings(data.id, {
                                        setting: { type: details.value[0] },
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
                                value={[data.group]}
                                onValueChange={(details) => {
                                    setSettings(data.id, {
                                        setting: { group: details.value[0] },
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
                            <Field.Root hidden={data.isLua}>
                                <Field.Label>
                                    {headerMapping["coefficient"]}
                                </Field.Label>
                                <NumberInputRoot
                                    size={"xs"}
                                    value={data.coefficient}
                                    onValueChange={(e) => {
                                        setSettings(data.id, {
                                            setting: { coefficient: e.value },
                                        });
                                    }}
                                >
                                    <NumberInputField />
                                </NumberInputRoot>
                            </Field.Root>
                            <Field.Root hidden={!data.isSpecial}>
                                <Field.Label>
                                    {headerMapping["specialCycleDelay"]}
                                </Field.Label>
                                <NumberInputRoot
                                    size={"xs"}
                                    value={data.specialCycleDelay}
                                    onValueChange={(e) => {
                                        setSettings(data.id, {
                                            setting: {
                                                specialCycleDelay: e.value,
                                            },
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
                                    value={data.description}
                                    onChange={(e) => {
                                        setSettings(data.id, {
                                            setting: {
                                                description: e.target.value,
                                            },
                                        });
                                    }}
                                />
                            </Field.Root>
                        </Flex>
                    </Box>
                    <Box
                        hidden={!data.isLua}
                        w={"100%"}
                        h={"100%"}
                        p={"2"}
                        position={"relative"}
                        borderRadius={"sm"}
                        border={"1px solid"}
                        borderColor={"border"}
                        background={"bg.muted"}
                    >
                        <CodeInput
                            prismJS={Prism}
                            placeholder="Input your code here..."
                            value={code}
                            language={"lua"}
                            onChange={setCode}
                            resize={"none"}
                        />
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
};
