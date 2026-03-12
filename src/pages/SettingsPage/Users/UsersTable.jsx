import { Checkbox, Table, Text } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { Tooltip } from "@/components/ui/tooltip";
import { useTableStore } from "../tablestore";
import { UserAdder } from "./UserAdder";
import { useEditStore } from "../user-edit-store";
import { useRightsAndRolesStore } from "../Roles/store/rights-and-roles-store";
import { useUsersHistory } from "./hooks/useUsers";

const tableColumns = [
    { label: "Логин", value: "login" },
    { label: "Фамилия", value: "surname" },
    { label: "Имя", value: "name" },
    { label: "Отчество", value: "grandname" },
    { label: "Должность", value: "position" },
    { label: "Роль", value: "roles" },
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

    const liveKeys = Object.keys(live);

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
                                            ? liveKeys?.map((row) => row)
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
                    {liveKeys.map((row) => (
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
                                const role =
                                    key.value === "roles"
                                        ? roles[cellValue]?.name || "Без роли"
                                        : cellValue || "Отсутствует";
                                return (
                                    <Table.Cell
                                        key={key.value}
                                        textAlign="center"
                                        fontSize="sm"
                                        fontWeight="500"
                                        padding="4px"
                                        maxW={"100%"}
                                    >
                                        <Tooltip showArrow content={role}>
                                            <Text truncate>{role}</Text>
                                        </Tooltip>
                                    </Table.Cell>
                                );
                            })}
                        </Table.Row>
                    ))}
                </Table.Body>
                <Table.Footer>
                    <UserAdder scrollToBottom={scrollToBottom} />
                </Table.Footer>
            </Table.Root>
        </Table.ScrollArea>
    );
};
