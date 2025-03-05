import { memo } from "react";
import { Flex, Box, Field, Stack } from "@chakra-ui/react";
import {
    NumberInputField,
    NumberInputRoot,
} from "../../../../components/ui/number-input";
import { VariableEditorHeader } from "./VariableEditorHeader";
import { ToggleSection } from "./ToggleSection";
import { headerMapping } from "../../../MonitoringPage/mappings";
import { useVariablesStore } from "../../../../store/variables-store";
import { SelectTypeCell, SelectGroupCell } from "../../Table/Variables/Cells";
import { DebouncedEditor } from "./DebouncedEditor";
import { DebouncedTextarea } from "./DebouncedTextArea";
import { EditorBreadcrumb } from "../Breadcrumb";

export const VariableEditor = memo(function VariableEditor({ data }) {
    console.log("RENDER VariableEditor");
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Flex direction={"column"} gap={"4"} w={"100%"} h={"100%"} px={"1"}>
            <EditorBreadcrumb data={data} />
            <VariableEditorHeader name={data.name} />
            <Box maxW={"6xl"} w={"100%"} overflow={"auto"}>
                <Stack direction={{ base: "column", md: "row" }}>
                    <Box w={"100%"}>
                        <ToggleSection
                            id={data.id}
                            isSpecial={data.setting.isSpecial}
                            isLua={data.setting.isLua}
                            archive={data.setting.archive}
                            cmd={data.setting.cmd}
                        />
                        <Flex gap={"2"} p={"2"}>
                            <SelectTypeCell
                                type={data.setting.type}
                                id={data.id}
                            />
                            <SelectGroupCell
                                group={data.setting.group}
                                id={data.id}
                            />
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
                            <DebouncedTextarea
                                description={data.setting.description}
                                id={data.id}
                                showLabel
                            />
                        </Flex>
                    </Box>
                    <Box hidden={!data.setting.isLua} w={"100%"}>
                        <DebouncedEditor
                            luaExpression={data.setting.luaExpression}
                            id={data.id}
                            height={"300px"}
                        />
                    </Box>
                </Stack>
            </Box>
        </Flex>
    );
});
