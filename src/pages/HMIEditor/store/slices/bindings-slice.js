import {
    rebuildIndexCommand,
    removeBindingCommand,
    setGlobalVarIdCommand,
    updateBindingCommand,
} from "../commands";

export const createBindingsSlice = (api) => {
    return {
        // ---- Создание индекса для константного поиска нужного примитива по id внешней переменной ----
        varIndex: {},
        nodeIndex: {},

        rebuildIndexes: () => rebuildIndexCommand(api),

        setBindingGlobalVarId: (ids, varIdOrNull) =>
            setGlobalVarIdCommand(api, ids, varIdOrNull),

        updateBinding: (ids, property, changes) =>
            updateBindingCommand(api, ids, property, changes),

        removeBinding: (ids, property) =>
            removeBindingCommand(api, ids, property),
    };
};
