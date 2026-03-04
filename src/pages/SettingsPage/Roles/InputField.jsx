import { Field, Input } from "@chakra-ui/react";
import { useRightsAndRolesStore } from "./store/rights-and-roles-store";

export const InputField = () => {
    const selName = useRightsAndRolesStore((s) => s.selectedRole.name);
    const editSelectedName = useRightsAndRolesStore.getState().editSelectedRole;
    return (
        <Field.Root>
            <Field.Label>Название роли</Field.Label>
            <Input
                size={"xs"}
                value={selName}
                onChange={(e) => editSelectedName(e.target.value, "name")}
            />
        </Field.Root>
    );
};
