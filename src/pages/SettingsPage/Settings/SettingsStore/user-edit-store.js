import { create } from "zustand";


export const useEditStore = create(
    (set) => ({
        editedUsers: [{}],
        setEditedUsers: (newEditedUsers) => set(() => ({editedUsers: newEditedUsers}))
    }));