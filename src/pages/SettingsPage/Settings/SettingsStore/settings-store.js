import { create } from "zustand";

export const useSettingStore = create(
    (set, get) => ({

        isServerChanged: false,
        isLogsChanged: false,
        isJournalsChanged: false,


        setChanged: (newChanged) => set(() => ({
            [newChanged]: true
        })),

        checkChanged: () => {
            return get().isServerChanged || get().isLogsChanged || get().isJournalsChanged;
        },

        resetChanged: () => set(() => ({
            isServerChanged: false,
            isLogsChanged: false,
            isJournalsChanged: false,
        }))
    })
);