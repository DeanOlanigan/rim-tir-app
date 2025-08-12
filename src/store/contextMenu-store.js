import { create } from "zustand";

export const useContextMenuStore = create()((set) => ({
    context: {
        apiPath: null,
        x: 0,
        y: 0,
        visible: false,
    },
    updateContext: (data) =>
        set((state) => ({ context: { ...state.context, ...data } })),
}));
