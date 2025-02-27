import {
    Table,
    HStack,
    Icon,
    Input,
    Textarea,
    Button,
    Text,
    Box,
} from "@chakra-ui/react";
import {
    NumberInputField,
    NumberInputRoot,
} from "../../../components/ui/number-input";
import { CheckboxCard } from "../../../components/ui/checkbox-card";
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../../components/ui/select";
import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverTitle,
    PopoverTrigger,
} from "../../../components/ui/popover";
import { dataTypes, groups } from "../../../config/filterOptions";
import {
    LuArchive,
    LuSquareTerminal,
    LuCode,
    LuRefreshCcwDot,
} from "react-icons/lu";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";
import { BaseInput } from "../InputComponents/BaseInput";
import { useVariablesStore } from "../../../store/variables-store";
import { Editor } from "@monaco-editor/react";
import { useColorMode } from "../../../components/ui/color-mode";

export const TableConfig = ({ data }) => {
    const { colorMode } = useColorMode();
    const setSettings = useVariablesStore((state) => state.setSettings);

    return (
        <Table.Root size={"sm"} stickyHeader>
            <Table.Header>
                <Table.Row background={"bg.subtle"}>
                    <Table.ColumnHeader minW={"150px"}>Имя</Table.ColumnHeader>
                    <Table.ColumnHeader />
                    <Table.ColumnHeader minW={"150px"}>
                        Тип данных
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minW={"150px"}>
                        Группа
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                        minW={"50px"}
                        textWrap={"wrap"}
                        textAlign={"center"}
                    >
                        Единица измерения
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                        minW={"50px"}
                        textWrap={"wrap"}
                        textAlign={"center"}
                    >
                        Коэффициент расчета / Lua выражение
                    </Table.ColumnHeader>
                    <Table.ColumnHeader
                        minW={"50px"}
                        textWrap={"wrap"}
                        textAlign={"center"}
                    >
                        Цикличный вызов, сек
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minW={"200px"}>
                        Описание
                    </Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((element, index) => {
                    if (element.type === "folder") return null;
                    return (
                        <Table.Row key={index} background={"bg.subtle"}>
                            <Table.Cell>
                                <Input
                                    defaultValue={element.name}
                                    size={"xs"}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <HStack>
                                    <CheckboxCard
                                        w={"32px"}
                                        h={"32px"}
                                        size={"xs"}
                                        align={"center"}
                                        justify={"center"}
                                        checked={element.setting.isSpecial}
                                        onCheckedChange={(e) => {
                                            setSettings(element.id, {
                                                isSpecial: !!e.checked,
                                            });
                                        }}
                                        icon={
                                            <Icon size={"sm"}>
                                                <LuRefreshCcwDot />
                                            </Icon>
                                        }
                                        indicator={false}
                                    />
                                    <CheckboxCard
                                        w={"32px"}
                                        h={"32px"}
                                        size={"xs"}
                                        align={"center"}
                                        justify={"center"}
                                        checked={element.setting.archive}
                                        onCheckedChange={(e) => {
                                            setSettings(element.id, {
                                                archive: !!e.checked,
                                            });
                                        }}
                                        icon={
                                            <Icon size={"sm"}>
                                                <LuArchive />
                                            </Icon>
                                        }
                                        indicator={false}
                                    />
                                    <CheckboxCard
                                        w={"32px"}
                                        h={"32px"}
                                        size={"xs"}
                                        align={"center"}
                                        justify={"center"}
                                        checked={element.setting.cmd}
                                        onCheckedChange={(e) => {
                                            setSettings(element.id, {
                                                cmd: !!e.checked,
                                            });
                                        }}
                                        icon={
                                            <Icon size={"sm"}>
                                                <LuSquareTerminal />
                                            </Icon>
                                        }
                                        indicator={false}
                                    />
                                    <CheckboxCard
                                        w={"32px"}
                                        h={"32px"}
                                        size={"xs"}
                                        align={"center"}
                                        justify={"center"}
                                        checked={element.setting.isLua}
                                        onCheckedChange={(e) => {
                                            setSettings(element.id, {
                                                isLua: !!e.checked,
                                            });
                                        }}
                                        icon={
                                            <Icon size={"sm"}>
                                                <LuCode />
                                            </Icon>
                                        }
                                        indicator={false}
                                    />
                                </HStack>
                            </Table.Cell>
                            <Table.Cell>
                                <SelectRoot
                                    size={"xs"}
                                    collection={dataTypes}
                                    value={[element.setting.type]}
                                    onValueChange={(details) => {
                                        setSettings(element.id, {
                                            type: details.value[0],
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValueText placeholder="Выберите тип" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataTypes.items.map((row) => (
                                            <SelectItem
                                                item={row}
                                                key={row.value}
                                            >
                                                {row.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectRoot>
                            </Table.Cell>
                            <Table.Cell>
                                <SelectRoot
                                    size={"xs"}
                                    collection={groups}
                                    value={[element.setting.group]}
                                    onValueChange={(details) => {
                                        setSettings(element.id, {
                                            group: details.value[0],
                                        });
                                    }}
                                >
                                    <SelectTrigger>
                                        <SelectValueText placeholder="Выберите группу" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {groups.items.map((row) => (
                                            <SelectItem
                                                item={row}
                                                key={row.value}
                                            >
                                                {row.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </SelectRoot>
                            </Table.Cell>
                            <Table.Cell>
                                <Input
                                    value={element.setting.measurement}
                                    size={"xs"}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                {element.setting.isLua ? (
                                    <PopoverRoot>
                                        <PopoverTrigger asChild>
                                            <Button
                                                size={"xs"}
                                                variant={"surface"}
                                                w={"100%"}
                                                maxW={"150px"}
                                            >
                                                <Text truncate>
                                                    {element.setting
                                                        .luaExpression ||
                                                        "Написать"}
                                                </Text>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <PopoverBody>
                                                <Editor
                                                    height={"400px"}
                                                    width={"400px"}
                                                    defaultLanguage="lua"
                                                    defaultValue={
                                                        element.setting
                                                            .luaExpression
                                                    }
                                                    theme={
                                                        colorMode === "light"
                                                            ? "vs"
                                                            : "vs-dark"
                                                    }
                                                    onChange={(
                                                        value,
                                                        event
                                                    ) => {
                                                        console.log(
                                                            "value",
                                                            value
                                                        );
                                                        setSettings(data.id, {
                                                            luaExpression:
                                                                value,
                                                        });
                                                    }}
                                                />
                                            </PopoverBody>
                                        </PopoverContent>
                                    </PopoverRoot>
                                ) : (
                                    <NumberInputRoot
                                        value={element.setting.coefficient}
                                        size={"xs"}
                                        onValueChange={(data) => {
                                            setSettings(element.id, {
                                                coefficient: data.value,
                                            });
                                        }}
                                    >
                                        <NumberInputField />
                                    </NumberInputRoot>
                                )}
                            </Table.Cell>
                            <Table.Cell>
                                <NumberInputRoot
                                    disabled={!element.setting.isSpecial}
                                    value={element.setting.specialCycleDelay}
                                    size={"xs"}
                                    onValueChange={(data) => {
                                        setSettings(element.id, {
                                            specialCycleDelay: data.value,
                                        });
                                    }}
                                >
                                    <NumberInputField />
                                </NumberInputRoot>
                            </Table.Cell>
                            <Table.Cell>
                                <Textarea
                                    size={"xs"}
                                    minH={"32px"}
                                    value={element.setting.description}
                                    onChange={(e) => {
                                        setSettings(element.id, {
                                            description: e.target.value,
                                        });
                                    }}
                                />
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
};

export const ModbusFunctionGroupTable = ({ data }) => {
    return (
        <Table.Root size={"sm"} stickyHeader>
            <Table.Header>
                <Table.Row background={"bg.subtle"}>
                    {Object.keys(data[0].data.setting).map((key, index) => {
                        return (
                            <Table.ColumnHeader key={index}>
                                {PARAM_DEFINITIONS[key].label}
                            </Table.ColumnHeader>
                        );
                    })}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((element, index) => {
                    if (element.data.type === "folder") return null;
                    return (
                        <Table.Row key={index} background={"bg.subtle"}>
                            {Object.keys(element.data.setting).map(
                                (key, index) => {
                                    return (
                                        <Table.Cell key={index} minW={"150px"}>
                                            <BaseInput
                                                definition={
                                                    PARAM_DEFINITIONS[key]
                                                }
                                                value={
                                                    element.data.setting[key]
                                                }
                                            />
                                        </Table.Cell>
                                    );
                                }
                            )}
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
};
