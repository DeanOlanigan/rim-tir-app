import {
    Card,
    Group,
    Heading,
    IconButton,
    Input,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useRightsAndRolesStore } from "../../SettingsStore/rights-and-roles-store";
import { LuPlus } from "react-icons/lu";
import { useRef } from "react";
import { useRolePostMutation } from "../../hooks/useRolePostMutation";
import { handleRoleAdd } from "./handleRoleAdd";
import { DeleteRolePopover } from "./deleteRolePopover";

export const RoleList = () => {
    const roles = useRightsAndRolesStore((s) => s.roles);
    const selRoleId = useRightsAndRolesStore((s) => s.selectedRole.id);
    const newRoleRef = useRef(null);

    const postMutation = useRolePostMutation();

    function handlePostRole() {
        const newRole = handleRoleAdd(newRoleRef);
        if (!newRole) return;
        postMutation.mutate(newRole);
    }

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
            <Text fontWeight={"500"} mt={"auto"}>
                Добавление новой роли
            </Text>
            <Group attached w={"100%"}>
                <Input
                    ref={newRoleRef}
                    size={"xs"}
                    placeholder="Введите название новой роли"
                />
                <IconButton
                    loading={postMutation.isPending}
                    size={"xs"}
                    onClick={() => {
                        handlePostRole();
                    }}
                >
                    <LuPlus />
                </IconButton>
            </Group>
        </VStack>
    );
};
