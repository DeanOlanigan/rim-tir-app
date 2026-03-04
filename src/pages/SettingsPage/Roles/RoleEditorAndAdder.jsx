import { Button, Dialog, HStack, StackSeparator } from "@chakra-ui/react";
import { LuUserCog } from "react-icons/lu";
import { RoleList } from "./RoleList";
import { RoleEditor } from "./RoleEditor";
import { useRightsAndRolesStore } from "./store/rights-and-roles-store";

export const RoleEditorAndAdder = () => {
    return (
        <Dialog.Root
            placement="center"
            size={"xl"}
            onOpenChange={(e) => {
                if (!e.open)
                    useRightsAndRolesStore
                        .getState()
                        .setSelectedRole(undefined, "", []);
            }}
            lazyMount
            unmountOnExit
        >
            <Dialog.Trigger asChild>
                <Button size={"sm"}>
                    Роли <LuUserCog />
                </Button>
            </Dialog.Trigger>
            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content p="4">
                    <HStack
                        separator={<StackSeparator />}
                        align="start"
                        h={"100%"}
                    >
                        <RoleList />
                        <RoleEditor />
                    </HStack>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
};
