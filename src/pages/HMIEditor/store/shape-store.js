import { create } from "zustand";

export const useShapeStore = create((set) => ({
    fillColor: "#fff",
    strokeColor: "#000",
    strokeWidth: 2,
    cornerRadius: 2,

    setFillColor: (color) => set({ fillColor: color }),
    setStrokeColor: (color) => set({ strokeColor: color }),
    setStrokeWidth: (width) => set({ strokeWidth: width }),
    setCornerRadius: (radius) => set({ cornerRadius: radius }),
}));
