import {
    Card,
    Flex,
    IconButton,
    Menu,
    Portal,
    useCheckboxGroup,
} from "@chakra-ui/react";
import { LuPlay, LuDownload, LuColumns3 } from "react-icons/lu";
import { TestTable } from "./JournalTable";

const tableColumns = [
    { label: "Дата и время", value: "date" },
    { label: "Тип", value: "type" },
    { label: "Переменная", value: "var" },
    { label: "Описание", value: "desc" },
    { label: "Значение", value: "val" },
    { label: "Группа", value: "group" },
];

export const JournalView = () => {
    return (
        <Card.Root
            w={"100%"}
            h={"100%"}
            shadow={"xl"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <JournalHeader />
            </Card.Header>
            <Card.Body h={"100%"} pt={"0"} mt={"1rem"}>
                <TestTable />
            </Card.Body>
        </Card.Root>
    );
};

const JournalHeader = () => {
    return (
        <Flex justifyContent={"space-between"}>
            <Flex gap={"1"}>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuDownload />
                </IconButton>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => console.log("handlePause")}
                >
                    <LuPlay />
                </IconButton>
            </Flex>
            <ColumnViewMenu />
        </Flex>
    );
};

// TODO Встроить в таблицу
const ColumnViewMenu = () => {
    const group = useCheckboxGroup({ defaultValue: ["date", "type", "var"] });

    return (
        <Menu.Root closeOnSelect={false}>
            <Menu.Trigger asChild>
                <IconButton size={"xs"}>
                    <LuColumns3 />
                </IconButton>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            {tableColumns.map(({ value, label }) => (
                                <Menu.CheckboxItem
                                    key={value}
                                    value={value}
                                    checked={group.isChecked(value)}
                                    onCheckedChange={() =>
                                        group.toggleValue(value)
                                    }
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
