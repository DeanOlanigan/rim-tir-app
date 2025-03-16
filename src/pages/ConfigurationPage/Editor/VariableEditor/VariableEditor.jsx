import { memo } from "react";
import { Flex, Box, Stack } from "@chakra-ui/react";
import { VariableEditorHeader } from "./VariableEditorHeader";
import { ToggleSection } from "./ToggleSection";
import { EditorBreadcrumb } from "../Breadcrumb";
import {
    NumberInput,
    SelectInput,
    DebouncedTextarea,
    DebouncedEditor,
} from "../../InputComponents";

export const VariableEditor = memo(function VariableEditor({ data }) {
    //console.log("RENDER VariableEditor");

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
                            archive={data.setting.archive}
                            cmd={data.setting.cmd}
                            isLua={data.setting.isLua}
                        />
                        <Flex gap={"2"} p={"2"}>
                            <SelectInput
                                targetKey={"type"}
                                id={data.id}
                                value={data.setting.type}
                                showLabel
                            />
                            <SelectInput
                                targetKey={"group"}
                                id={data.id}
                                value={data.setting.group}
                                showLabel
                            />
                        </Flex>
                        <Flex p={"2"} gap={"2"}>
                            <Box hidden={data.setting.isLua}>
                                <NumberInput
                                    targetKey={"coefficient"}
                                    id={data.id}
                                    value={data.setting.coefficient}
                                    showLabel
                                />
                            </Box>
                            <Box hidden={!data.setting.isSpecial}>
                                <NumberInput
                                    targetKey={"specialCycleDelay"}
                                    id={data.id}
                                    value={data.setting.specialCycleDelay}
                                    showLabel
                                />
                            </Box>
                        </Flex>
                        <Flex p={"2"}>
                            <DebouncedTextarea
                                targetKey={"description"}
                                id={data.id}
                                value={data.setting.description}
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
