import { Button, Menu, Portal } from "@chakra-ui/react";
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
                <Button
                    size={"2xs"}
                    variant={"ghost"}
                    fontSize={"md"}
                    color={"fg"}
                >
                    {name}
                    <LuChevronDown />
                </Button>
            </Menu.Trigger>

            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
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
