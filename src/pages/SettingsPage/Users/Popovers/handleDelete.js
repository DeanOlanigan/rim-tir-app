import { useTableStore } from "../../tablestore";
import { useEditStore } from "../../user-edit-store";

export function handleDelete(usersToDelete) {
    const setOpen = useEditStore.getState().setPopoversOpen;
    useTableStore.getState().deleteUsers(usersToDelete);
    useEditStore.getState().setSelectedUser(undefined, {});
    setOpen("delete", false);
    useEditStore.getState().setMenuOpen(false);
}
