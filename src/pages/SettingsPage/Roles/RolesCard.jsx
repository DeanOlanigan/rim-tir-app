import { Card, Heading, VStack } from "@chakra-ui/react";
import { RoleList } from "./RoleList";
import { RoleEditor } from "./RoleEditor";
import { useRoles } from "./hooks/useRoles";
import { useEffect } from "react";
import { useRightsAndRolesStore } from "./store/rights-and-roles-store";

export const RolesCard = () => {
    const roles = useRoles();

    useEffect(() => {
        useRightsAndRolesStore.getState().setRoles(roles);
    }, [roles]);

    return (
        <VStack align={"stretch"}>
            <Heading>Редактор ролей</Heading>
            <Card.Root w={"100%"} variant={"elevated"} maxH={"2xl"}>
                <Card.Body flexDirection={"row"} gap={4}>
                    <RoleList />
                    <RoleEditor />
                </Card.Body>
            </Card.Root>
        </VStack>
    );
};
