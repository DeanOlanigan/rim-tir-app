import { withNodeHistoryMuted } from "../history-gate";

export function runCommand(storeApi, actionName, build, opts) {
    const { set } = storeApi;
    const merge = opts?.merge ?? true;
    const trackHistory = opts?.history !== false;

    const exec = () =>
        set(
            (state) => {
                const res = build(state);
                if (!res) return state;

                let nextState;

                if (res.next) {
                    nextState = res.next;
                } else if (res.patch) {
                    nextState = merge ? { ...state, ...res.patch } : res.patch;
                } else {
                    nextState = state;
                }

                // Policy
                nextState = applyDirty(nextState, res);
                nextState = applySelection(state, nextState, res);
                nextState = applyTreeRev(nextState, res);

                return nextState;
            },
            undefined,
            actionName,
        );

    if (!trackHistory) {
        return withNodeHistoryMuted(exec);
    }

    return exec();
}

const applyDirty = (next, res) => {
    if (res.dirty === undefined) return next;

    const curentIsDirty = next.meta?.isDirty ?? false;
    let newIsDirty = curentIsDirty;

    if (res.dirty === "clear" || res.dirty === false) {
        newIsDirty = false;
    } else if (
        res.dirty === true ||
        res.dirty === "set" ||
        res.dirty === "touch"
    ) {
        newIsDirty = true;
    }

    if (newIsDirty === curentIsDirty) return next;

    return {
        ...next,
        meta: {
            ...next.meta,
            isDirty: newIsDirty,
        },
    };
};

const applySelection = (prev, next, res) => {
    const mode = res.selection ?? "patch";

    switch (mode) {
        case "patch":
            return next;
        case "clear":
            return { ...next, selectedIds: [] };
        case "set":
            return { ...next, selectedIds: res.selectedIds ?? [] };
        case "keep":
            return next.selectedIds === prev.selectedIds
                ? next
                : { ...next, selectedIds: prev.selectedIds };
        default:
            return next;
    }
};

const applyTreeRev = (next, res) => {
    if (res.tree) {
        return {
            ...next,
            meta: {
                ...next.meta,
                treeRev: next.meta.treeRev + 1,
            },
        };
    }

    return next;
};
