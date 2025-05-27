import { create } from "zustand";

export const useConfigTreeApiStore = create()((set) => ({
    configTreeApi: {},
    setConfigTreeApi: (key, api) =>
        set((state) => ({
            configTreeApi: {
                ...state.configTreeApi,
                [key]: api,
            },
        })),
}));
