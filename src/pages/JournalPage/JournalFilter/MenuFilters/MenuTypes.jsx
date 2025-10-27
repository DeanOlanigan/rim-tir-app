import { Box, Menu, Portal, useCheckboxGroup } from "@chakra-ui/react";
import { flexRender } from "@tanstack/react-table";
import { useMessageFilterStore } from "../../JournalStores/MessageFilterStore";
import { LuArrowBigDown } from "react-icons/lu";

const messageTypes = [
    { label: "ТС", value: "ТС" },
    { label: "Пользовательские ТУ", value: "ТУ" },
];

export const MenuTypes = ({ header }) => {
    const {
        selectedMessages,
        setSelectedMessages
    } = useMessageFilterStore();
    const group = useCheckboxGroup({ defaultValue: selectedMessages });

    const handleCheckboxChange = (value, checked) => {
        const newColumns = checked 
            ? [...selectedMessages, value]
            : selectedMessages.filter(col => col !== value);
        setSelectedMessages(newColumns);
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