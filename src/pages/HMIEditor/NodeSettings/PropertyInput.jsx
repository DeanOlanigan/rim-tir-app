import { useMemo } from "react";
import {
    applyPatch,
    isFiniteValue,
    sameCheck,
    useEffectiveParamsByIds,
} from "./utils";
import { CommittedNumberInput } from "./CommittedNumberInput";
import { useInteractiveStore } from "../store/interactive-store";

// Дефолтные трансформеры, если не переданы пропсы (1 к 1)
const identity = (v) => v;

function updateNodeProperty(ids, value, property, undoable = false) {
    if (!isFiniteValue(value)) return;
    const patch = {};
    for (const id of ids) patch[id] = { [property]: value };
    applyPatch(patch, undoable);
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
    const rawValues = useEffectiveParamsByIds(ids, property);
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
                const int = useInteractiveStore.getState();
                if (!d.focused) int.cancel();
            }}
            onScrubStart={() => {
                const int = useInteractiveStore.getState();
                if (!int.active) int.begin();
            }}
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
