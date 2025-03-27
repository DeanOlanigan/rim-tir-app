import { memo, useState } from "react";
import {
    Table,
    Text,
    Flex,
    IconButton,
    HoverCard,
    Badge,
    HStack,
    StackSeparator,
    Popover,
    Portal,
    Code,
    Button,
    Checkbox,
    Switch,
    Box,
    Icon,
} from "@chakra-ui/react";
import {
    SelectInput,
    DebouncedTextarea,
    DebouncedEditor,
    BaseInput,
} from "../../../InputComponents";
import { LuChevronDown, LuPencil, LuPencilOff } from "react-icons/lu";
import { dataTypesBytes } from "../../../../../config/filterOptions";
import { Editor } from "@monaco-editor/react";
import { useColorMode } from "../../../../../components/ui/color-mode";
import { Tooltip } from "../../../../../components/ui/tooltip";
import { initCardsData } from "../../../../../utils/utils";
import { PARAM_DEFINITIONS } from "../../../../../config/paramDefinitions";
import { useVariablesStore } from "../../../../../store/variables-store";

const badgesColorMap = {
    cmd: "blue",
    graph: "red",
    isSpecial: "purple",
};

export const VariablesTableRow = memo(function VariablesTableRow(props) {
    //console.log("RENDER VariablesTableRow");
    const { id, name, setting } = props;
    const { type, luaExpression, description } = setting;
    const badgesData = initCardsData(setting);

    const [isEditing, setIsEditing] = useState(false);
    const [isEditType, setIsEditType] = useState(false);

    const { label: typeLabel } = dataTypesBytes.items.find(
        (item) => item.value === type
    );

    return (
        <Table.Row
            background={"transparent"}
            className="group"
            _hover={{ bg: "bg.muted" }}
        >
            <Table.Cell w={"55px"} p={"0.5"}>
                <Flex gap={"1"} justify={"center"}>
                    {isEditing ? (
                        <>
                            <IconButton
                                size={"xs"}
                                variant={"plain"}
                                onClick={() => setIsEditing(false)}
                                opacity={"0"}
                                _groupHover={{ opacity: 1 }}
                            >
                                <LuPencilOff />
                            </IconButton>
                        </>
                    ) : (
                        <IconButton
                            size={"xs"}
                            variant={"plain"}
                            onClick={() => setIsEditing(true)}
                            opacity={"0"}
                            _groupHover={{ opacity: 1 }}
                        >
                            <LuPencil />
                        </IconButton>
                    )}
                </Flex>
            </Table.Cell>
            <Table.Cell p={"0.5"}>
                <Text>{name}</Text>
            </Table.Cell>
            <Table.Cell minW={"155px"} p={"0.5"}>
                <BadgesCell id={id} badges={badgesData} isEditing={isEditing} />
            </Table.Cell>
            <Table.Cell p={0.5}>
                {isEditType ? (
                    <SelectInput targetKey={"type"} id={id} value={type} open />
                ) : (
                    <Text>{typeLabel}</Text>
                )}
            </Table.Cell>
            <Table.Cell p={"0.5"}>
                {luaExpression && <CodePreview id={id} code={luaExpression} />}
            </Table.Cell>
            <Table.Cell p={"0.5"}>
                {isEditing ? (
                    <DebouncedTextarea
                        targetKey={"description"}
                        id={id}
                        value={description}
                        h={"253px"}
                        w={"100%"}
                        maxW={"100%"}
                        maxH={"253px"}
                    />
                ) : (
                    <Tooltip content={description}>
                        <Text maxW={"150px"} truncate lineClamp={2}>
                            {description}
                        </Text>
                    </Tooltip>
                )}
            </Table.Cell>
        </Table.Row>
    );
});

const CodePreview = ({ id, code }) => {
    return (
        <Popover.Root lazyMount unmountOnExit>
            <Popover.Trigger>
                <Code
                    size={"sm"}
                    maxW={"150px"}
                    truncate
                    lineClamp={2}
                    _hover={{
                        bg: "bg.emphasized",
                        cursor: "pointer",
                    }}
                >
                    {code}
                </Code>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content w={"400px"} h={"300px"} p={"2"}>
                        <DebouncedEditor id={id} luaExpression={code} />
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};

const BadgesCell = ({ id, badges, isEditing }) => {
    return (
        <Flex gap={"1"} wrap={"wrap"} direction={isEditing ? "column" : "row"}>
            {Object.keys(badges).map((key, index) => {
                if (!badges[key].checked && !isEditing) return null;
                if (isEditing)
                    return (
                        <ParamEditBadge
                            key={index}
                            id={id}
                            target={key}
                            checked={badges[key].checked}
                            parameters={badges[key].parameters}
                        />
                    );
                return (
                    <ParamBadge
                        key={index}
                        target={key}
                        parameters={badges[key].parameters}
                    />
                );
            })}
        </Flex>
    );
};

const archiveColorMap = {
    noGroup: "gray",
    warn: "orange",
    danger: "red",
    state: "teal",
};

function getBadgeColor(target, parameters) {
    return target === "archive"
        ? archiveColorMap[parameters[0].value] || "gray"
        : badgesColorMap[target] || "gray";
}

function getBadgeLabel(target, parameters) {
    return target !== "archive"
        ? PARAM_DEFINITIONS[target]?.label || "N/A"
        : PARAM_DEFINITIONS[parameters[0].key].options.items.find(
              (item) => item.value === parameters[0].value
          )?.label || "N/A";
}

const ParamBadge = ({ target, parameters }) => {
    const ParamIcon = PARAM_DEFINITIONS[target]?.icon || null;
    const label = getBadgeLabel(target, parameters);
    const color = getBadgeColor(target, parameters);
    const variant = target === "archive" ? "solid" : "outline";

    return (
        <Tooltip content={label}>
            <Badge
                variant={variant}
                colorPalette={color}
                size={"md"}
                borderRadius={"full"}
            >
                <HStack gap={"2"}>
                    {ParamIcon && <ParamIcon />}
                    {target !== "archive" &&
                        parameters.map((param, index) => {
                            const selectOptions =
                                PARAM_DEFINITIONS[param.key]?.options || null;
                            let value;
                            if (selectOptions) {
                                value = selectOptions.items.find(
                                    (item) => item.value === param.value
                                )?.label;
                            } else {
                                value = param.value;
                            }
                            return (
                                <Text key={index} size={"xs"}>
                                    {value}
                                </Text>
                            );
                        })}
                </HStack>
            </Badge>
        </Tooltip>
    );
};

const ParamEditBadge = ({ id, target, checked, parameters }) => {
    const setSettings = useVariablesStore((state) => state.setSettings);
    const ParamIcon = PARAM_DEFINITIONS[target]?.icon || null;
    const label = getBadgeLabel(target, parameters);
    const color = checked ? getBadgeColor(target, parameters) : "gray";

    return (
        <Badge
            w={"150px"}
            h={"24px"}
            colorPalette={color}
            variant={checked ? "surface" : "outline"}
            justifyContent={"space-between"}
            borderRadius={"full"}
        >
            <Switch.Root
                size={"sm"}
                checked={checked}
                onCheckedChange={(e) =>
                    setSettings(id, {
                        [target]: !!e.checked,
                    })
                }
                colorPalette={color}
            >
                <Switch.HiddenInput />
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
            </Switch.Root>
            <Flex align={"center"} gap={"1"} overflow={"hidden"}>
                <Icon size={"sm"}>
                    <ParamIcon />
                </Icon>
                {parameters.map((param, index) => {
                    const selectOptions =
                        PARAM_DEFINITIONS[param.key]?.options || null;
                    let value;
                    if (selectOptions) {
                        value = selectOptions.items.find(
                            (item) => item.value === param.value
                        )?.label;
                    } else {
                        value = param.value;
                    }
                    return (
                        <Text key={index} size={"xs"} truncate>
                            {value}
                        </Text>
                    );
                })}
            </Flex>
            {parameters.length > 0 ? (
                <Popover.Root size={"xs"}>
                    <Popover.Trigger asChild>
                        <IconButton
                            size={"3xs"}
                            variant={"subtle"}
                            colorPalette={color}
                            rounded={"full"}
                            disabled={!checked}
                        >
                            <LuChevronDown />
                        </IconButton>
                    </Popover.Trigger>
                    <Portal>
                        <Popover.Positioner>
                            <Popover.Content maxW={"250px"}>
                                <Popover.Body>
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
                                </Popover.Body>
                            </Popover.Content>
                        </Popover.Positioner>
                    </Portal>
                </Popover.Root>
            ) : (
                <div style={{ width: "17px" }}></div>
            )}
        </Badge>
    );
};
