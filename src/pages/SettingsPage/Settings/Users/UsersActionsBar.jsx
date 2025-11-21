import { ActionBar, IconButton, Portal } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";
import { useTableStore } from "../SettingsStore/tablestore";
import { DeleteDialog } from "./Dialogs/DeleteDialog";
import { EditDialog } from "./Dialogs/EditDialog";

export const UsersActionsBar = () => {
    const { selectedRows, setSelectedRows } = useTableStore();
    return (
        <ActionBar.Root shadow={"xl"} open={selectedRows.length}>
            <Portal>
                <ActionBar.Positioner>
                    <ActionBar.Content>
                        <ActionBar.SelectionTrigger>
                            {selectedRows.length} выбрано
                        </ActionBar.SelectionTrigger>
                        <ActionBar.Separator />
                        <EditDialog />
                        <DeleteDialog />
                        <ActionBar.Separator />
                        <IconButton
                            size={"sm"}
                            variant={"ghost"}
                            onClick={() => setSelectedRows([])}
                        >
                            <LuX />
                        </IconButton>
                    </ActionBar.Content>
                </ActionBar.Positioner>
            </Portal>
        </ActionBar.Root>
    );
};
