import { create } from "zustand";

const defaultValues = {
    login: "",
    surname: "",
    name: "",
    grandname: "",
    position: "",
    role: "",
};

export const useUserStore = create(
    (set, get) => ({
        newUser: {...defaultValues},
        isAdding: false,
        setIsAdding: () => set((state) => ({isAdding: !state.isAdding})),
        makeUser: ([field, value]) => set((state) => ({
            newUser: {...state.newUser, [field]: value}
        })),
        isUserValid: () => {
            const user = get().newUser;
            if (!user) return false; 
            return Object.values(user).every((value) => value && value.length > 0);
        },
        cleanUser: () => set({
            newUser: defaultValues
        })
    })
);
