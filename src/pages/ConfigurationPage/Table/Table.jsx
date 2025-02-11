import { Table, HStack, Icon, Input, Textarea } from "@chakra-ui/react";
import {
    NumberInputField,
    NumberInputRoot
} from "../../../components/ui/number-input";
import { CheckboxCard } from "../../../components/ui/checkbox-card";
import {
    SelectContent,
    SelectItem,
    SelectLabel,
    SelectRoot,
    SelectTrigger,
    SelectValueText,
} from "../../../components/ui/select";
import { dataTypes, groups } from "../filterOptions";
import { headerMapping } from "../../MonitoringPage/mappings";
import {
    LuInfinity,
    LuArchive,
    LuSquareTerminal,
    LuCode
} from "react-icons/lu";

export const TableConfig = ({data}) => {

    return (
        <Table.Root>
            <Table.Header>
                <Table.Row>
                    <Table.ColumnHeader>Имя</Table.ColumnHeader>
                    <Table.ColumnHeader/>
                    <Table.ColumnHeader>Тип данных</Table.ColumnHeader>
                    <Table.ColumnHeader>Группа</Table.ColumnHeader>
                    <Table.ColumnHeader>Единица измерения</Table.ColumnHeader>
                    <Table.ColumnHeader>Коэффициент расчета</Table.ColumnHeader>
                    <Table.ColumnHeader>Цикличный вызов, сек</Table.ColumnHeader>
                    <Table.ColumnHeader>Описание</Table.ColumnHeader>
                    <Table.ColumnHeader>Lua выражение</Table.ColumnHeader>
                    {/* {Object.keys(data[0].data.setting).map((key, index) => {
                        return (
                            <Table.ColumnHeader key={index}>
                                {headerMapping[key]}
                            </Table.ColumnHeader>            
                        );
                    })} */}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {data.map((element, index) => {
                    if (element.data.type === "folder") return null;
                    return (
                        <Table.Row key={index}>
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
                                                <LuInfinity />
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
                                <Textarea />
                            </Table.Cell>
                            <Table.Cell>
                                
                            </Table.Cell>
                            {/* {Object.keys(element.data.setting).map((key, index) => {
                                return <Table.Cell key={index}>{element.data.setting[key]}</Table.Cell>;
                            })} */}
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
};
