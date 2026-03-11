import {
    Card,
    Field,
    HStack,
    IconButton,
    Input,
    Menu,
    Portal,
} from "@chakra-ui/react";
import {
    LuPlay,
    LuDownload,
    LuColumns3,
    LuPause,
    LuCheck,
} from "react-icons/lu";

import { JournalTable } from "./JournalTable";
import { useJournalStream } from "../JournalStores/journal-stream-store";
import { useFilterStore } from "../JournalStores/filter-store";
import { CanAccess } from "@/CanAccess";

const tableColumns = [
    { label: "Тип", value: "type", size: 145 },
    { label: "Метка времени", value: "ts", size: 200 },
    { label: "Событие", value: "event", size: 200 },
    { label: "Информация", value: "info", size: 200 },
    //{ label: "Группа", value: "group", size: 140 }, // ?
    //{ label: "Переменная", value: "var", size: 140 }, // ?
    //{ label: "Значение", value: "val", size: 100 }, // ?
    //{ label: "Описание", value: "desc", size: 240 }, // ?
    { label: "Пользователь", value: "user", size: 140 },
    { label: "Время квитирования", value: "ack_time", size: 200 },
    { label: "Квитировал", value: "who_ack", size: 200 },
];

export const JournalView = () => {
    return (
        <Card.Root
            size={"sm"}
            width={"100%"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <JournalHeader />
            </Card.Header>
            <Card.Body h={"100%"} pt={"0"} mt={"1rem"} overflow="auto">
                <JournalTable />
            </Card.Body>
        </Card.Root>
    );
};

export const JournalHeader = () => {
    const isPaused = useJournalStream((state) => state.isPaused);

    return (
        <HStack justifyContent={"space-between"}>
            <HStack>
                <CanAccess right={"journal.download"}>
                    <IconButton variant={"outline"} size={"xs"}>
                        <LuDownload />
                    </IconButton>
                </CanAccess>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() =>
                        isPaused
                            ? useJournalStream.getState().resume()
                            : useJournalStream.getState().pause()
                    }
                >
                    {!isPaused ? <LuPlay /> : <LuPause />}
                </IconButton>
            </HStack>
            <HStack>
                <Field.Root orientation="horizontal">
                    <Field.Label fontSize="sm">От</Field.Label>
                    <Input size={"xs"} autoComplete="off" />
                </Field.Root>
                <Field.Root orientation="horizontal">
                    <Field.Label fontSize="sm">До</Field.Label>
                    <Input size={"xs"} autoComplete="off" />
                </Field.Root>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuCheck />
                </IconButton>
                {/* <JournalFilter />
                <ColumnViewMenu /> */}
            </HStack>
        </HStack>
    );
};

// TODO Встроить в таблицу
// eslint-disable-next-line
const ColumnViewMenu = () => {
    const tableColumnsZus = useFilterStore((state) => state.tableColumnsZus);
    const setColons = useFilterStore((state) => state.setColons);

    const handleToggle = (value) => {
        const exists = tableColumnsZus.includes(value);

        let next;
        if (exists) {
            if (tableColumnsZus.length === 1) return;
            next = tableColumnsZus.filter((col) => col !== value);
        } else {
            next = tableColumns
                .map((col) => col.value)
                .filter(
                    (col) => col === value || tableColumnsZus.includes(col),
                );
        }

        setColons(next);
    };

    return (
        <Menu.Root closeOnSelect={false} lazyMount unmountOnExit size={"sm"}>
            <Menu.Trigger asChild>
                <IconButton size={"xs"}>
                    <LuColumns3 />
                </IconButton>
            </Menu.Trigger>
            <Portal disabled>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            {tableColumns.map(({ value, label }) => (
                                <Menu.CheckboxItem
                                    key={value}
                                    value={value}
                                    checked={tableColumnsZus.includes(value)}
                                    onCheckedChange={() => handleToggle(value)}
                                >
                                    {label}
                                    <Menu.ItemIndicator />
                                </Menu.CheckboxItem>
                            ))}
                        </Menu.ItemGroup>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
