import { nanoid } from "nanoid";
import { create } from "zustand";

const defaultRoles = {
    1: {
        name: "Глядун",
        rights: [
            "lookConf",
            "lookMonitor",
            "lookLog",
            "lookJourn",
            "lookGraphs",
            "lookSettings",
        ],
    },
    2: {
        name: "Конфигуратор",
        rights: [
            "createConf",
            "editConf",
            "createConfVar",
            "varInteract",
            "renameVar",
            "deleteVar",
            "cutVar",
            "copyVar",
            "chooseVar",
            "descriptVar",
            "GPIOget",
            "COMPORTget",
            "IEC-104get",
            "Modbusget",
            "GPIOgive",
            "COMPORTgive",
            "IEC-104give",
            "Modbusgive",
            "sendConf",
            "startServ",
            "stopServ",
            "restartServ",
        ],
    },
    3: {
        name: "Мониторщик",
        rights: [
            "lookMonitor",
            "handleInputMonitorVar",
            "signalEditMonitorVar",
            "lookGraphs",
        ],
    },
};

const ROLE_NAME_REGEX = /^[\p{L}\d\s-]+$/u;

export const useRightsAndRolesStore = create((set, get) => ({
    roles: defaultRoles,

    selectedRole: {
        id: undefined,
        name: "",
        rights: [],
    },

    setRoles: (roles) => set({ roles: roles }),

    hasSameNameAdd: (newName) => {
        const checkRoles = get().roles;
        return Object.keys(checkRoles).some(
            (id) =>
                checkRoles[id].name.trim().toLowerCase() ===
                newName.trim().toLowerCase(),
        );
    },

    hasSameNameEdit: (editedRole) => {
        const checkRoles = get().roles;
        return Object.keys(checkRoles).some(
            (id) =>
                checkRoles[id].name.toLowerCase() ===
                    editedRole.name.toLowerCase() && id !== editedRole.id,
        );
    },

    isValidRole: (roleName) => {
        const trimName = roleName.trim();
        if (!trimName) return;
        return ROLE_NAME_REGEX.test(trimName);
    },

    setSelectedRole: (selId, selName, selRights) =>
        set(() => ({
            selectedRole: { id: selId, name: selName, rights: selRights },
        })),

    editSelectedRole: (newData, field) =>
        set((state) => ({
            selectedRole: { ...state.selectedRole, [field]: newData },
        })),

    addRole: (newRole) => {
        if (get().hasSameNameAdd(newRole)) {
            throw new Error("ROLE_ALREADY_EXISTS");
        }
        if (!get().isValidRole(newRole)) throw new Error("INVALID_ROLE_NAME");
        const id = nanoid();
        set((state) => ({
            roles: {
                ...state.roles,
                [id]: { name: newRole, rights: [] },
            },
        }));

        return id;
    },

    delRole: (delId) =>
        set((state) => {
            const newRoles = { ...state.roles };
            delete newRoles[delId];
            if (delId === get().selectedRole.id)
                return {
                    roles: newRoles,
                    selectedRole: { id: undefined, name: "", rights: [] },
                };
            return { roles: newRoles };
        }),

    editRole: () =>
        set((state) => {
            const editedRole = { ...state.selectedRole };
            if (editedRole.id === undefined) throw new Error("NO_SELECTED");
            if (editedRole.name.length === 0) throw new Error("EMPTY_NAME");
            if (!get().isValidRole(editedRole.name))
                throw new Error("INVALID_ROLE_NAME");
            if (get().hasSameNameEdit(editedRole))
                throw new Error("ROLE_ALREADY_EXISTS");
            return {
                roles: {
                    ...state.roles,
                    [editedRole.id]: editedRole,
                },
            };
        }),
}));
