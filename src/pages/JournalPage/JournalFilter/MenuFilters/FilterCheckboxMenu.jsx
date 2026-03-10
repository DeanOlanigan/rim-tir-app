import { HStack, Menu, Portal } from "@chakra-ui/react";
import { LuChevronDown } from "react-icons/lu";
import { memo } from "react";

export const FilterCheckboxMenu = memo(function FilterCheckboxMenu({
    name,
    items,
    selected,
    onToggle,
}) {
    return (
        <Menu.Root closeOnSelect={false} lazyMount unmountOnExit size="sm">
            <Menu.Trigger asChild>
                <HStack
                    cursor="pointer"
                    justify="center"
                    px="2"
                    _hover={{ bg: "colorPalette.emphasized" }}
                    borderRadius="l2"
                    transitionProperty="common"
                    transitionDuration="moderate"
                    userSelect="none"
                >
                    {name}
                    <LuChevronDown />
                </HStack>
            </Menu.Trigger>

            <Portal disabled>
                <Menu.Positioner>
                    <Menu.Content minW="220px">
                        <Menu.ItemGroup>
                            {items.map(({ value, label }) => (
                                <Menu.CheckboxItem
                                    key={value}
                                    value={value}
                                    checked={selected.has(value)}
                                    onCheckedChange={() => onToggle(value)}
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
});
