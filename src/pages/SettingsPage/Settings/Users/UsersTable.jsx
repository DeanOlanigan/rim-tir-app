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
import { Checkbox, Table, Text } from "@chakra-ui/react";
import { useTableStore } from "../SettingsStore/tablestore";
import { UsersActionsBar } from "./UsersActionsBar";
import { UserAdder } from "./UserAdder";
import { useEffect, useRef } from "react";
import { NoData } from "@/components/NoData";

const useUsersHistory = () => {
    const { hydrate } = useTableStore();
    const q = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const out = [];
            const count = 100;

            for (let i = 0; i < count; i++) {
                out.push({
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
                });
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
    const setSelectedRows = useTableStore((s) => s.setSelectedRows);
    const isAdding = useTableStore((s) => s.isAdding);
    const selectedRows = useTableStore((s) => s.selectedRows);
    const live = useTableStore((s) => s.live);
    const { isLoading, isError, error } = useUsersHistory();
    const indeterminate =
        selectedRows.length > 0 && selectedRows.length < live.length;
    console.log(live);
    console.log(selectedRows);
    const checkRow = (prev, changes, row) => {
        if (changes.checked) return [...prev, row.login];
        return selectedRows.filter((login) => login !== row.login);
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

    if (isLoading) return <Loader text={"Загрузка пользователей"} />;
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
                                                ? live.map((row) => row.login)
                                                : []
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
                        {live.length === 0 && <NoData />}
                        {live.map((row) => (
                            <Table.Row
                                key={row.login}
                                live-selected={
                                    selectedRows.includes(row.login)
                                        ? ""
                                        : undefined
                                }
                            >
                                <Table.Cell textAlign={"center"} padding="4px">
                                    <Checkbox.Root
                                        checked={selectedRows.includes(
                                            row.login
                                        )}
                                        onCheckedChange={(changes) => {
                                            const newSelected = checkRow(
                                                selectedRows,
                                                changes,
                                                row
                                            );
                                            setSelectedRows(newSelected);
                                        }}
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control />
                                    </Checkbox.Root>
                                </Table.Cell>
                                {Object.keys(row).map((key) => (
                                    <Table.Cell
                                        key={key}
                                        textAlign="center"
                                        fontSize="sm"
                                        fontWeight="500"
                                        padding="4px"
                                    >
                                        {row[key]}
                                    </Table.Cell>
                                ))}
                            </Table.Row>
                        ))}
                    </Table.Body>
                    {isAdding && <UserAdder />}
                </Table.Root>
            </Table.ScrollArea>
            <UsersActionsBar />
        </>
    );
};
