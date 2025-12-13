import { createListCollection, Select, Table } from "@chakra-ui/react";
import { useEditStore } from "../../SettingsStore/user-edit-store";
import { useUserStore } from "../../SettingsStore/user-add-store";

const Roles = createListCollection({
    items: [
        { label: "Админ", value: "Админ" },
        { label: "Водолаз", value: "Водолаз" },
        { label: "Работяга", value: "Работяга" },
        { label: "В шоке", value: "В шоке" },
    ],
});

export const RoleSelector = ({ isEditing }) => {
    const usersRole = useEditStore((s) => s.tempUser?.data.role);
    const editTempUser = useEditStore.getState().editTempUser;
    const { newUser, makeUser } = useUserStore();

    const content = (
        <Select.Root
            value={isEditing ? [usersRole] : newUser?.role || []}
            onValueChange={(e) =>
                isEditing
                    ? editTempUser("role", e.value[0])
                    : makeUser(["role", e.value])
            }
            w="100%"
            size="xs"
            collection={Roles}
            positioning={{ sameWidth: false }}
        >
            <Select.HiddenSelect />
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Выберите роль" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
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
        </Select.Root>
    );

    return isEditing ? (
        content
    ) : (
        <Table.Cell padding={"4px"}>{content}</Table.Cell>
    );
};
