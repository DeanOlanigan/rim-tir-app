import { getEndDate, getStartDate } from "@/utils/utils";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { TIME_TYPE } from "../GraphSettings/graphSettingsConstants";

const initialState = {
    points: 50,
    offset: 120,
    startDate: getStartDate(),
    endDate: getEndDate(),
    type: TIME_TYPE.real,
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
            setType: (type) => set({ type }),
            setShowGraph: (showGraph) => set({ showGraph }),

            addVariable: (variable) =>
                set((state) => ({
                    variables: {
                        ...state.variables,
                        [variable.id]: variable,
                    },
                })),

            setVariableName: (id, name) =>
                set((state) => ({
                    variables: {
                        ...state.variables,
                        [id]: {
                            ...state.variables[id],
                            name: name,
                        },
                    },
                })),

            setVariableColor: (id, color) =>
                set((state) => ({
                    variables: {
                        ...state.variables,
                        [id]: {
                            ...state.variables[id],
                            color: color,
                        },
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
