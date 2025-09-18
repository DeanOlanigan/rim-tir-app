/**
 * https://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%A2%D0%B0%D1%80%D1%8C%D1%8F%D0%BD%D0%B0
 * @param {Object} graph buildDepGraph result
 * @returns {Object}
 */

export function tarjanCyclicDeps(graph) {
    let index = 0;
    const indices = {};
    const lowLinks = {};
    const stack = [];
    const onStack = {};
    const result = {};
    const sccs = [];

    for (const node in graph) {
        if (indices[node] === undefined) {
            strongConnect(node);
        }
    }

    function strongConnect(node) {
        indices[node] = index;
        lowLinks[node] = index;
        index++;
        stack.push(node);
        onStack[node] = true;

        for (const neighbor of graph[node] || []) {
            if (indices[neighbor] === undefined) {
                strongConnect(neighbor);
                lowLinks[node] = Math.min(lowLinks[node], lowLinks[neighbor]);
            } else if (onStack[neighbor]) {
                lowLinks[node] = Math.min(lowLinks[node], indices[neighbor]);
            }
        }

        if (lowLinks[node] === indices[node]) {
            const scc = [];
            let w;
            do {
                w = stack.pop();
                onStack[w] = false;
                scc.push(w);
            } while (w !== node);
            sccs.push(scc);
        }
    }

    for (const scc of sccs) {
        if (scc.length === 1) {
            const node = scc[0];
            if (graph[node] && graph[node].has(node)) {
                result[node] = [node];
            } else {
                result[node] = null;
            }
        } else {
            for (const node of scc) {
                result[node] = [...scc, scc[0]];
            }
        }
    }

    return result;
}
