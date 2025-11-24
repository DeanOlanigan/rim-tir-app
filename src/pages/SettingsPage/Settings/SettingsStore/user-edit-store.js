import { create } from "zustand";

const Roles = [
    {
        label: "Админ",
        value: "admin",
        rights: [
            { label: "Все права", value: "allrights" },
        ],
    },
    {
        label: "Водолаз",
        value: "vodolaz",
        rights: [
            { label: "Доступ к журналированию", value: "journ-view"},
            { label: "Доступ к логам", value: "log-view" },
        ],
    },
    {
        label: "Работяга",
        value: "worker",
        rights: [
            { label: "Доступ к конфигурации", value: "conf-view" },
            { label: "Редактирование данных в мониторинге", value: "monitor-edit" },
            { label: "Доступ к графикам", value: "graph" },
            { label: "Доступ к журналированию", value: "journ-view"},
        ],
    },
    {
        label: "В шоке",
        value: "shoked",
        rights: [
            { label: "Доступ к конфигурации", value: "conf-view" },
        ],
    },
];

export const useEditStore = create(
    (set) => ({
        roles: Roles,
        createRole: (newRole) => set((state) => ({roles: {...state.roles, newRole}})),
        editedUsers: [{}],
        setEditedUsers: (newEditedUsers) => set(() => ({editedUsers: newEditedUsers}))
    }));