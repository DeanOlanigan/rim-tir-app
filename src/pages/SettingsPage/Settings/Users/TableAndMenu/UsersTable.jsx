import { Box, Checkbox, Table, Text } from "@chakra-ui/react";
import { useTableStore } from "../../SettingsStore/tablestore";
import { UserAdder } from "../UserAdder";
import { useEffect, useRef } from "react";
import { NoData } from "@/components/NoData";
import { useEditStore } from "../../SettingsStore/user-edit-store";
import { useRightsAndRolesStore } from "../../SettingsStore/rights-and-roles-store";
import { useUsersHistory } from "../../hooks/useUsers";
import { Tooltip } from "@/components/ui/tooltip";

const tableColumns = [
    { label: "Логин", value: "login" },
    { label: "Фамилия", value: "surname" },
    { label: "Имя", value: "name" },
    { label: "Отчество", value: "grandname" },
    { label: "Должность", value: "position" },
    { label: "Роль", value: "role" },
];

export const UsersTable = () => {
    const setSelectedRows = useTableStore.getState().setSelectedRows;
    const selectedRows = useTableStore((s) => s.selectedRows);
    const live = useTableStore((s) => s.live);
    const roles = useRightsAndRolesStore((s) => s.roles);
    const data = useUsersHistory();

    useEffect(() => {
        useTableStore.getState().hydrate(data);
    }, [data]);

    const indeterminate =
        selectedRows.length > 0 &&
        selectedRows.length < Object?.values(live).length;

    const checkRow = (prev, changes, id) => {
        if (changes.checked) return [...prev, id];
        return selectedRows.filter((idf) => idf !== id);
    };

    const tableRef = useRef(null);

    const scrollToBottom = () => {
        if (tableRef.current) {
            tableRef.current.scrollTo({
                top: tableRef.current.scrollHeight,
            });
        }
    };

    return (
        <Table.ScrollArea maxH={"500px"} borderRadius={"sm"} ref={tableRef}>
            <Table.Root
                stickyHeader
                variant={"outline"}
                h={"100%"}
                tableLayout={"fixed"}
            >
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader
                            padding={"4px"}
                            bg={"colorPalette.500"}
                            color={"fg.inverted"}
                            w={"5%"}
                            textAlign={"center"}
                        >
                            <Checkbox.Root
                                title={"Выбрать все строки"}
                                checked={
                                    indeterminate
                                        ? "indeterminate"
                                        : selectedRows.length > 0
                                }
                                onCheckedChange={(changes) => {
                                    setSelectedRows(
                                        changes.checked
                                            ? Object?.keys(live)?.map(
                                                  (row) => row,
                                              )
                                            : [],
                                    );
                                }}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                            </Checkbox.Root>
                        </Table.ColumnHeader>
                        {tableColumns.map((column) => (
                            <Table.ColumnHeader
                                bg={"colorPalette.solid"}
                                key={column.value}
                                color={"fg.inverted"}
                                fontSize="sm"
                                fontWeight="500"
                                padding="4px"
                                textAlign="center"
                            >
                                {column.label}
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {Object?.values(live).length === 0 && (
                        <Box h={"md"}>
                            <NoData />
                        </Box>
                    )}
                    {Object?.keys(live).map((row) => {
                        return (
                            <Table.Row
                                key={row}
                                live-selected={
                                    selectedRows.includes(row) ? "" : undefined
                                }
                                onContextMenu={() => {
                                    useEditStore
                                        .getState()
                                        .setSelectedUser(row, live[row]);
                                }}
                            >
                                <Table.Cell textAlign={"center"} padding="4px">
                                    <Checkbox.Root
                                        checked={selectedRows.includes(row)}
                                        onCheckedChange={(changes) => {
                                            const newSelected = checkRow(
                                                selectedRows,
                                                changes,
                                                row,
                                            );
                                            setSelectedRows(newSelected);
                                        }}
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.Cell>
                                {tableColumns.map((key) => {
                                    const cellValue = live[row][key.value];
                                    return (
                                        <Table.Cell
                                            key={key.value}
                                            textAlign="center"
                                            fontSize="sm"
                                            fontWeight="500"
                                            padding="4px"
                                            maxW={"100%"}
                                        >
                                            <Tooltip
                                                showArrow
                                                content={
                                                    <Text>
                                                        {key.value === "role"
                                                            ? roles[cellValue]
                                                                  ?.name ||
                                                              "Без роли"
                                                            : cellValue ||
                                                              "Отсутствует"}
                                                    </Text>
                                                }
                                            >
                                                <Text truncate>
                                                    {key.value === "role"
                                                        ? roles[cellValue]
                                                              ?.name ||
                                                          "Без роли"
                                                        : cellValue ||
                                                          "Отсутствует"}
                                                </Text>
                                            </Tooltip>
                                        </Table.Cell>
                                    );
                                })}
                            </Table.Row>
                        );
                    })}
                </Table.Body>
                <Table.Footer>
                    <UserAdder scrollToBottom={scrollToBottom} />
                </Table.Footer>
            </Table.Root>
        </Table.ScrollArea>
    );
};
