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
            delete newLive[deleteUser];
            return { live: newLive };
        }),
    editUser: (id, editedUser) =>
        set((state) => ({
            live: { ...state.live, [id]: { ...state.live[id], ...editedUser } },
        })),
}));
