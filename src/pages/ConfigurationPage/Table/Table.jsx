import { Table } from "@chakra-ui/react";
import { PARAM_DEFINITIONS } from "../../../config/paramDefinitions";
import { BaseInput } from "../InputComponents/BaseInput";
import { VariablesTableHeader } from "./Variables/VariablesTableHeader";
import { VariablesTableBody } from "./Variables/VariablesTableBody";
import { memo } from "react";

export const TableConfig = memo(function TableConfig({ data }) {
    console.log("RENDER TableConfig");
    return (
        <Table.Root size={"sm"} stickyHeader>
            <VariablesTableHeader />
            <VariablesTableBody data={data} />
        </Table.Root>
    );
});

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
