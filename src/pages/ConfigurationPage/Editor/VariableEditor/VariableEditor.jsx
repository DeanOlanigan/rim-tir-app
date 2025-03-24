import { memo, useState } from "react";
import {
    Flex,
    Box,
    Stack,
    CheckboxCard,
    Icon,
    Float,
    Mark,
} from "@chakra-ui/react";
import { VariableEditorHeader } from "./VariableEditorHeader";
import { ToggleSection } from "./ToggleSection";
import { EditorBreadcrumb } from "../Breadcrumb";
import {
    NumberInput,
    SelectInput,
    DebouncedTextarea,
    DebouncedEditor,
} from "../../InputComponents";
import {
    LuArchive,
    LuChartSpline,
    LuRefreshCcwDot,
    LuSquareTerminal,
} from "react-icons/lu";

export const VariableEditor = memo(function VariableEditor({ data }) {
    //console.log("RENDER VariableEditor");

    return (
        <Flex direction={"column"} gap={"4"} w={"100%"} h={"100%"} px={"1"}>
            <EditorBreadcrumb data={data} />
            <VariableEditorHeader name={data.name} />
            <Stack
                direction={{ base: "column", md: "row" }}
                w={"100%"}
                h={"100%"}
                overflow={"auto"}
            >
                <Box w={"50%"}>
                    <DebouncedEditor
                        luaExpression={data.setting.luaExpression}
                        id={data.id}
                        height={"360px"}
                    />
                    <Flex gap={"2"} p={"2"}>
                        <SelectInput
                            targetKey={"type"}
                            id={data.id}
                            value={data.setting.type}
                            showLabel
                        />
                        <DebouncedTextarea
                            targetKey={"description"}
                            id={data.id}
                            value={data.setting.description}
                            showLabel
                        />
                    </Flex>
                </Box>
                <Box w={"50%"}>
                    {/* <ToggleSection
                            id={data.id}
                            isSpecial={data.setting.isSpecial}
                            graph={data.setting?.graph || true}
                            archive={data.setting.archive}
                            cmd={data.setting.cmd}
                        /> */}

                    <Flex
                        gap={"2"}
                        h={"240px"}
                        wrap={"wrap"}
                        /* borderColor={"border"}
                            borderBottom={"1px subtle"}
                            borderTop={"1px subtle"} */
                    >
                        {data.setting.type === "bit" && <CycleCard />}
                        {(data.setting.type === "bit" ||
                            data.setting.type === "twoByteUnsigned") && (
                            <TsCard />
                        )}
                        {(data.setting.type === "bit" ||
                            data.setting.type === "twoByteUnsigned") && (
                            <TuCard />
                        )}
                        {data.setting.type !== "bit" && <GraphCard />}
                    </Flex>

                    {/* <Flex p={"2"} gap={"2"}>
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
                        </Flex> */}
                </Box>
            </Stack>
        </Flex>
    );
});

import {
    NumberInput as ChakraNumberInput,
    Field,
    Select,
    Text,
    Card,
    Checkbox,
} from "@chakra-ui/react";
const GraphCard = () => {
    const [isChecked, setIsChecked] = useState();
    const checkedHandle = () => setIsChecked(!isChecked);
    return (
        <Card.Root w={"180px"} size={"sm"}>
            <Card.Body gap={"2"}>
                <Float placement={"top-end"} offset={"6"}>
                    <Checkbox.Root
                        size={"lg"}
                        value={isChecked}
                        onCheckedChange={checkedHandle}
                        variant={"subtle"}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                </Float>
                <Flex
                    direction={"column"}
                    w={"100%"}
                    align={"center"}
                    justify={"center"}
                >
                    <Icon fontSize={"3xl"}>
                        <LuChartSpline />
                    </Icon>
                    <Text fontWeight={"medium"}>В архив ТИ</Text>
                </Flex>
            </Card.Body>
            <Card.Footer flexDirection={"column"}>
                {isChecked ? (
                    <>
                        <Field.Root disabled={!isChecked}>
                            <Field.Label>Аппертура</Field.Label>
                            <ChakraNumberInput.Root size={"xs"}>
                                <ChakraNumberInput.Label />
                                <ChakraNumberInput.Control />
                                <ChakraNumberInput.Input />
                            </ChakraNumberInput.Root>
                        </Field.Root>
                        <Select.Root size="sm" disabled={!isChecked}>
                            <Select.HiddenSelect />
                            <Select.Label>Единица измерения</Select.Label>
                            <Select.Control>
                                <Select.Trigger>
                                    <Select.ValueText />
                                </Select.Trigger>
                                <Select.IndicatorGroup>
                                    <Select.Indicator />
                                </Select.IndicatorGroup>
                            </Select.Control>
                        </Select.Root>
                    </>
                ) : (
                    <Text color={"fg.subtle"} textAlign={"center"}>
                        При изменении значения переменная будет сохранена в
                        архив телеизмерений
                    </Text>
                )}
            </Card.Footer>
        </Card.Root>
    );
};

const CycleCard = () => {
    const [isChecked, setIsChecked] = useState();
    const checkedHandle = () => setIsChecked(!isChecked);
    return (
        <Card.Root w={"180px"} size={"sm"}>
            <Card.Body gap={"2"}>
                <Float placement={"top-end"} offset={"6"}>
                    <Checkbox.Root
                        size={"lg"}
                        value={isChecked}
                        onCheckedChange={checkedHandle}
                        variant={"subtle"}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                </Float>
                <Flex
                    direction={"column"}
                    w={"100%"}
                    align={"center"}
                    justify={"center"}
                >
                    <Icon fontSize={"3xl"}>
                        <LuRefreshCcwDot />
                    </Icon>
                    <Text fontWeight={"medium"}>Цикличная</Text>
                </Flex>
            </Card.Body>
            <Card.Footer>
                {isChecked ? (
                    <Field.Root disabled={!isChecked}>
                        <Field.Label>Цикличный вызов</Field.Label>
                        <ChakraNumberInput.Root size={"xs"}>
                            <ChakraNumberInput.Label />
                            <ChakraNumberInput.Control />
                            <ChakraNumberInput.Input />
                        </ChakraNumberInput.Root>
                    </Field.Root>
                ) : (
                    <Text color={"fg.subtle"} textAlign={"center"}>
                        Переменная будет изменять состояние{" "}
                        <Mark variant={"solid"}>вкл./выкл.</Mark> с заданным
                        интервалом
                    </Text>
                )}
            </Card.Footer>
        </Card.Root>
    );
};

const TuCard = () => {
    const [isChecked, setIsChecked] = useState();
    const checkedHandle = () => setIsChecked(!isChecked);
    return (
        <Card.Root w={"180px"} size={"sm"}>
            <Card.Body gap={"2"}>
                <Float placement={"top-end"} offset={"6"}>
                    <Checkbox.Root
                        size={"lg"}
                        value={isChecked}
                        onCheckedChange={checkedHandle}
                        variant={"subtle"}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                </Float>
                <Flex
                    direction={"column"}
                    w={"100%"}
                    align={"center"}
                    justify={"center"}
                >
                    <Icon fontSize={"3xl"}>
                        <LuArchive />
                    </Icon>
                    <Text fontWeight={"medium"}>В архив ТС</Text>
                </Flex>
            </Card.Body>
            <Card.Footer>
                {isChecked ? (
                    <Select.Root size="sm">
                        <Select.HiddenSelect />
                        <Select.Label>Группа</Select.Label>
                        <Select.Control>
                            <Select.Trigger>
                                <Select.ValueText />
                            </Select.Trigger>
                            <Select.IndicatorGroup>
                                <Select.Indicator />
                            </Select.IndicatorGroup>
                        </Select.Control>
                    </Select.Root>
                ) : (
                    <Text color={"fg.subtle"} textAlign={"center"}>
                        При изменении значения переменная будет сохранена в
                        архив телесигналов
                    </Text>
                )}
            </Card.Footer>
        </Card.Root>
    );
};

const TsCard = () => {
    const [isChecked, setIsChecked] = useState();
    const checkedHandle = () => setIsChecked(!isChecked);
    return (
        <Card.Root
            w={"180px"}
            size={"sm"}
            borderColor={isChecked ? "white" : "border"}
        >
            <Card.Body gap={"2"}>
                <Float placement={"top-end"} offset={"6"}>
                    <Checkbox.Root
                        size={"lg"}
                        value={isChecked}
                        onCheckedChange={checkedHandle}
                        variant={"subtle"}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                </Float>
                <Flex
                    direction={"column"}
                    w={"100%"}
                    align={"center"}
                    justify={"center"}
                >
                    <Icon fontSize={"3xl"}>
                        <LuSquareTerminal />
                    </Icon>
                    <Text fontWeight={"medium"}>ТУ</Text>
                </Flex>
            </Card.Body>
            <Card.Footer>
                <Text color={"fg.subtle"} textAlign={"center"}>
                    Отметить переменную как изменяемую оператором вручную
                </Text>
            </Card.Footer>
        </Card.Root>
    );
};
