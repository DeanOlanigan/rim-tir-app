import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getStartDate, getEndDate } from "@/utils/utils";
import { getRandomColor } from "@/utils/utils";

export const useGraphStore = create(
    persist(
        (set, get) => ({
            maxPointsCountZus: 100,
            isWsActiveZus: false,
            offsetZus: 120,
            startDateZus: getStartDate(),
            endDateZus: getEndDate(),
            variablesZus: [],
            wsMessageZus: {},

            setMaxPointsCountZus: (value) => set({ maxPointsCountZus: value }),
            setIsWsActiveZus: (value) => set({ isWsActiveZus: value }),
            setOffsetZus: (value) => set({ offsetZus: value }),
            setStartDateZus: (value) => set({ startDateZus: value }),
            setEndDateZus: (value) => set({ endDateZus: value }),

            addVariableZus: () => set({
                variablesZus: [
                    ...get().variablesZus,
                    {
                        id: Date.now(),
                        color: getRandomColor(),
                        variableName: null,
                        variableMeasurement: null,
                    }
                ]
            }),
        
            removeVariableZus: (index) => set({
                variablesZus: get().variablesZus.filter((_, i) => i !== index)
            }),
        
            updateVariableZus: ({ index, updatedVariable }) => set({
                variablesZus: get().variablesZus.map((variable, i) =>
                    i === index ? updatedVariable : variable
                )
            }),

            getWsMessageZus: () => set({
                wsMessageZus: {
                    graph: {
                        maxPointsCountZus: get().maxPointsCount,
                        isWsActiveZus: get().isWsActive,
                        offsetZus: get().offset,
                        startDateZus: get().startDate,
                        endDateZus: get().endDate,
                        variablesZus: get().variables,
                    }
                }
            }),
            
            clearWsMessageZus: () => set({ wsMessageZus: {} }),
        }),
        {
            name: "graph-storage", 
        }
    )
);
