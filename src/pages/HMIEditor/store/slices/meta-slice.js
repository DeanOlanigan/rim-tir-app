export const createMetaSlice = (set) => ({
    meta: {
        mode: "new",
        filename: "untitled",
        isDirty: false,
    },

    makeDirty: () =>
        set(
            (state) => ({
                meta: { ...state.meta, isDirty: true },
            }),
            undefined,
            "meta/makeDirty",
        ),
});
