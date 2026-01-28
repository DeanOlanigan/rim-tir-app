import { Card, Group, Heading, Text, VStack } from "@chakra-ui/react";
import { useRightsAndRolesStore } from "../../SettingsStore/rights-and-roles-store";
import { DeleteRolePopover } from "./deleteRolePopover";
import { NewRoleAdder } from "./NewRoleAdder";

export const RoleList = () => {
    const roles = useRightsAndRolesStore((s) => s.roles);
    const selRoleId = useRightsAndRolesStore((s) => s.selectedRole.id);

    return (
        <VStack h="md" w="50%" align={"start"}>
            <Heading>Роли</Heading>
            <Card.Root size={"sm"} h={"sm"} overflow={"auto"} w={"100%"}>
                <Card.Body>
                    {Object.keys(roles).map((id) => (
                        <Group key={id} attached>
                            <Text
                                p="4px"
                                _hover={{
                                    bg:
                                        selRoleId === id
                                            ? "colorPalette.subtle"
                                            : "var(--global-color-border)",
                                }}
                                bg={
                                    selRoleId === id
                                        ? "colorPalette.subtle"
                                        : "none"
                                }
                                borderRadius="xs"
                                cursor={"pointer"}
                                w={"100%"}
                                onClick={() => {
                                    useRightsAndRolesStore
                                        .getState()
                                        .setSelectedRole(
                                            id,
                                            roles[id].name,
                                            roles[id].rights,
                                        );
                                }}
                                fontWeight={"medium"}
                            >
                                {roles[id].name}
                            </Text>
                            <DeleteRolePopover id={id} />
                        </Group>
                    ))}
                </Card.Body>
            </Card.Root>
            <NewRoleAdder />
        </VStack>
    );
};
