import { getEndDate, getStartDate } from "@/utils/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const initialState = {
    points: 50,
    offset: 120,
    startDate: getStartDate(),
    endDate: getEndDate(),
    isRealTime: "real",
    variables: {},
    showGraph: false,
};

export const useGraphStore = create(
    persist(
        (set) => ({
            ...initialState,
            setPoints: (points) => set({ points }),
            setOffset: (offset) => set({ offset }),
            setStartDate: (startDate) => set({ startDate }),
            setEndDate: (endDate) => set({ endDate }),
            setIsRealTime: (isRealTime) => set({ isRealTime }),
            setShowGraph: (showGraph) => set({ showGraph }),

            setVariable: (variable) =>
                set((state) => ({
                    variables: {
                        ...state.variables,
                        [variable.id]: variable,
                    },
                })),
            removeVariable: (id) =>
                set((state) => {
                    const { [id]: _, ...variables } = state.variables;
                    return {
                        variables: variables,
                    };
                }),
        }),
        {
            name: "graph-store",
        }
    )
);

export const useColor = (id) =>
    useGraphStore((state) => state.variables[id]?.color);
