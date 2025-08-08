import { createListCollection } from "@chakra-ui/react";
import { collectDependenciesFromLogic } from "./logicDependency";

export function rulesTraverse(paramPath, rules, settingPaths) {
    for (const rule of rules) {
        if (rule.workIf) {
            if (!settingPaths[paramPath]) settingPaths[paramPath] = [];
            const deps = collectDependenciesFromLogic(rule.workIf);
            for (const dep of deps) {
                settingPaths[paramPath].push(dep);
            }
        }
    }
}

export function settingsTraverse(node, path, settingPaths) {
    for (const [paramName, paramConfig] of Object.entries(node.settings)) {
        const paramPath = `${path}:${paramName}`;

        if (paramConfig.type === "enum") {
            paramConfig.enumValues = createListCollection({
                items: paramConfig.enumValues,
            });
        }

        if (paramConfig.rules) {
            rulesTraverse(paramPath, paramConfig.rules, settingPaths);
        }
    }
}
