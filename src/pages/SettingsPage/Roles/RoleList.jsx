import { Button, Heading, HStack, VStack } from "@chakra-ui/react";
import { useRightsAndRolesStore } from "./store/rights-and-roles-store";
import { DeleteRolePopover } from "./DeleteRolePopover";
import { NewRoleAdder } from "./NewRoleAdder";

export const RoleList = () => {
    const roles = useRightsAndRolesStore((s) => s.roles);
    const selRoleId = useRightsAndRolesStore((s) => s.selectedRole.id);

    return (
        <VStack h="md" w="50%" align={"start"}>
            <Heading>Роли</Heading>
            <VStack
                w={"100%"}
                h={"100%"}
                align={"stretch"}
                overflow={"auto"}
                p={1}
            >
                {Object.keys(roles).map((id) => (
                    <HStack key={id}>
                        <Button
                            flex={1}
                            size={"xs"}
                            variant={selRoleId === id ? "solid" : "outline"}
                            onClick={() => {
                                useRightsAndRolesStore
                                    .getState()
                                    .setSelectedRole(
                                        id,
                                        roles[id].name,
                                        roles[id].rights,
                                    );
                            }}
                        >
                            {roles[id].name}
                        </Button>
                        <DeleteRolePopover id={id} />
                    </HStack>
                ))}
            </VStack>
            <VStack align={"stretch"} w={"100%"}>
                <NewRoleAdder />
            </VStack>
        </VStack>
    );
};
