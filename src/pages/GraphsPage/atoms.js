import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { getStartDate, getEndDate } from "@/utils/utils";
import { getRandomColor } from "@/utils/utils";

export const maxPointsCountAtom = atomWithStorage("graphMaxPointsCount", 100);
export const isWsActiveAtom = atomWithStorage("graphIsWsActive", false);
export const offsetAtom = atomWithStorage("graphOffset", 120);
export const startDateAtom = atomWithStorage("graphStartDate", getStartDate());
export const endDateAtom = atomWithStorage("graphEndDate", getEndDate());

//#region variables
export const variablesAtom = atomWithStorage("graphVariables", []);

export const addVariableAtom = atom(null, (get, set) => {
    const prevVars = get(variablesAtom);
    set(variablesAtom, [
        ...prevVars,
        {
            id: Date.now(),
            color: getRandomColor(),
            variableName: null,
            variableMeasurement: null,
        },
    ]);
});

export const removeVariableAtom = atom(null, (get, set, index) => {
    const prevVars = get(variablesAtom);
    const nextVars = prevVars.filter((_, i) => i !== index);
    set(variablesAtom, nextVars);
});

export const updateVariableAtom = atom(
    null,
    (get, set, { index, updatedVariable }) => {
        const prevVars = get(variablesAtom);
        const nextVars = prevVars.map((variable, i) =>
            i === index ? updatedVariable : variable
        );
        set(variablesAtom, nextVars);
    }
);
//#endregion

//#region wsMessage
export const wsMessageAtom = atomWithStorage("graphMessage", {});

export const getWsMessageAtom = atom(null, (get, set) => {
    set(wsMessageAtom, {
        graph: {
            maxPointsCount: get(maxPointsCountAtom),
            isWsActive: get(isWsActiveAtom),
            offset: get(offsetAtom),
            startDate: get(startDateAtom),
            endDate: get(endDateAtom),
            variables: get(variablesAtom),
        },
    });
});

export const clearWsMessageAtom = atom(null, (_, set) => {
    set(wsMessageAtom, {});
});
//#endregion
