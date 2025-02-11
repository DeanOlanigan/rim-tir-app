import { Table, HStack, Icon } from "@chakra-ui/react";
import { CheckboxCard } from "../../../components/ui/checkbox-card";
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
                            <Table.Cell>{element.data.name}</Table.Cell>
                            <Table.Cell>
                                <HStack>
                                    <CheckboxCard
                                        size={"sm"}
                                        align={"center"}
                                        defaultValue={element.data.setting.isSpecial}
                                        icon={
                                            <Icon size={"sm"}>
                                                <LuInfinity />
                                            </Icon>
                                        }
                                        indicator={false}
                                    />
                                    <CheckboxCard
                                        size={"sm"}
                                        align={"center"}
                                        defaultValue={element.data.setting.archive}
                                        icon={
                                            <Icon size={"sm"}>
                                                <LuArchive />
                                            </Icon>
                                        }
                                        indicator={false}
                                    />
                                    <CheckboxCard
                                        size={"sm"}
                                        align={"center"}
                                        defaultValue={element.data.setting.cmd}
                                        icon={
                                            <Icon size={"sm"}>
                                                <LuSquareTerminal />
                                            </Icon>
                                        }
                                        indicator={false}
                                    />
                                    <CheckboxCard
                                        size={"sm"}
                                        align={"center"}
                                        defaultValue={element.data.setting.isLua}
                                        icon={
                                            <Icon size={"sm"}>
                                                <LuCode />
                                            </Icon>
                                        }
                                        indicator={false}
                                    />
                                </HStack>
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
