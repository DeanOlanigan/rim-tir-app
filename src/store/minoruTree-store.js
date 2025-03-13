import { create } from "zustand";
import { persist } from "zustand/middleware";
import { newTreeTestConst } from "../pages/ConfigurationPage/MinoruTree/minoruTreeConst";

export const useTestStore = create()(
    persist(
        (set) => ({
            variablesTree: newTreeTestConst,
            selectedNode: null,
            setVariablesTree: (tree) => set(() => ({ variablesTree: tree })),
            setSelectedNode: (node) => set(() => ({ selectedNode: node })),
        }),
        {
            name: "test-storage",
        }
    )
);
