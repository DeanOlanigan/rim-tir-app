import { nanoid } from "nanoid";
import { create } from "zustand";

const CYRILLIC_ONLY = /^[\p{Script=Cyrillic}\s]+$/u;

export const useTableStore = create((set, get) => ({
    selectedRows: [],
    setSelectedRows: (changedSelected) =>
        set({ selectedRows: changedSelected }),
    isAdding: false,
    setIsAdding: () => set((state) => ({ isAdding: !state.isAdding })),
    live: {},
    hydrate: (data) => set({ live: data }),
    isUserValid: (newUser) => {
        return Object.keys(newUser).every(
            (field) => newUser[field]?.length > 0,
        );
    },
    isCyrillicOnly: (newUser) => {
        return Object.keys(newUser).every((field) => {
            if (field === "login" || field === "role" || field === "position")
                return true;
            return CYRILLIC_ONLY.test(newUser[field]);
        });
    },
    isSameLogin: (newLogin) => {
        const users = get().live;
        return Object.keys(users).some((id) => users[id].login === newLogin);
    },
    addUser: (newUser) =>
        set((state) => {
            if (!get().isUserValid(newUser)) throw new Error("EMPTY_FIELDS");
            if (!get().isCyrillicOnly(newUser))
                throw new Error("NOT_CYRILLIC_SYMBOLS");
            if (get().isSameLogin(newUser.login))
                throw new Error("NOT_UNIQUE_LOGIN");
            return {
                live: {
                    ...state.live,
                    [nanoid()]: newUser,
                },
            };
        }),
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
    filterDeletedRoles: (roleId) =>
        set((state) => {
            const newLive = { ...state.live };
            Object.keys(newLive).map((id) => {
                if (newLive[id].role === roleId) newLive[id].role === 0;
            });
        }),
}));
