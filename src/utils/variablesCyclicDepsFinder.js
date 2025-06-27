export function getAllVariables(settings) {
    const items = Object.entries(settings)
        .map(([, item]) => {
            if (item.type === "variable") {
                return {
                    id: item.id,
                    name: item.name,
                    code: item.setting.luaExpression,
                };
            }
        })
        .filter(Boolean);

    return items;
}

export function findCyclicDeps(graph, startNode) {
    const visited = new Set();
    const stack = [];
    const onStack = new Set();

    const visit = (node) => {
        if (onStack.has(node)) {
            const idx = stack.indexOf(node);
            return stack.slice(idx).concat(node);
        }
        if (visited.has(node)) return null;

        visited.add(node);
        stack.push(node);
        onStack.add(node);

        for (const neighbor of graph[node] || []) {
            const cycle = visit(neighbor);
            if (cycle) return cycle;
        }

        stack.pop();
        onStack.delete(node);
        return null;
    };

    return visit(startNode) || false;
}

export function buildDepGraph(variables) {
    const graph = {};
    for (const variable of variables) {
        graph[variable.name] = [];

        if (variable.code) {
            for (const checkVar of variables) {
                if (!checkVar.name) continue;
                const eqPattern = new RegExp(
                    `\\b${checkVar.name}\\b\\s*=\\s*(?![=><!])`,
                    "g"
                );
                const updatePattern = new RegExp(
                    `\\bupdate\\s*\\(\\s*${checkVar.name}\\s*\\)`,
                    "g"
                );

                if (
                    eqPattern.test(variable.code) ||
                    updatePattern.test(variable.code)
                ) {
                    if (!graph[variable.name].includes(checkVar.name)) {
                        graph[variable.name].push(checkVar.name);
                    }
                }
            }
        }
    }
    return graph;
}
