/* import { memo } from "react";
import { useVariablesStore } from "@/store/variables-store";
import { useMaskito } from "@maskito/react";
import { Input } from "@chakra-ui/react";

const ipMask = {
    mask: /^(\d{0,3}(\.\d{0,3}){0,3})$/,
    postprocessors: [
        ({ value, selection }) => {
            const [initialStart, initialEnd] = selection;
            let start = initialStart;
            let end = initialEnd;

            const clampOctet = (part) => {
                const noZeros = part.replace(/^0+(?=\d)/, "");
                const num = parseInt(noZeros || "0", 10);
                const clamped = Math.min(Math.max(num, 0), 255);
                return String(clamped);
            };

            const formatted = Array.from(value).reduce((text, char, idx) => {
                if (char !== "." && !/\d/.test(char)) {
                    return text;
                }

                const parts = text.split(".");
                const lastPart = parts.pop() || "";
                const prefix = parts.length ? parts.join(".") + "." : "";

                // 1) Автовставка точки сразу после третьей цифры в октете
                if (
                    /\d/.test(char) &&
                    lastPart.length + 1 === 3 &&
                    parts.length < 3
                ) {
                    const newLast = clampOctet(lastPart + char);
                    // учёт смещения курсора из‑за точки
                    if (idx <= initialStart) start++;
                    if (idx <= initialEnd) end++;
                    return prefix + newLast + ".";
                }

                // 2) Если сами ввели точку — проверяем дубли и количество
                if (char === ".") {
                    const dotCount = (text.match(/\./g) || []).length;
                    if (text.endsWith(".") || dotCount >= 3) {
                        return text;
                    }
                    if (idx <= initialStart) start++;
                    if (idx <= initialEnd) end++;
                    return text + ".";
                }

                // 3) Обычная цифра: просто добавляем и clamp
                const newLast = clampOctet(lastPart + char);
                return prefix + newLast;
            }, "");

            return {
                value: formatted,
                selection: [start, end],
            };
        },
    ],
};

export const IpInput = memo(function IpInput(props) {
    const { id, targetKey, value, ...rest } = props;
    const setSettings = useVariablesStore((state) => state.setSettings);
    const inputRef = useMaskito({ options: ipMask });

    return (
        <Input
            ref={inputRef}
            size={"xs"}
            value={value}
            onInput={(e) => {
                setSettings(id, {
                    [targetKey]: e.target.value,
                });
            }}
            {...rest}
        />
    );
});
 */
