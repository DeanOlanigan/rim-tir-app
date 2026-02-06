import { addNodeToIndex } from "../utils/bindings";

export const createIndexSlice = (set, get) => ({
    // ---- Создание индекса для константного поиска нужного примитива по его id ----
    varIndex: {},

    rebuildVarIndex: () => {
        const { nodes } = get();
        const newVarIndex = {};
        Object.values(nodes).forEach((node) =>
            addNodeToIndex(newVarIndex, node),
        );

        set({ varIndex: newVarIndex }, undefined, "index/rebuildVarIndex");
    },
});
