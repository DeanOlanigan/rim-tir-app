import { createListCollection, Select, Table } from "@chakra-ui/react";
import { useEditStore } from "../user-edit-store";
import { useUserStore } from "../user-add-store";
import { useRightsAndRolesStore } from "./store/rights-and-roles-store";

export const RoleSelector = ({ isEditing }) => {
    const usersRole = useEditStore((s) => s.tempUser?.data.role);
    const editTempUser = useEditStore.getState().editTempUser;
    const { newUser, makeUser } = useUserStore();
    const roles = useRightsAndRolesStore((s) => s.roles);

    const roleItems = Object.entries(roles).map(([id, role]) => ({
        label: role.name,
        value: id,
    }));

    const selectRoles = createListCollection({
        items: roleItems,
    });

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
            collection={selectRoles}
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
                    {selectRoles.items.map((value) => (
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
