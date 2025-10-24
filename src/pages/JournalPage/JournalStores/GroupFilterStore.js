import { create } from "zustand";
import { persist } from "zustand/middleware";


export const useGroupStore = create(
    persist(
        (set) => ({
            selectedGroups: ["state", "danger", "warn", "noGroup"],
            setSelectedGroups: (newGroups) => set(({selectedGroups: newGroups})),
        }),
        {
            name: "group-store"
        }
    )
);