import { Table } from "@chakra-ui/react";

export const VariablesTableHeader = () => {
    //console.log("RENDER VariablesTableHeader");

    return (
        <Table.Header>
            <Table.Row background={"bg.subtle"}>
                <Table.ColumnHeader minW={"150px"}>Имя</Table.ColumnHeader>
                <Table.ColumnHeader />
                <Table.ColumnHeader minW={"150px"}>
                    Тип данных
                </Table.ColumnHeader>
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
    );
};
