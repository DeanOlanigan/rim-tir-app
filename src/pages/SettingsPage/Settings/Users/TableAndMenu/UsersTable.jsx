const tableColumns = [
    { label: "Логин", value: "login" },
    { label: "Фамилия", value: "surname" },
    { label: "Имя", value: "name" },
    { label: "Отчество", value: "grandname" },
    { label: "Должность", value: "position" },
    { label: "Роль", value: "role" },
];

import { useQuery } from "@tanstack/react-query";
import { Loader } from "@/components/Loader";
import { Box, Checkbox, Table, Text } from "@chakra-ui/react";
import { useTableStore } from "../../SettingsStore/tablestore";
import { UserAdder } from "../UserAdder";
import { useEffect, useRef } from "react";
import { NoData } from "@/components/NoData";
import { useEditStore } from "../../SettingsStore/user-edit-store";

const useUsersHistory = () => {
    const { hydrate } = useTableStore();
    const q = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            let out = {};
            const count = 50;
            for (let i = 0; i < count; i++) {
                const id = i + 1;
                out[id] = {
                    // eslint-disable-next-line sonarjs/pseudo-random
                    login: Math.random() * 100,
                    surname: ["Петров", "Иванов"][
                        // eslint-disable-next-line sonarjs/pseudo-random
                        Math.floor(Math.random() * 2)
                    ],
                    // eslint-disable-next-line sonarjs/pseudo-random
                    name: ["Валера", "Саня"][Math.floor(Math.random() * 2)],
                    grandname: ["Ибрагимович", "Сидорович"][
                        // eslint-disable-next-line sonarjs/pseudo-random
                        Math.floor(Math.random() * 2)
                    ],
                    position: [
                        "Инженер-программист",
                        "Инженер-тестировщик",
                        "Инженер-инженер",
                        "В шоке",
                    ][
                        // eslint-disable-next-line sonarjs/pseudo-random
                        Math.floor(Math.random() * 4)
                    ],
                    role: ["Админ", "Водолаз", "Работяга", "В шоке"][
                        // eslint-disable-next-line sonarjs/pseudo-random
                        Math.floor(Math.random() * 4)
                    ],
                };
            }
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return out;
        },
    });
    useEffect(() => {
        if (q.data) hydrate(q.data);
    }, [q.data, hydrate]);
    return q;
};

export const UsersTable = () => {
    const setSelectedRows = useTableStore.getState().setSelectedRows;
    const isAdding = useTableStore((s) => s.isAdding);
    const selectedRows = useTableStore((s) => s.selectedRows);
    const live = useTableStore((s) => s.live);
    const { isLoading, isError, error } = useUsersHistory();
    const indeterminate =
        selectedRows.length > 0 &&
        selectedRows.length < Object.values(live).length;

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

    if (isAdding) setTimeout(() => scrollToBottom(), 0);

    if (isLoading)
        return (
            <Box h={"2xl"}>
                <Loader text={"Загрузка пользователей"} />
            </Box>
        );
    if (isError) return <Text>Ошибка: {error}</Text>;
    return (
        <>
            <Table.ScrollArea maxH={"500px"} borderRadius={"sm"} ref={tableRef}>
                <Table.Root stickyHeader variant={"outline"} h={"100%"}>
                    <Table.ColumnGroup>
                        <Table.Column htmlWidth="1%" />
                    </Table.ColumnGroup>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader
                                padding={"4px"}
                                bg={"colorPalette.500"}
                                color={"fg.inverted"}
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
                                                ? Object.keys(live).map(
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
                        {Object.values(live).length === 0 && (
                            <Box h={"md"}>
                                <NoData />
                            </Box>
                        )}
                        {Object.keys(live).map((row) => (
                            <Table.Row
                                key={row}
                                live-selected={
                                    selectedRows.includes(row) ? "" : undefined
                                }
                                onContextMenu={() => {
                                    console.log(
                                        "row:",
                                        row,
                                        "live[row]:",
                                        live[row],
                                    );
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
                                {Object.keys(live[row]).map((key) => (
                                    <Table.Cell
                                        key={key}
                                        textAlign="center"
                                        fontSize="sm"
                                        fontWeight="500"
                                        padding="4px"
                                    >
                                        {live[row][key]}
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        ))}
                    </Table.Body>
                    {isAdding && <UserAdder />}
                </Table.Root>
            </Table.ScrollArea>
        </>
    );
};
