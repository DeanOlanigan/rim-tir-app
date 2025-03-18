import { create } from "zustand";

export const useContextMenuStore = create()((set) => ({
    context: {
        type: null,
        subType: null,
        treeType: null,
        apiPath: null,
    },
    updateContext: (data) =>
        set((state) => ({ context: { ...state.context, ...data } })),
}));
