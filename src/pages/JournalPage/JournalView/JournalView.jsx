import {
    Card,
    Flex,
    IconButton,
    Menu,
    Portal,
    useCheckboxGroup,
} from "@chakra-ui/react";
import { LuPlay, LuDownload, LuColumns3, LuPause } from "react-icons/lu";
import { TestTable } from "./JournalTable";
import { useColumnsStore } from "../JournalStores/ColumnsStore";
import { JournalFilter } from "../JournalFilter/JournalFilter";
import { useJournalStream } from "../JournalStores/journal-stream-store";

const tableColumns = [
    { label: "Дата и время", value: "date" },
    { label: "Тип", value: "type" },
    { label: "Группа", value: "group" },
    { label: "Переменная", value: "var" },
    { label: "Значение", value: "val" },
    { label: "Описание", value: "desc" },
];

export const JournalView = () => {
    return (
        <Card.Root
            width={"100%"}
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
            <Card.Body h={"100%"} pt={"0"} mt={"1rem"} overflow='auto'>
                <TestTable />
            </Card.Body>
        </Card.Root>
    );
};

const JournalHeader = () => {
    const {
        isPaused,
        pause,
        resume 
    } = useJournalStream();

    return (
        <Flex justifyContent={"space-between"}>
            <Flex gap={"1"}>
                <IconButton variant={"outline"} size={"xs"}>
                    <LuDownload />
                </IconButton>
                <IconButton
                    variant={"outline"}
                    size={"xs"}
                    onClick={() => isPaused ? resume() : pause()}
                >   
                    {!isPaused 
                        ? <LuPlay />
                        : <LuPause />
                    } 
                </IconButton>
            </Flex>
            <Flex gap={"1"}>
                <JournalFilter />
                <ColumnViewMenu />
            </Flex>
        </Flex>
    );
};

// TODO Встроить в таблицу
const ColumnViewMenu = () => {
    const {
        tableColumnsZus,
        setColons
    } = useColumnsStore();
    const group = useCheckboxGroup({ value: tableColumnsZus });

    const handleCheckboxChange = (value, checked) => {
        const newColumns = checked 
            ? [...tableColumnsZus, value]
            : tableColumnsZus.filter(col => col !== value);
    
        setColons(newColumns);
    };

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
                                    onCheckedChange={(checked) =>{
                                        handleCheckboxChange(value, checked);
                                        group.toggleValue(value);
                                    }}
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
