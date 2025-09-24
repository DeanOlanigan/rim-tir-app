import { createListCollection } from "@chakra-ui/react";
import { collectDependenciesFromLogic } from "./logicDependency";

function rulesTraverse(paramPath, condition, map) {
    if (!map[paramPath]) map[paramPath] = [];
    const deps = collectDependenciesFromLogic(condition);
    for (const dep of deps) {
        map[paramPath].push(dep);
    }
}

export function settingsTraverse(node, path, settingPaths, visiblePaths) {
    for (const [paramName, paramConfig] of Object.entries(node.settings)) {
        const paramPath = `${path}:${paramName}`;

        if (paramConfig.type === "enum") {
            paramConfig.enumValues = createListCollection({
                items: paramConfig.enumValues,
            });
        }

        if (paramConfig.rules) {
            for (const rule of paramConfig.rules) {
                if (rule.workIf) {
                    rulesTraverse(paramPath, rule.workIf, settingPaths);
                }
            }
        }

        if (paramConfig.visibleIf) {
            rulesTraverse(paramPath, paramConfig.visibleIf, visiblePaths);
        }
    }
}
