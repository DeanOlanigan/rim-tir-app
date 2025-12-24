import {
    Button,
    Card,
    Group,
    Heading,
    Highlight,
    IconButton,
    Input,
    Popover,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useRightsAndRolesStore } from "../../SettingsStore/rights-and-roles-store";
import { LuPlus, LuX } from "react-icons/lu";
import { useRef } from "react";
import { toaster } from "@/components/ui/toaster";
import { useTableStore } from "../../SettingsStore/tablestore";

export const RoleList = () => {
    const roles = useRightsAndRolesStore((s) => s.roles);
    const selRoleId = useRightsAndRolesStore((s) => s.selectedRole.id);
    const newRoleRef = useRef(null);
    console.log(roles);

    function hangleRoleAdd() {
        if (!newRoleRef.current.value) return;
        const newName = newRoleRef.current.value;
        try {
            useRightsAndRolesStore.getState().addRole(newName);
        } catch {
            toaster.create({
                type: "error",
                description: `Ошибка добавления роли: Роль ${newName} уже существует`,
                closable: true,
            });
            return;
        }
        toaster.create({
            description: `Роль ${newName} добавлена`,
            type: "success",
            closable: true,
        });
        newRoleRef.current.value = null;
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
                    size={"xs"}
                    onClick={() => {
                        hangleRoleAdd();
                    }}
                >
                    <LuPlus />
                </IconButton>
            </Group>
        </VStack>
    );
};

const DeleteRolePopover = ({ id }) => {
    function handleDelete() {
        useRightsAndRolesStore.getState().delRole(id);
        useTableStore.getState().filterDeletedRole(id);
    }

    return (
        <Popover.Root>
            <Popover.Trigger>
                <IconButton
                    size={"2xs"}
                    variant={"ghost"}
                    colorPalette={"red"}
                    borderLeftRadius={"0"}
                >
                    <LuX />
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Body>
                            <Text fontWeight={"medium"}>
                                <Highlight
                                    query={["НЕЛЬЗЯ БУДЕТ ОТМЕНИТЬ"]}
                                    styles={{
                                        px: 0.5,
                                        borderRadius: "4px",
                                        color: "fg.error",
                                    }}
                                >
                                    Вы уверены? Последствия этого действия
                                    НЕЛЬЗЯ БУДЕТ ОТМЕНИТЬ!
                                </Highlight>
                            </Text>
                        </Popover.Body>
                        <Popover.Footer justifyContent={"right"}>
                            <Button
                                size={"2xs"}
                                variant={"outline"}
                                colorPalette={"red"}
                                color={"red.600"}
                                onClick={() => handleDelete()}
                            >
                                Удалить
                            </Button>
                            <Button size={"2xs"} variant={"outline"}>
                                Отменить
                            </Button>
                        </Popover.Footer>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
