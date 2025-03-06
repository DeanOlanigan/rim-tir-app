import { Table } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "../../../../../config/paramDefinitions";
import { BaseInput } from "../../../InputComponents/BaseInput";

export const DataObjectsTable = ({ data }) => {
    let keys;
    for (const rows of data) {
        if (rows.type === "folder") continue;
        keys = Object.keys(rows.setting);
    }

    if (!keys) return null;

    return (
        <Table.Root size={"sm"} stickyHeader>
            <Table.Header>
                <Table.Row background={"bg.subtle"}>
                    {keys.map((key, index) => {
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
                    if (element.type === "folder") return null;
                    return (
                        <Table.Row key={index} background={"bg.subtle"}>
                            {Object.keys(element.setting).map((key, index) => {
                                return (
                                    <Table.Cell key={index} minW={"150px"}>
                                        <BaseInput
                                            value={element.setting[key]}
                                            id={element.id}
                                            inputParam={key}
                                        />
                                    </Table.Cell>
                                );
                            })}
                        </Table.Row>
                    );
                })}
            </Table.Body>
        </Table.Root>
    );
};
