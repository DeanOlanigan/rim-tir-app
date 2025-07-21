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
        graph[variable.id] = [];

        if (variable.setting.luaExpression) {
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
                    eqPattern.test(variable.setting.luaExpression) ||
                    updatePattern.test(variable.setting.luaExpression)
                ) {
                    if (!graph[variable.id].includes(checkVar.id)) {
                        graph[variable.id].push(checkVar.id);
                    }
                }
            }
        }
    }
    return graph;
}

// TODO Доделать, если будут проблемы с оптимизацией
function getIdentifiers(ast) {
    const identifiers = [];

    function walk(node) {
        if (!node) return;

        if (node.type === "Identifier") {
            identifiers.push(node.name);
        }

        for (const key in node) {
            if (Array.isArray(node[key])) {
                node[key].forEach((child) => {
                    if (typeof child === "object" && child !== null) {
                        walk(child);
                    }
                });
            } else if (
                typeof node[key] === "object" &&
                node[key] !== null &&
                node[key].type
            ) {
                walk(node[key]);
            }
        }
    }

    walk(ast);
    return identifiers;
}

export function buildDepGraphAst(asts, variables) {
    const graph = {};
    for (const { id, ast } of asts) {
        graph[id] = [];
        const identifiers = getIdentifiers(ast);
        for (const variable of variables) {
            if (identifiers.includes(variable.name)) {
                graph[id].push(variable.id);
            }
        }
    }
    return graph;
}

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
            if (graph[node] && graph[node].includes(node)) {
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
