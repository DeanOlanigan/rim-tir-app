import { useMemo } from "react";
import { isFiniteValue, sameCheck, useNodesByIds } from "./utils";
import { patchStoreRaf, useNodeStore } from "../store/node-store";
import { CommittedNumberInput } from "./CommittedNumberInput";

// Дефолтные трансформеры, если не переданы пропсы (1 к 1)
const identity = (v) => v;

function updateNodeProperty(ids, value, property, undoable = false) {
    if (!isFiniteValue(value)) return;

    const patch = {};

    for (const id of ids) patch[id] = { [property]: value };

    if (undoable) {
        patchStoreRaf.flushNow?.();
        useNodeStore.getState().updateNodes(patch);
    } else {
        patchStoreRaf(patch);
    }
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
            onScrub={(n) => {
                const storeValue = mapToStore(n);
                if (!isFiniteValue(storeValue)) return;
                updateNodeProperty(ids, storeValue, property, false);
            }}
            onCommit={(n) => {
                const storeValue = mapToStore(n);
                if (!isFiniteValue(storeValue)) return;
                updateNodeProperty(ids, storeValue, property, true);
            }}
        />
    );
};
