import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMessageFilterStore = create(
    persist(
        (set) => ({
            selectedMessages: ["ТС", "ТУ", "Пауза", "Старт"],
            setSelectedMessages: (newMessages) => set(({ selectedMessages: newMessages }))
        }),
        {
            name: "message-store"
        }
    )
);