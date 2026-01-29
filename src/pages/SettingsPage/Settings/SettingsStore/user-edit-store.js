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

    editedPassword: "",

    repeatedPassword: "",

    setRepeatedPassword: (newRepeat) =>
        set(() => ({
            repeatedPassword: newRepeat,
        })),

    setNewPassword: (newPassword) =>
        set(() => ({
            editedPassword: newPassword,
        })),

    setSelectedUser: (selectedId, selectedData) =>
        set(() => ({
            selectedUser: {
                id: selectedId,
                data: { ...selectedData },
            },
        })),

    setTempUser: (isOpen) =>
        set((state) => ({
            tempUser: isOpen
                ? {
                      ...state.selectedUser,
                  }
                : { id: undefined, data: {} },
            editedPassword: "",
        })),

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

    passwd: false,

    menuOpen: false,

    setPasswdOpen: (isOpen) => set(() => ({ passwd: isOpen })),

    setMenuOpen: (isOpen) => set(() => ({ menuOpen: isOpen })),

    setPopoversOpen: (popover, isOpen) => set(() => ({ [popover]: isOpen })),
}));
