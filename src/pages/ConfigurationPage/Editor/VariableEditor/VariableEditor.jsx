import { memo } from "react";
import {
    Flex,
    Box,
    Stack,
    Icon,
    Float,
    Text,
    Card,
    Checkbox,
} from "@chakra-ui/react";
import { VariableEditorHeader } from "./VariableEditorHeader";
import { EditorBreadcrumb } from "../Breadcrumb";
import {
    SelectInput,
    DebouncedTextarea,
    DebouncedEditor,
    BaseInput,
} from "../../InputComponents";
import { PARAM_DEFINITIONS } from "../../../../config/paramDefinitions";
import { useVariablesStore } from "../../../../store/variables-store";

const initCardsData = (data) => {
    const cardsData = {};

    // Показывать isSpecial, если type === "bit"
    if (data.setting.type === "bit") {
        cardsData.isSpecial = {
            checked: data.setting.isSpecial,
            parameters: [
                {
                    key: "specialCycleDelay",
                    value: data.setting.specialCycleDelay,
                },
            ],
        };
    }

    // Показывать cmd и archive, если type === "bit" или "twoByteUnsigned"
    if (
        data.setting.type === "bit" ||
        data.setting.type === "twoByteUnsigned"
    ) {
        cardsData.cmd = {
            checked: data.setting.cmd,
            parameters: [],
        };
        cardsData.archive = {
            checked: data.setting.archive,
            parameters: [
                {
                    key: "group",
                    value: data.setting.group,
                },
            ],
        };
    }

    // Показывать graph, если type !== "bit"
    if (data.setting.type !== "bit") {
        cardsData.graph = {
            checked: data.setting.graph,
            parameters: [
                { key: "aperture", value: data.setting.aperture },
                { key: "measurement", value: data.setting.measurement },
            ],
        };
    }

    return cardsData;
};

export const VariableEditor = memo(function VariableEditor({ data }) {
    //console.log("RENDER VariableEditor");

    const cardsData = initCardsData(data);

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
                <Flex w={"100%"} direction={"column"} gap={"2"}>
                    <SelectInput
                        targetKey={"type"}
                        id={data.id}
                        value={data.setting.type}
                        showLabel
                    />
                    <ParameterCards id={data.id} data={cardsData} />
                    <DebouncedTextarea
                        targetKey={"description"}
                        id={data.id}
                        value={data.setting.description}
                        showLabel
                    />
                </Flex>
                <DebouncedEditor
                    luaExpression={data.setting.luaExpression}
                    id={data.id}
                    height={"360px"}
                />
            </Stack>
        </Flex>
    );
});

const ParameterCards = ({ id, data }) => {
    return (
        <Flex
            gap={"2"}
            direction={"column"}
            borderBottom={"1px solid"}
            borderTop={"1px solid"}
            borderColor={"border"}
            py={"2"}
        >
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
    console.log(param, checked);
    return (
        <Card.Root size={"sm"}>
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
                    gap={"4"}
                    justify={"center"}
                    align={"center"}
                    direction={"column"}
                >
                    <Box h={"100%"} w={"150px"} textAlign={"center"}>
                        {ParamIcon && (
                            <Icon fontSize={"3xl"}>
                                <ParamIcon />
                            </Icon>
                        )}
                        <Text fontWeight={"medium"}>
                            {PARAM_DEFINITIONS[param].label}
                        </Text>
                    </Box>
                    <Flex w={"100%"} gap={"2"} align={"end"} wrap={"wrap"}>
                        {checked &&
                            parameters.map((param, index) => {
                                return (
                                    <BaseInput
                                        key={index}
                                        id={id}
                                        value={param.value}
                                        inputParam={param.key}
                                        showLabel
                                    />
                                );
                            })}
                    </Flex>
                </Flex>
            </Card.Body>
        </Card.Root>
    );
};
