import { Table } from "@chakra-ui/react";

export const VariablesTableHeader = () => {
    //console.log("RENDER VariablesTableHeader");

    return (
        <Table.Header>
            <Table.Row background={"bg.subtle"}>
                <Table.ColumnHeader minW={"150px"}>Имя</Table.ColumnHeader>
                <Table.ColumnHeader>Параметры</Table.ColumnHeader>
                <Table.ColumnHeader minW={"150px"}>
                    Тип данных
                </Table.ColumnHeader>
                <Table.ColumnHeader minW={"50px"} textWrap={"wrap"}>
                    Lua выражение
                </Table.ColumnHeader>
                <Table.ColumnHeader minW={"150px"}>Описание</Table.ColumnHeader>
            </Table.Row>
        </Table.Header>
    );
};
