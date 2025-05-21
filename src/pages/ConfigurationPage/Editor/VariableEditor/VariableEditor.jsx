import { memo } from "react";
import {
    Flex,
    Box,
    Stack,
    Icon,
    Float,
    Text,
    Card,
    HStack,
    Checkbox,
} from "@chakra-ui/react";
import { VariableEditorHeader } from "./VariableEditorHeader";
import {
    SelectInput,
    DebouncedTextarea,
    DebouncedEditor,
    BaseInput,
} from "../../InputComponents";
import { PARAM_DEFINITIONS } from "@/config/paramDefinitions";
import { useVariablesStore } from "@/store/variables-store";
import { initCardsData } from "@/utils/utils";

export const VariableEditor = memo(function VariableEditor({ data }) {
    //console.log("RENDER VariableEditor");

    const cardsData = initCardsData(data.setting);

    return (
        <>
            <VariableEditorHeader name={data.name} />
            <Stack
                direction={"column"}
                w={"100%"}
                h={"100%"}
                overflow={"auto"}
                px={"1"}
            >
                <HStack align={"start"}>
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
                </HStack>
                <ParameterCards id={data.id} data={cardsData} />
                <DebouncedEditor
                    luaExpression={data.setting.luaExpression}
                    id={data.id}
                    height={300}
                />
            </Stack>
        </>
    );
});

const ParameterCards = ({ id, data }) => {
    return (
        <Flex gap={"2"} direction={"row"} py={"2"} h={"200px"} minH={"200px"}>
            {Object.keys(data).map((key) => {
                return (
                    <ParameterCard
                        key={key}
                        param={key}
                        id={id}
                        checked={data[key].checked}
                        parameters={data[key].parameters}
                    />
                );
            })}
        </Flex>
    );
};

const ParameterCard = ({ id, param, checked, parameters }) => {
    const setSettings = useVariablesStore((state) => state.setSettings);
    const ParamIcon = PARAM_DEFINITIONS[param]?.icon || null;
    return (
        <Card.Root
            size={"sm"}
            minW={"220px"}
            _hover={{ bg: "bg.muted" }}
            shadow={"md"}
        >
            <Card.Body>
                <Float placement={"top-start"} offset={"6"}>
                    <Checkbox.Root
                        size={"lg"}
                        checked={checked}
                        onCheckedChange={(e) =>
                            setSettings(id, { [param]: !!e.checked })
                        }
                        variant={"subtle"}
                    >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                    </Checkbox.Root>
                </Float>
                <Flex
                    w={"100%"}
                    h={"100%"}
                    gap={"2"}
                    justify={"center"}
                    align={"center"}
                    direction={"column"}
                >
                    <Box h={"100%"} textAlign={"center"}>
                        {ParamIcon && <Icon fontSize={"3xl"} as={ParamIcon} />}
                        <Text fontWeight={"medium"}>
                            {PARAM_DEFINITIONS[param].label}
                        </Text>
                    </Box>

                    {checked &&
                        parameters.map((param, index) => {
                            return (
                                <BaseInput
                                    key={index}
                                    id={id}
                                    value={param.value}
                                    inputParam={param.key}
                                />
                            );
                        })}
                </Flex>
            </Card.Body>
        </Card.Root>
    );
};
