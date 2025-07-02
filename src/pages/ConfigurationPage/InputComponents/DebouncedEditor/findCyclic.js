import {
    buildDepGraph,
    tarjanCyclicDeps,
} from "@/utils/variablesCyclicDepsFinder";

export function findCyclic(variables) {
    const graph = buildDepGraph(variables);
    const tarjan = tarjanCyclicDeps(graph);
    return tarjan;
}
