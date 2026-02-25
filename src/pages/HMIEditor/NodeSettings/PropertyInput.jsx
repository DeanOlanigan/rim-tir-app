import { useMemo } from "react";
import { applyPatch, isFiniteValue, sameCheck, useNodesByIds } from "./utils";
import { CommittedNumberInput } from "./CommittedNumberInput";
import { useNodeStore } from "../store/node-store";

// Дефолтные трансформеры, если не переданы пропсы (1 к 1)
const identity = (v) => v;

function updateNodeProperty(ids, value, property, undoable = false) {
    if (!isFiniteValue(value)) return;
    const patch = {};
    for (const id of ids) patch[id] = { [property]: value };
    applyPatch(patch, undoable, property);
}

export const PropertyInput = ({
    ids,
    property,
    label,
    step = 1,
    min = -Infinity,
    max = Infinity,
    disabled = false,
    mapFromStore = identity,
    mapToStore = identity,
    placeholder,
}) => {
    const store = useNodeStore.getState();

    // 1. Получаем "сырые" данные из стора
    const rawValues = useNodesByIds(ids, property);
    const rawValue = sameCheck(rawValues);

    // 2. Преобразуем в UI-формат (если mixed values, то null)
    const uiValue = useMemo(() => {
        if (rawValue == null) return null;
        const mapped = mapFromStore(rawValue);
        return isFiniteValue(mapped) ? mapped : null;
    }, [rawValue, mapFromStore]);

    const idsKey = ids.join("|");

    return (
        <CommittedNumberInput
            contextKey={`${idsKey}:${property}`}
            uiValue={uiValue}
            label={label}
            placeholder={placeholder}
            step={step}
            min={min}
            max={max}
            disabled={disabled}
            onFocusChange={(d) => {
                if (d.focused) {
                    store.beginInteractiveSnapshot(ids, [property]);
                } else {
                    store.clearInteractiveSnapshot();
                }
            }}
            onScrub={(n) => {
                const storeValue = mapToStore(n);
                if (!isFiniteValue(storeValue)) return;
                updateNodeProperty(ids, storeValue, [property], false);
            }}
            onCommit={(n) => {
                const storeValue = mapToStore(n);
                if (!isFiniteValue(storeValue)) return;
                updateNodeProperty(ids, storeValue, [property], false);
                updateNodeProperty(ids, storeValue, [property], true);
                store.beginInteractiveSnapshot(ids, [property]);
            }}
        />
    );
};
