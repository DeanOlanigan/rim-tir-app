import { create } from "zustand";

const defaultValues = {
    login: "",
    surname: "",
    name: "",
    grandname: "",
    position: "",
    role: "",
};

export const useUserStore = create((set) => ({
    newUser: { ...defaultValues },
    password: "",
    isAdding: false,

    setIsAdding: () => set((state) => ({ isAdding: !state.isAdding })),

    makeUser: ([field, value]) =>
        set((state) => ({
            newUser: { ...state.newUser, [field]: value },
        })),

    makePassword: (newPassword) => set(() => ({ password: newPassword })),

    cleanUser: () =>
        set({
            newUser: defaultValues,
            password: "",
        }),
}));
