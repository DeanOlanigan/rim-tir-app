import { shallowEqual } from "@/utils/utils";
import { ensureBindings } from "./helpers";

export function upsertBindingByProp({ node, property, changes }) {
    const b = ensureBindings(node);
    const prevByProp = b.byProp ?? {};
    const prevBinding = prevByProp[property];

    // дефолты биндинга (без id/property)
    const nextBinding = {
        enabled: true,
        useGlobal: true,
        mode: "direct",
        property,
        rules: [],
        ...(prevBinding || null),
        ...(changes || null),
    };

    // если по факту ничего не поменялось (на верхнем уровне) — можно ранний выход
    if (
        prevBinding &&
        shallowEqual(prevBinding, nextBinding) &&
        node.bindings?.byProp
    ) {
        return node;
    }

    return {
        ...node,
        bindings: {
            globalVarId: b.globalVarId ?? null,
            byProp: {
                ...prevByProp,
                [property]: nextBinding,
            },
        },
    };
}
