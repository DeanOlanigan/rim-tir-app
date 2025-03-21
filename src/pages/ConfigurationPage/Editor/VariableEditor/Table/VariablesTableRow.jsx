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
    Status,
    Button,
    NumberInput,
    Code,
} from "@chakra-ui/react";
import {
    SelectInput,
    DebouncedTextarea,
    DebouncedEditor,
} from "../../../InputComponents";
import {
    LuCheck,
    LuPencil,
    LuX,
    LuArchive,
    LuSquareTerminal,
    LuCode,
    LuRefreshCcwDot,
    LuChartSpline,
    LuPencilOff,
} from "react-icons/lu";
import { dataTypesBytes, groups } from "../../../../../config/filterOptions";
import { Editor } from "@monaco-editor/react";
import { useColorMode } from "../../../../../components/ui/color-mode";
import { Tooltip } from "../../../../../components/ui/tooltip";
import { useVariablesStore } from "../../../../../store/variables-store";
import { CheckboxCard } from "../../../../../components/ui/checkbox-card";
import { Switch } from "../../../../../components/ui/switch";

const archiveColorMap = {
    noGroup: "gray",
    warn: "orange",
    danger: "red",
    state: "teal",
};

export const VariablesTableRow = memo(function VariablesTableRow(props) {
    //console.log("RENDER VariablesTableRow");
    const {
        id,
        name,
        isSpecial,
        isLua,
        archive,
        cmd,
        type,
        group,
        /* measurement, */
        luaExpression,
        coefficient,
        specialCycleDelay,
        description,
    } = props;

    const setSettings = useVariablesStore((state) => state.setSettings);
    const [isEditing, setIsEditing] = useState(false);

    const badges = { isLua, isSpecial, archive, cmd };
    const { label: archiveLabel, value: archiveValue } = groups.items.find(
        (item) => item.value === group
    );
    const { label: typeLabel, value: typeValue } = dataTypesBytes.items.find(
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
                {isEditing ? (
                    <Flex gap={"1"} direction={"column"} h={"100%"} w={"100%"}>
                        {/* <Flex
                            p={"2"}
                            gap={"2"}
                            border={"1px solid"}
                            borderColor={"border"}
                            borderRadius={"sm"}
                            direction={"column"}
                        >
                            <Switch>В архив</Switch>
                            <SelectInput
                                targetKey={"group"}
                                id={id}
                                value={group}
                            />
                        </Flex>
                        <Flex
                            p={"2"}
                            gap={"2"}
                            border={"1px solid"}
                            borderColor={"border"}
                            borderRadius={"sm"}
                            direction={"column"}
                        >
                            <Switch>В архив</Switch>
                            <SelectInput
                                targetKey={"group"}
                                id={id}
                                value={group}
                            />
                        </Flex>
                        <Flex
                            p={"2"}
                            gap={"2"}
                            border={"1px solid"}
                            borderColor={"border"}
                            borderRadius={"sm"}
                            direction={"column"}
                        >
                            <Switch>В архив</Switch>
                            <SelectInput
                                targetKey={"group"}
                                id={id}
                                value={group}
                            />
                        </Flex>
                        <Flex
                            p={"2"}
                            gap={"2"}
                            border={"1px solid"}
                            borderColor={"border"}
                            borderRadius={"sm"}
                            direction={"column"}
                        >
                            <Switch>В архив</Switch>
                            <SelectInput
                                targetKey={"group"}
                                id={id}
                                value={group}
                            />
                        </Flex> */}
                        {/* <HoverCard.Root
                            positioning={{ placement: "right" }}
                            lazyMount
                            unmountOnExit
                        >
                            <HoverCard.Trigger>
                                <Badge
                                    variant={"solid"}
                                    colorPalette={archiveColorMap[archiveValue]}
                                    size={"md"}
                                >
                                    <LuArchive />
                                </Badge>
                            </HoverCard.Trigger>
                            <Portal>
                                <HoverCard.Positioner>
                                    <HoverCard.Content p={"1"}>
                                        {groups.items.map((item) => (
                                            <Button
                                                key={item.value}
                                                size={"xs"}
                                                variant={"ghost"}
                                                justifyContent={"start"}
                                                onClick={() => {
                                                    setSettings(id, {
                                                        group: item.value,
                                                    });
                                                }}
                                            >
                                                <Status.Root
                                                    colorPalette={
                                                        archiveColorMap[
                                                            item.value
                                                        ]
                                                    }
                                                >
                                                    <Status.Indicator />
                                                    {item.label}
                                                </Status.Root>
                                            </Button>
                                        ))}
                                    </HoverCard.Content>
                                </HoverCard.Positioner>
                            </Portal>
                        </HoverCard.Root> */}
                        <CheckboxCard
                            icon={<LuSquareTerminal size={24} />}
                            checked={cmd}
                            align={"center"}
                            justify={"center"}
                            size={"sm"}
                            label={"Команда пользователя"}
                            onCheckedChange={(e) =>
                                setSettings(id, { cmd: e.checked })
                            }
                            colorPalette={"blue"}
                            indicator={false}
                        />
                        <CheckboxCard
                            icon={<LuCode size={24} />}
                            checked={isLua}
                            align={"center"}
                            justify={"center"}
                            size={"sm"}
                            onCheckedChange={(e) =>
                                setSettings(id, { isLua: e.checked })
                            }
                            colorPalette={"green"}
                            indicator={false}
                        />
                        <Flex
                            p={"2"}
                            gap={"2"}
                            border={"1px solid"}
                            borderColor={"border"}
                            borderRadius={"sm"}
                            direction={"column"}
                        >
                            <Switch>Специальная</Switch>
                            <NumberInput.Root size={"xs"}>
                                <NumberInput.Control />
                                <NumberInput.Input />
                            </NumberInput.Root>
                        </Flex>
                    </Flex>
                ) : (
                    <Flex gap={"1"} wrap={"wrap"}>
                        {archive && (
                            <Tooltip content={archiveLabel}>
                                <Badge
                                    variant={"solid"}
                                    colorPalette={archiveColorMap[archiveValue]}
                                    size={"sm"}
                                >
                                    <LuArchive />
                                </Badge>
                            </Tooltip>
                        )}
                        {cmd && (
                            <Tooltip content={"Команда"}>
                                <Badge
                                    variant={"outline"}
                                    colorPalette={"blue"}
                                    size={"sm"}
                                >
                                    <LuSquareTerminal />
                                </Badge>
                            </Tooltip>
                        )}
                        {isLua && (
                            <Tooltip content={"Lua"}>
                                <Badge
                                    variant={"outline"}
                                    colorPalette={"green"}
                                    size={"sm"}
                                >
                                    <LuCode />
                                </Badge>
                            </Tooltip>
                        )}
                        {isSpecial && (
                            <Tooltip content={"Специальный"}>
                                <Badge
                                    variant={"outline"}
                                    colorPalette={"purple"}
                                    size={"sm"}
                                >
                                    <LuRefreshCcwDot />
                                    {new Intl.NumberFormat("ru-RU", {
                                        style: "unit",
                                        unit: "second",
                                        unitDisplay: "short",
                                    }).format(specialCycleDelay)}
                                </Badge>
                            </Tooltip>
                        )}
                        <Tooltip content={"Показатель"}>
                            <Badge
                                variant={"outline"}
                                colorPalette={"red"}
                                size={"sm"}
                            >
                                <HStack
                                    gap={"1"}
                                    separator={<StackSeparator />}
                                >
                                    <LuChartSpline />
                                    <Text>999.999</Text>
                                    <Text>Вт</Text>
                                </HStack>
                            </Badge>
                        </Tooltip>
                    </Flex>
                )}
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
