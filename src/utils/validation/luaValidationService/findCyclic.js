import { tarjanCyclicDeps } from "./tarjan";

export function findCyclic(variables) {
    const graph = buildDepGraph(variables);
    const tarjan = tarjanCyclicDeps(graph);
    return tarjan;
}

function buildDepGraph(variables) {
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

function buildDepGraphAst(asts, variables) {
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
