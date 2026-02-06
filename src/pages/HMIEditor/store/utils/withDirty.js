export const withDirty =
    (set) =>
    (actionName, actionFn) =>
    (...args) => {
        const result = actionFn(...args);

        set(
            (state) => ({
                meta: { ...state.meta, isDirty: true },
            }),
            false,
            "auto/makeDirty",
        );

        return result;
    };
