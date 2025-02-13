import { Table, HStack, Icon, Input, Textarea } from "@chakra-ui/react";
import {
    NumberInputField,
    NumberInputRoot
} from "../../../components/ui/number-input";
import { CheckboxCard } from "../../../components/ui/checkbox-card";
import {
    SelectContent,
    SelectItem,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../../components/ui/select";
import { dataTypes, groups } from "../../../config/filterOptions";
import {
    LuArchive,
    LuSquareTerminal,
    LuCode,
    LuRefreshCcwDot
} from "react-icons/lu";

export const TableConfig = ({data}) => {

    return (
        <Table.ScrollArea>
            <Table.Root size={"sm"}>
                <Table.Header>
                    <Table.Row background={"bg.subtle"}>
                        <Table.ColumnHeader minW={"150px"}>Имя</Table.ColumnHeader>
                        <Table.ColumnHeader/>
                        <Table.ColumnHeader minW={"150px"}>Тип данных</Table.ColumnHeader>
                        <Table.ColumnHeader minW={"150px"}>Группа</Table.ColumnHeader>
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
                        <Table.ColumnHeader minW={"200px"}>Описание</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data.map((element, index) => {
                        if (element.data.type === "folder") return null;
                        return (
                            <Table.Row key={index} background={"bg.subtle"}>
                                <Table.Cell>
                                    <Input defaultValue={element.data.name} size={"xs"}/>
                                </Table.Cell>
                                <Table.Cell>
                                    <HStack>
                                        <CheckboxCard
                                            w={"32px"}
                                            h={"32px"}
                                            size={"xs"}
                                            align={"center"}
                                            justify={"center"}
                                            checked={element.data.setting.isSpecial}
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
                                            checked={element.data.setting.archive}
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
                                            checked={element.data.setting.cmd}
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
                                            checked={element.data.setting.isLua}
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
                                    <SelectRoot size={"xs"} collection={dataTypes}>
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
                                </Table.Cell>
                                <Table.Cell>
                                    <SelectRoot size={"xs"} collection={groups}>
                                        <SelectTrigger>
                                            <SelectValueText placeholder="Выберите тип" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {groups.items.map((row) => (
                                                <SelectItem item={row} key={row.value}>
                                                    {row.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </SelectRoot>
                                </Table.Cell>
                                <Table.Cell>
                                    <Input defaultValue={element.data.setting.measurement} size={"xs"}/>
                                </Table.Cell>
                                <Table.Cell>
                                    <NumberInputRoot defaultValue={element.data.setting.coefficient} size={"xs"}>
                                        <NumberInputField/>
                                    </NumberInputRoot>
                                </Table.Cell>
                                <Table.Cell>
                                    <NumberInputRoot defaultValue={element.data.setting.specialCycleDelay} size={"xs"}>
                                        <NumberInputField/>
                                    </NumberInputRoot>
                                </Table.Cell>
                                <Table.Cell>
                                    <Textarea size={"xs"} minH={"32px"} />
                                </Table.Cell>
                            </Table.Row>
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Table.ScrollArea>
    );
};

export const ModbusFunctionGroupTable = ({data}) => {
    return (
        <Table.Root size={"sm"} stickyHeader>
            <Table.Header>
                <Table.Row background={"bg.subtle"}>
                    <Table.ColumnHeader>Адрес</Table.ColumnHeader>
                    <Table.ColumnHeader>Переменная</Table.ColumnHeader>
                    <Table.ColumnHeader>Тип</Table.ColumnHeader>
                    <Table.ColumnHeader>Описание</Table.ColumnHeader>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((element, index) => {
                    if (element.data.type === "folder") return null;
                    return (
                        <Table.Row key={index} background={"bg.subtle"}>
                            <Table.Cell>
                                <NumberInputRoot defaultValue={element.data.setting.address} size={"xs"}>
                                    <NumberInputField/>
                                </NumberInputRoot>
                            </Table.Cell>
                            <Table.Cell>
                                <SelectRoot size={"xs"}>
                                    <SelectTrigger
                                        border={"1px dashed"}
                                        borderColor={"border.info"}
                                        borderRadius={"md"}
                                        background={"bg.info"}
                                    >
                                        <SelectValueText placeholder="Выберите тип" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        
                                    </SelectContent>
                                </SelectRoot>   
                            </Table.Cell>
                            <Table.Cell>
                                <SelectRoot size={"xs"} collection={dataTypes}>
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
                            </Table.Cell>
                            <Table.Cell>
                                <Textarea size={"xs"} minH={"32px"} />
                            </Table.Cell>
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
};
