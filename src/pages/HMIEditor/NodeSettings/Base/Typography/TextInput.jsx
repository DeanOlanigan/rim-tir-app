import { Field, Textarea } from "@chakra-ui/react";
import { applyPatch, sameCheck, useNodesByIds } from "../../utils";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { LOCALE } from "@/pages/HMIEditor/constants";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function applyTextPatch(ids, text, undoable) {
    const patch = {};
    for (const id of ids) patch[id] = { text };
    applyPatch(patch, undoable, ["text"]);
}

export const TextInputBlock = ({ ids }) => {
    const idsKey = ids.join("|");

    const texts = useNodesByIds(ids, "text");
    const sameText = sameCheck(texts);
    const mixed = sameText == null;

    // базовое значение для UI
    const baseStr = useMemo(
        () => (mixed ? "" : String(sameText ?? "")),
        [mixed, sameText],
    );

    const [innerValue, setInnerValue] = useState(baseStr);

    // live props -> для замыканий
    const propsRef = useRef({ ids });
    propsRef.current = { ids };

    // targetRef фиксирует ids на момент начала редактирования
    const targetRef = useRef(null);
    const lockTarget = () => {
        if (!targetRef.current) targetRef.current = propsRef.current;
    };
    const getTarget = () => targetRef.current ?? propsRef.current;

    const touchedRef = useRef(false);
    const committedRef = useRef(true);

    const lastStringRef = useRef(baseStr); // то, что сейчас набрано
    const lastValidRef = useRef(baseStr); // то, на что откатываемся

    // 1) Синхронизация извне, если не редактируем
    useEffect(() => {
        if (touchedRef.current) return;
        lastStringRef.current = baseStr;
        lastValidRef.current = baseStr;
        setInnerValue(baseStr);
    }, [baseStr]);

    const revert = useCallback(() => {
        committedRef.current = true;
        touchedRef.current = false;
        targetRef.current = null;
        lastStringRef.current = lastValidRef.current ?? "";
        setInnerValue(lastValidRef.current ?? "");
    }, []);

    const commit = useCallback(() => {
        if (committedRef.current) return;
        const text = lastStringRef.current ?? "";

        committedRef.current = true;
        lastValidRef.current = text;

        const { ids: cIds } = getTarget();
        if (cIds && cIds.length) {
            applyTextPatch(cIds, text, true);
            useNodeStore.getState().clearInteractiveSnapshot();
        }

        touchedRef.current = false;
        targetRef.current = null;
    }, []);

    // 2) Commit при смене выделения (как мы сделали для чисел через contextKey)
    useEffect(() => {
        // если было незакоммичено — дожимаем в старую цель
        if (touchedRef.current && !committedRef.current) {
            const text = lastStringRef.current ?? "";
            const { ids: cIds } = getTarget();
            if (cIds && cIds.length) {
                applyTextPatch(cIds, text, true);
            }
        }

        // сброс состояния под новый контекст
        targetRef.current = null;
        touchedRef.current = false;
        committedRef.current = true;

        lastStringRef.current = baseStr;
        lastValidRef.current = baseStr;
        setInnerValue(baseStr);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idsKey]); // граница контекста

    // 3) Safety commit при размонтировании
    useEffect(() => {
        return () => {
            if (!touchedRef.current || committedRef.current) return;
            const text = lastStringRef.current ?? "";
            const { ids: cIds } = getTarget();
            if (cIds && cIds.length) {
                applyTextPatch(cIds, text, true);
            }
        };
    }, []);

    const handleChange = (text) => {
        lockTarget();

        setInnerValue(text);
        lastStringRef.current = text;

        touchedRef.current = true;
        committedRef.current = false;

        const { ids: cIds } = getTarget();
        if (cIds && cIds.length) {
            applyTextPatch(cIds, text, false);
        }
    };

    return (
        <Field.Root>
            <Field.Label>{LOCALE.text}</Field.Label>
            <Textarea
                size={"xs"}
                minHeight={"8"}
                height={"12"}
                maxHeight={"20"}
                value={innerValue}
                placeholder={mixed ? LOCALE.mixed : undefined}
                onFocus={() =>
                    useNodeStore
                        .getState()
                        .beginInteractiveSnapshot(ids, ["text"])
                }
                onChange={(e) => handleChange(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === "Escape") {
                        e.preventDefault();
                        revert();
                    }
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        e.preventDefault();
                        commit();
                    }
                }}
            />
        </Field.Root>
    );
};
