import { InputGroup, NumberInput } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { isFiniteValue } from "./utils";

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}

export const CommittedNumberInput = ({
    contextKey,
    uiValue,
    label,
    placeholder,
    step,
    min = -Infinity,
    max = Infinity,
    disabled = false,
    onFocusChange,
    onScrub,
    onScrubStart,
    onCommit,
    commitOnUnmount = true,
}) => {
    const baseStr = uiValue == null ? "" : String(uiValue);
    const [innerValue, setInnerValue] = useState(baseStr);

    // Храним актуальные пропсы для замыканий
    const propsRef = useRef({ min, max, onScrub, onCommit });
    propsRef.current = { min, max, onScrub, onCommit };

    const targetRef = useRef(null);
    const lockTarget = () => {
        if (!targetRef.current) targetRef.current = propsRef.current;
    };
    const getTarget = () => targetRef.current ?? propsRef.current;

    const scrubbingRef = useRef(false);
    const touchedRef = useRef(false);
    const committedRef = useRef(true);

    // последнее число (в UI-единицах)
    const lastNumberRef = useRef(uiValue ?? null);
    // последнее ВАЛИДНОЕ число + строка для отката (в UI-единицах)
    const lastValidNumberRef = useRef(uiValue ?? null);
    const lastValidStringRef = useRef(baseStr);

    useEffect(() => {
        // 1) если у нас есть незакоммиченный ввод — коммитим его в СТАРУЮ цель
        if (touchedRef.current && !committedRef.current) {
            const n = lastNumberRef.current;
            if (isFiniteValue(n)) {
                const t = getTarget(); // targetRef (старые ids/handlers) или propsRef
                if (n >= t.min && n <= t.max) {
                    t.onCommit?.(n);
                }
            }
        }

        // 2) сбрасываем состояние под новый контекст
        scrubbingRef.current = false;
        touchedRef.current = false;
        committedRef.current = true;
        targetRef.current = null;

        lastNumberRef.current = uiValue ?? null;
        lastValidNumberRef.current = uiValue ?? null;
        lastValidStringRef.current = baseStr;

        setInnerValue(baseStr);
        // eslint-disable-next-line
    }, [contextKey]); // важно: именно смена selection/property

    // Синхронизация извне, если мы не редактируем сами
    useEffect(() => {
        // не трогаем поле только если есть незакоммиченные локальные правки
        if (!committedRef.current || scrubbingRef.current) return;

        lastNumberRef.current = uiValue ?? null;
        lastValidNumberRef.current = uiValue ?? null;
        lastValidStringRef.current = baseStr;

        setInnerValue(baseStr);
    }, [baseStr, uiValue]);

    const revert = useCallback(() => {
        committedRef.current = true;
        touchedRef.current = false;
        setInnerValue(lastValidStringRef.current ?? "");
        lastNumberRef.current = lastValidNumberRef.current ?? null;
        targetRef.current = null; // сессия редактирования завершена
    }, []);

    const isInRange = useCallback((n) => {
        const t = getTarget();
        return n >= t.min && n <= t.max;
    }, []);

    // Функция коммита (запись в историю)
    const commit = useCallback(() => {
        if (committedRef.current) return;

        const n = lastNumberRef.current;
        if (!isFiniteValue(n) || !isInRange(n)) {
            revert();
            return;
        }

        committedRef.current = true;
        touchedRef.current = false;
        lastValidNumberRef.current = n;
        lastValidStringRef.current = String(n);

        const t = getTarget();
        t.onCommit?.(n);

        targetRef.current = null; // закрываем сессию
    }, [isInRange, revert]);

    // Обработка окончания скраббинга (глобальный pointerup)
    useEffect(() => {
        const endScrub = () => {
            if (!scrubbingRef.current) return;
            scrubbingRef.current = false;
            commit();
        };
        window.addEventListener("pointerup", endScrub);
        window.addEventListener("pointercancel", endScrub);
        return () => {
            window.removeEventListener("pointerup", endScrub);
            window.removeEventListener("pointercancel", endScrub);
        };
    }, [commit]);

    // Safety Commit при размонтировании
    useEffect(() => {
        if (!commitOnUnmount) return;
        return () => {
            if (!touchedRef.current || committedRef.current) return;

            const n = lastNumberRef.current;
            if (!isFiniteValue(n)) return;

            const t = getTarget();
            if (n < t.min || n > t.max) return;

            t.onCommit?.(n);
            targetRef.current = null;
        };
    }, [commitOnUnmount]);

    const handleChange = (valString, valNumber) => {
        lockTarget();

        setInnerValue(valString);

        touchedRef.current = true;
        committedRef.current = false;

        const n = Number.isNaN(valNumber) ? null : valNumber;
        lastNumberRef.current = n;

        if (!scrubbingRef.current) return;
        if (!isFiniteValue(n)) return;

        const t = getTarget();
        const clamped = clamp(n, t.min, t.max);
        t.onScrub?.(clamped);
    };

    return (
        <NumberInput.Root
            size="xs"
            value={innerValue}
            step={step}
            min={min}
            max={max}
            onValueChange={(e) => handleChange(e.value, e.valueAsNumber)}
            onFocusChange={(d) => onFocusChange(d)}
            disabled={disabled}
        >
            <InputGroup
                startElementProps={{ pointerEvents: "auto" }}
                startElement={
                    <NumberInput.Scrubber
                        onPointerDown={() => {
                            lockTarget();
                            scrubbingRef.current = true;
                            touchedRef.current = true;
                            committedRef.current = false;
                            onScrubStart?.();
                        }}
                    >
                        {label}
                    </NumberInput.Scrubber>
                }
            >
                <NumberInput.Input
                    placeholder={placeholder}
                    onBlur={commit}
                    onKeyDown={(e) => e.key === "Enter" && commit()}
                />
            </InputGroup>
        </NumberInput.Root>
    );
};
