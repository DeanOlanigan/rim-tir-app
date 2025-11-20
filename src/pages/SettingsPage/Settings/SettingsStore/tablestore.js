import { create } from "zustand";

export const useTableStore = create(
    (set) => ({
        
        selectedRows: [],
        setSelectedRows: (changedSelected) => set({selectedRows: changedSelected}),
        isAdding: false,
        setIsAdding: () => set((state) => ({isAdding: !state.isAdding})),
        live: [],
        hydrate: (data) => set({live: data}),
        addUser: (newUser) => set((state) => ({live: state.live.concat(newUser)})),
        deleteUsers: () => set((state) => ({
            live: state.live.filter((u) => {
                if (!state.selectedRows) return false;
                return (
                    !state.selectedRows.includes(u.login)
                );
            }),
            selectedRows: []
        })),
    })
);
