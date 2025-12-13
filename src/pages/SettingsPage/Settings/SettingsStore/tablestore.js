import { create } from "zustand";

export const useTableStore = create((set) => ({
    selectedRows: [],
    setSelectedRows: (changedSelected) =>
        set({ selectedRows: changedSelected }),
    isAdding: false,
    setIsAdding: () => set((state) => ({ isAdding: !state.isAdding })),
    live: {},
    hydrate: (data) => set({ live: data }),
    addUser: (newUser) =>
        set((state) => ({ live: { ...state.live, [newUser.login]: newUser } })),
    deleteUsers: (deleteUser) =>
        set((state) => {
            const newLive = { ...state.live };
            deleteUser.forEach((id) => delete newLive[id]);
            return { live: newLive, selectedRows: [] };
        }),
    editUser: (ids, editedUser) =>
        set((state) => {
            const newLive = { ...state.live };
            const changeAll = !editedUser.name ? false : true;
            ids.forEach((id) => {
                if (!newLive[id]) return;
                newLive[id] = changeAll
                    ? editedUser
                    : { ...newLive[id], role: editedUser.role };
            });
            return { live: newLive, selectedRows: [] };
        }),
}));
