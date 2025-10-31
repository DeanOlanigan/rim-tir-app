import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useColumnsStore = create(
    persist(
        (set) => ({
            tableColumnsZus: ["date", "type", "group", "var", "val", "desc"],
            setColons: (newColumns) => set({ tableColumnsZus: newColumns }),
        }),
        {
            name: "columns-store",
        }
    )
);
