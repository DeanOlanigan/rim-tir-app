import { tarjanCyclicDeps } from "./tarjan";
import { CHILD_KEYS } from "./validateCode";

export function findCyclic(variables) {
    const graph = buildDepGraph(variables);
    const tarjan = tarjanCyclicDeps(graph);
    return tarjan;
}

export function findCyclicFromAST(variables, asts) {
    const graph = buildDepGraphFromAST(variables, asts);
    return tarjanCyclicDeps(graph);
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

function buildDepGraphFromAST(variables, asts) {
    const graph = {};

    const nameToId = new Map();
    for (const v of variables) {
        if (v.name) nameToId.set(v.name, v.id);
        graph[v.id] = [];
    }

    for (const v of variables) {
        const entry = asts.get(v.id);
        if (!entry?.ast) continue;
        const deps = collectWritesDeps(entry.ast, nameToId);
        if (deps.size) graph[v.id] = Array.from(deps);
    }

    return graph;
}

function collectWritesDeps(ast, nameToId) {
    const out = new Set();

    const stack = [ast];
    while (stack.length) {
        const node = stack.pop();
        if (!node || typeof node !== "object") continue;

        switch (node.type) {
            case "AssignmentExpression": {
                const vars = node.variables || [];
                for (const lhs of vars) {
                    if (lhs.type === "Identifier") {
                        const name = lhs.name;
                        if (nameToId.has(name)) out.add(nameToId.get(name));
                    }
                }
                break;
            }
            case "CallExpression": {
                const callee = node.base;
                let fn = null;
                if (callee.type === "Identifier") {
                    fn = callee.name;
                } else if (callee.type === "MemberExpression") {
                    fn = callee.identifier?.name;
                }

                if (fn === "update") {
                    const first = node.arguments?.[0];
                    if (first?.type === "Identifier") {
                        const name = first.name;
                        if (nameToId.has(name)) out.add(nameToId.get(name));
                    }
                }
                break;
            }
        }

        const keys = CHILD_KEYS[node.type];

        if (keys) {
            for (let i = keys.length - 1; i >= 0; i--) {
                const v = node[keys[i]];
                if (Array.isArray(v)) {
                    for (let j = v.length - 1; j >= 0; j--) {
                        const c = v[j];
                        if (c && typeof c === "object") stack.push(c);
                    }
                } else if (v && typeof v === "object") {
                    stack.push(v);
                }
            }
        }
    }

    return out;
}
