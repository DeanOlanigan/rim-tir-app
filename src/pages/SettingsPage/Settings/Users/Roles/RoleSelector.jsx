import { createListCollection, Portal, Select, Table } from "@chakra-ui/react";
import { useUserStore } from "../../SettingsStore/user-add-store";

const Roles = createListCollection({
    items: [
        { label: "Админ", value: "Админ" },
        { label: "Водолаз", value: "Водолаз" },
        { label: "Работяга", value: "Работяга" },
        { label: "В шоке", value: "В шоке" },
    ],
});

export const RoleSelector = (noPortal = false) => {
    const { newUser, makeUser } = useUserStore();

    const content = (
        <Select.Positioner>
            <Select.Content>
                {Roles.items.map((value) => (
                    <Select.Item key={value.value} item={value}>
                        {value.label}
                        <Select.ItemIndicator />
                    </Select.Item>
                ))}
            </Select.Content>
        </Select.Positioner>
    );

    return (
        <Table.Cell padding={"4px"}>
            <Select.Root
                value={newUser.role || []}
                onValueChange={(e) => makeUser(["role", e.value])}
                w="100%"
                size="xs"
                collection={Roles}
                positioning={{ sameWidth: false }}
                invalid={!newUser.role.length > 0}
            >
                <Select.HiddenSelect />
                <Select.Control>
                    <Select.Trigger>
                        <Select.ValueText placeholder="Выберите роль" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                        <Select.Indicator />
                        <Select.ClearTrigger />
                    </Select.IndicatorGroup>
                </Select.Control>
                {noPortal ? content : <Portal>{content}</Portal>}
            </Select.Root>
        </Table.Cell>
    );
};
