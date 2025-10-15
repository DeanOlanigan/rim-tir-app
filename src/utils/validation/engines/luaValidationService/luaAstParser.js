import { parse } from "luaparse";
import {
    addMarker,
    checkDivision,
    checkForbiddenConstructs,
    collectFunctionDecls,
    getVarsToCheckCycle,
    getVarsToHighlight,
    SEVERITY_ERROR,
    validateCallExpression,
} from "./validateCode";

export function luaAstParse(code, varIdsByName, id) {
    const t0 = performance.now();
    const markers = [];
    const varsToHighlight = [];
    const varsToCheckCycle = new Set();

    const allFn = [];
    const allowedFn = new WeakSet();

    try {
        parse(code, {
            luaVersion: "5.3",
            locations: true,
            ranges: true,
            onCreateNode: (node) => {
                checkDivision(node, markers);
                checkForbiddenConstructs(node, markers);
                validateCallExpression(node, markers, varIdsByName);
                collectFunctionDecls(node, allFn, allowedFn);
                getVarsToCheckCycle(node, varIdsByName, varsToCheckCycle);
                getVarsToHighlight(node, varIdsByName, varsToHighlight);
            },
        });

        for (const fn of allFn) {
            if (!allowedFn.has(fn)) {
                addMarker(
                    markers,
                    fn,
                    "Объявление функций разрешено только через delay"
                );
            }
        }
    } catch (error) {
        markers.push({
            startLineNumber: error.line || 1,
            startColumn: error.column || 1,
            endLineNumber: error.line || 1,
            endColumn: (error.column || 1) + 1,
            message: "Синтаксическая ошибка: " + error.message,
            severity: SEVERITY_ERROR,
        });
    }

    //console.log("PARSE RESULT", markers, varsToHighlight, depGraph);
    console.log(`${id} AST PERF`, performance.now() - t0);
    return { markers, varsToHighlight, varsToCheckCycle };
}
