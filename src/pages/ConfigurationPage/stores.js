import { create } from "zustand";

export const useConfigStore = create((set) => ({
    flip: "vertical",
    setFlip: () =>
        set((state) => ({
            flip: state.flip === "vertical" ? "horizontal" : "vertical",
        })),
}));
