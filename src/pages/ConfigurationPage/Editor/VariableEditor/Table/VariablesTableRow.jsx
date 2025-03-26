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
} from "@chakra-ui/react";
import {
    SelectInput,
    DebouncedTextarea,
    DebouncedEditor,
    BaseInput,
} from "../../../InputComponents";
import { LuPencil, LuPencilOff } from "react-icons/lu";
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
            <Table.Cell p={"0.5"}>
                {isEditing ? (
                    <SelectInput targetKey={"type"} id={id} value={type} />
                ) : (
                    <Text>{typeLabel}</Text>
                )}
            </Table.Cell>
            <Table.Cell p={"0.5"}>
                {isEditing ? (
                    <DebouncedEditor
                        id={id}
                        luaExpression={luaExpression}
                        height={"253px"}
                        width={"450px"}
                    />
                ) : (
                    luaExpression && <CodePreview code={luaExpression} />
                )}
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

const CodePreview = ({ code }) => {
    const { colorMode } = useColorMode();
    return (
        <HoverCard.Root lazyMount unmountOnExit>
            <HoverCard.Trigger>
                <Code size={"sm"} maxW={"150px"} truncate lineClamp={2}>
                    {code}
                </Code>
            </HoverCard.Trigger>
            <Portal>
                <HoverCard.Positioner>
                    <HoverCard.Content w={"400px"} h={"300px"} p={"2"}>
                        <Editor
                            defaultLanguage="lua"
                            theme={colorMode === "light" ? "vs" : "vs-dark"}
                            defaultValue={code}
                            options={{
                                readOnly: true, // редактор только для чтения
                                minimap: { enabled: false }, // скрыть мини-карту
                                lineNumbers: "off", // отключить нумерацию строк
                                renderLineHighlight: "none", // убрать подсветку текущей строки
                                contextmenu: false, // отключить контекстное меню
                                scrollBeyondLastLine: false, // чтобы не было лишнего прокручивания
                                scrollbar: {
                                    vertical: "hidden", // скрыть вертикальный скролл
                                    horizontal: "hidden", // скрыть горизонтальный скролл
                                },
                            }}
                        />
                    </HoverCard.Content>
                </HoverCard.Positioner>
            </Portal>
        </HoverCard.Root>
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
            <Badge variant={variant} colorPalette={color} size={"md"}>
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
        <Popover.Root>
            <Popover.Trigger asChild>
                <Button
                    size={"2xs"}
                    variant={checked ? "solid" : "outline"}
                    colorPalette={color}
                >
                    <ParamIcon /> {label}
                </Button>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Body>
                            <Flex gap={"2"} direction={"column"}>
                                <Box pb={"2"}>
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
                                </Box>
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
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
