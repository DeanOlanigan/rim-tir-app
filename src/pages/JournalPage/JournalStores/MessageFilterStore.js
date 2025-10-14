import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useMessageFilterStore = create(
    persist(
        (set) => ({
            selectedMessages: ["ts", "tu"],
            setSelectedMessages: (newMessages) => set(({ selectedMessages: newMessages }))
        }),
        {
            name: "message-store"
        }
    )
)