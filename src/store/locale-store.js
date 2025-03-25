import { create } from "zustand";

export const useLocaleStore = create()((set) => ({
    locale: "ru",
    setLocale: (locale) => set({ locale }),
}));
