import { create } from "zustand";

export const useEditStore = create((set) => ({
    selectedUser: {
        id: undefined,
        data: {},
    },

    tempUser: {
        id: undefined,
        data: {},
    },

    setSelectedUser: (selectedId, selectedData) =>
        set(() => ({
            selectedUser: { id: selectedId, data: selectedData },
        })),

    setTempUser: () =>
        set((state) => ({ tempUser: { ...state.selectedUser } })),

    editTempUser: (field, newData) =>
        set((state) => ({
            tempUser: {
                ...state.tempUser,
                data: {
                    ...state.tempUser.data,
                    [field]: newData,
                },
            },
        })),

    delete: false,

    open: false,

    menuOpen: false,

    setMenuOpen: (isOpen) => set(() => ({ menuOpen: isOpen })),

    setPopoversOpen: (popover, isOpen) => set(() => ({ [popover]: isOpen })),
}));
