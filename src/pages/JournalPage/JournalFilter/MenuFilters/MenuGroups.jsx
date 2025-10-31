import { Box, Menu, Portal, useCheckboxGroup } from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";
import { useGroupStore } from "../../JournalStores/GroupFilterStore";
import { LuArrowBigDown } from "react-icons/lu";

const groups = [
    { label: "Без группы", value: "Без Группы" },
    { label: "Аварийные", value: "Аварийная" },
    { label: "Предупредительные", value: "Предупредительная" },
    { label: "Оперативного состояния", value: "Состояние" },
];

export const MenuGroups = ({header}) => {
    const {
        selectedGroups,
        setSelectedGroups
    } = useGroupStore();
    const group = useCheckboxGroup({ value: selectedGroups });
    
    const handleCheckboxChange = (value, checked) => {
        const newColumns = checked 
            ? [...selectedGroups, value]
            : selectedGroups.filter(col => col !== value);
    
        setSelectedGroups(newColumns);
    };

    return (
        <Menu.Root closeOnSelect={false}>
            <Menu.Trigger asChild>
                <Box cursor="pointer" display="inline-flex" alignItems="center">
                    {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                    )}
                    <LuArrowBigDown />
                </Box>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            {groups.map(({ value, label }) => (
                                <Menu.CheckboxItem
                                    key={value}
                                    value={value}
                                    checked={group.isChecked(value)}
                                    onCheckedChange={(checked) => {
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