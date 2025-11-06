import { Box, Menu, Portal, useCheckboxGroup } from "@chakra-ui/react";
import { LuArrowBigDown } from "react-icons/lu";
import { useFilterStore } from "../../JournalStores/FilterStore";

const messageTypes = [
    { label: "ТС", value: "ТС" },
    { label: "Пользовательские ТУ", value: "ТУ" },
];

export const MenuTypes = ({ name }) => {
    const { selectedMessages, setSelectedMessages } = useFilterStore();
    const group = useCheckboxGroup({ value: selectedMessages });

    const handleCheckboxChange = (value, checked) => {
        const newColumns = checked
            ? [...selectedMessages, value]
            : selectedMessages.filter((col) => col !== value);
        setSelectedMessages(newColumns);
    };

    return (
        <Menu.Root closeOnSelect={false}>
            <Menu.Trigger asChild>
                <Box cursor="pointer" display="inline-flex" alignItems="center">
                    {name}
                    <LuArrowBigDown />
                </Box>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.ItemGroup>
                            {messageTypes.map(({ value, label }) => (
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
