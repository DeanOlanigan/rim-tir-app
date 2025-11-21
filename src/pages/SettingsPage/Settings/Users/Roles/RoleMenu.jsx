import { Menu, Portal, useCheckboxGroup } from "@chakra-ui/react";

const Roles = [
    { label: "Админ", value: "Админ" },
    { label: "Водолаз", value: "Водолаз" },
    { label: "Работяга", value: "Работяга" },
    { label: "В шоке", value: "В шоке" },
];

export const RoleMenu = ({ noPortal = false }) => {
    const group = useCheckboxGroup({ value: Roles });

    const content = (
        <Menu.Positioner>
            <Menu.Content>
                <Menu.ItemGroup>
                    {Roles.map(({ value, label }) => (
                        <Menu.CheckboxItem
                            key={value}
                            value={value}
                            checked={group.isChecked(value)}
                            onCheckedChange={() => {
                                console.log(value);
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
    );

    return (
        <Menu.Root>
            <Menu.Trigger w="100%" cursor="pointer">
                Роль
            </Menu.Trigger>
            {noPortal ? content : <Portal>{content}</Portal>}
        </Menu.Root>
    );
};
