import { createListCollection, Portal, Select, Table } from "@chakra-ui/react";
import { useUserStore } from "../SettingsStore/user-add-store";

const Roles = createListCollection({
    items: [
        { label: "Админ", value: "Админ" },
        { label: "Водолаз", value: "Водолаз" },
        { label: "Работяга", value: "Работяга" },
        { label: "В шоке", value: "В шоке" },
    ],
});

export const RoleSelector = ({ roleRef }) => {
    const { newUser, makeUser } = useUserStore();

    return (
        <Table.Body>
            <Table.Cell padding={"4px"}>
                <Select.Root
                    value={newUser.role || []}
                    onValueChange={(e) => makeUser(["role", e.value])}
                    w="100%"
                    padding="4px"
                    size="xs"
                    collection={Roles}
                    positioning={{ sameWidth: false }}
                    ref={roleRef}
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
                    <Portal>
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
                    </Portal>
                </Select.Root>
            </Table.Cell>
        </Table.Body>
    );
};
