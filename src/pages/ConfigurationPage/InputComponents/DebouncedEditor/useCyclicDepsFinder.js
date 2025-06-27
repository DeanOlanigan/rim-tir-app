import { useVariablesStore } from "@/store/variables-store";
import {
    buildDepGraph,
    findCyclicDeps,
    getAllVariables,
} from "@/utils/variablesCyclicDepsFinder";
import { useCallback } from "react";

export function useCyclicDepsFinder() {
    const find = useCallback((id) => {
        const sett = useVariablesStore.getState().settings;
        const vars = getAllVariables(sett);
        console.log("vars", vars);
        const graph = buildDepGraph(vars);
        console.log("graph", graph);
        const cyclic = findCyclicDeps(graph, sett[id].name);
        console.log("cyclic", cyclic);
        return cyclic;
    }, []);

    return find;
}
