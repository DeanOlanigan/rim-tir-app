function deepTraverse(data, callback) {
    if (Array.isArray(data)) {
        data.forEach((item) => deepTraverse(item, callback));
    } else if (data && typeof data === "object") {
        callback(data);
        Object.values(data).forEach((item) => deepTraverse(item, callback));
    }
}

export function collectDependenciesFromLogic(logic) {
    const deps = [];
    deepTraverse(logic, (item) => {
        if (item.find) {
            const items = Array.isArray(item.find) ? item.find : [item.find];
            items.forEach((item) => {
                if (item.what) {
                    deps.push({
                        what: item.what,
                        where: item.where,
                        path: item?.path,
                    });
                }
            });
        }
    });
    return deps;
}

const resolvers = {
    self: ({ dep, nodePath }) => {
        dep.path = `${nodePath}:${dep.what}`;
    },
    parent: ({ dep, nodePaths, nodePath }) => {
        let currentPath = nodePath;
        while (currentPath !== "#") {
            currentPath = nodePaths[currentPath].parentPath;
            const settings = nodePaths[currentPath]?.settings;
            if (settings?.[dep.what]) {
                dep.path = `${currentPath}:${dep.what}`;
                break;
            }
        }
    },
};

export function resolveFind(nodePaths, settingPaths) {
    for (const [paramPath, deps] of Object.entries(settingPaths)) {
        const nodePath = paramPath.split(":")[0];
        if (deps.length === 0) continue;
        for (const dep of deps) {
            if (dep.path) continue;
            resolvers[dep.where]({ dep, nodePaths, nodePath });
        }
    }
}
