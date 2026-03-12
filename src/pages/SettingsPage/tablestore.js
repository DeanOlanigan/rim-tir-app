import { create } from "zustand";

const CYRILLIC_ONLY = /^[\p{Script=Cyrillic}\s]+$/u;
const ROLE_NAME_REGEX = /^[\p{L}\d\s-]+$/u;
const LOGIN_REGEX = /^(?![._-])[a-zA-Z0-9._-]{1,20}(?<![._-])$/;

export const useTableStore = create((set, get) => ({
    selectedRows: [],
    setSelectedRows: (changedSelected) =>
        set({ selectedRows: changedSelected }),
    isAdding: false,
    setIsAdding: () => set((state) => ({ isAdding: !state.isAdding })),
    live: {},
    hydrate: (data) => set({ live: data }),
    isUserValid: (newUser) => {
        return Object.keys(newUser).every((field) => {
            if (field === "grandname" && newUser[field] === "") return true;
            return newUser[field]?.length > 0;
        });
    },
    isCyrillicOnly: (newUser) => {
        return Object.keys(newUser).every((field) => {
            if (field === "login" || field === "roles" || field === "password")
                return true;
            if (field === "grandname" && newUser[field] === "") return true;
            if (field === "position")
                return ROLE_NAME_REGEX.test(newUser[field]);
            return (
                CYRILLIC_ONLY.test(newUser[field]) &&
                ROLE_NAME_REGEX.test(newUser[field])
            );
        });
    },
    isSameLogin: (newLogin) => {
        const users = get().live;
        return Object.keys(users).some((id) => users[id].login === newLogin);
    },
    checkLogin: (newLogin) => LOGIN_REGEX.test(newLogin),

    addUser: (newId, newUser) =>
        set((state) => {
            if (!get().isUserValid(newUser)) throw new Error("EMPTY_FIELDS");
            if (!get().checkLogin(newUser.login))
                throw new Error("INCORRECT_LOGIN");
            if (!get().isCyrillicOnly(newUser))
                throw new Error("NOT_CYRILLIC_SYMBOLS");
            if (get().isSameLogin(newUser.login))
                throw new Error("NOT_UNIQUE_LOGIN");
            return {
                live: {
                    ...state.live,
                    [newId]: {
                        ...newUser,
                    },
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
            const changeAll = ids.length === 1 ? true : false;
            if (!newLive[ids[0]]) return;
            if (changeAll) {
                if (!get().isUserValid(editedUser))
                    throw new Error("EMPTY_FIELDS");
                if (!get().isCyrillicOnly(editedUser)) {
                    throw new Error("NOT_CYRILLIC_SYMBOLS");
                }
                newLive[ids[0]] = editedUser;
                return { live: newLive, selectedRows: [] };
            }
            ids.forEach((id) => {
                if (!editedUser.role) throw new Error("EMPTY_FIELDS");
                newLive[id] = { ...newLive[id], role: editedUser.role };
            });
            return { live: newLive, selectedRows: [] };
        }),
    filterDeletedRoles: (roleId) =>
        set((state) => {
            const newLive = { ...state.live };
            const usersToUpdate = [];

            Object.keys(newLive).forEach((id) => {
                if (newLive[id].role === roleId) {
                    newLive[id].role = "0";
                    usersToUpdate.push(id);
                }
            });

            return { live: newLive, usersToUpdate };
        }),
}));
