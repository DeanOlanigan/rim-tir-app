import { Fieldset, Group, IconButton } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LuProportions } from "react-icons/lu";
import { useNodeStore } from "../../store/node-store";
import { applyPatch, isFiniteValue, useEffectiveParamsByIds } from "../utils";
import { isLineLikeType } from "../../utils";
import { LOCALE } from "../../constants";
import { CommittedNumberInput } from "../CommittedNumberInput";
import {
    changeLineDimByStore,
    collectSelectionDimensions,
} from "./dimensions.op";
import { useInteractiveStore } from "../../store/interactive-store";

/**
 * Если вдруг ты в будущем будешь уметь менять тип фигуры
 * (rect → line или наоборот) или добавишь какой-нибудь
 * “change primitive type” — DimensionsBlock может продолжать
 * считать, что это “не линия”, пока не изменится что-то ещё
 * (width/height или ids).
 */
function getType(id) {
    return useNodeStore.getState().nodes[id].type;
}

export const DimensionsBlock = ({ ids }) => {
    const idsKey = ids.join("|");

    const widths = useEffectiveParamsByIds(ids, "width");
    const heights = useEffectiveParamsByIds(ids, "height");

    const { width, height } = collectSelectionDimensions(
        ids,
        getType,
        widths,
        heights,
    );

    const [aspectRatio, setAspectRatio] = useState(false);

    const uiWidth =
        typeof width === "number" && isFiniteValue(width) ? width : null;
    const uiHeight =
        typeof height === "number" && isFiniteValue(height) ? height : null;

    const ratioSessionRaf = useRef({
        key: null,
        ratiosById: null,
    });

    const sessionKey = useMemo(
        () => `${idsKey}:${aspectRatio ? 1 : 0}`,
        [idsKey, aspectRatio],
    );

    useEffect(() => {
        ratioSessionRaf.current.key = sessionKey;
        ratioSessionRaf.current.ratiosById = null;
    }, [sessionKey]);

    const ensureRatios = () => {
        if (!aspectRatio) return null;

        const ref = ratioSessionRaf.current;
        if (ref.key === sessionKey && ref.ratiosById) return ref.ratiosById;

        const ratios = {};
        ids.forEach((id, idx) => {
            const t = getType(id);
            if (isLineLikeType(t)) return;
            const prevW = widths[idx];
            const prevH = heights[idx];
            const r =
                isFiniteValue(prevW) && isFiniteValue(prevH) && prevH > 0
                    ? prevW / prevH
                    : 1;
            ratios[id] = r;
        });

        ref.key = sessionKey;
        ref.ratiosById = ratios;
        return ratios;
    };

    const buildPatch = (dimType, rawNumber) => {
        const val = Number.isNaN(rawNumber) ? 0 : rawNumber;
        const target = Math.max(val, 0);

        const ratios = ensureRatios();

        const patch = {};

        ids.forEach((id) => {
            const t = getType(id);

            if (isLineLikeType(t)) {
                const res = changeLineDimByStore(
                    id,
                    dimType,
                    aspectRatio,
                    target,
                );
                if (res) patch[id] = res;
                return;
            }

            if (aspectRatio) {
                const r = ratios?.[id] ?? 1;
                if (dimType === "width") {
                    patch[id] = {
                        width: target,
                        height: r !== 0 ? target / r : target,
                    };
                } else {
                    patch[id] = { width: target * r, height: target };
                }
            } else {
                patch[id] = {
                    [dimType]: target,
                };
            }
        });

        return patch;
    };

    const toggleAspectRatio = () => setAspectRatio((prev) => !prev);

    const beginInteractive = () => {
        const int = useInteractiveStore.getState();
        int.begin();
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>{LOCALE.dimensions}</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <CommittedNumberInput
                        key={`dim:w:${sessionKey}`}
                        uiValue={Math.abs(uiWidth)}
                        label="W"
                        placeholder={LOCALE.mixed}
                        step={1}
                        min={0}
                        onScrubStart={beginInteractive}
                        onScrub={(n) => {
                            const patch = buildPatch("width", n);
                            applyPatch(patch, false);
                        }}
                        onCommit={(n) => {
                            const patch = buildPatch("width", n);
                            applyPatch(patch, true);
                        }}
                    />
                    <CommittedNumberInput
                        key={`dim:h:${sessionKey}`}
                        uiValue={Math.abs(uiHeight)}
                        label="H"
                        placeholder={LOCALE.mixed}
                        step={1}
                        min={0}
                        onScrubStart={beginInteractive}
                        onScrub={(n) => {
                            const patch = buildPatch("height", n);
                            applyPatch(patch, false);
                        }}
                        onCommit={(n) => {
                            const patch = buildPatch("height", n);
                            applyPatch(patch, true);
                        }}
                    />
                    <IconButton
                        size={"xs"}
                        variant={aspectRatio ? "solid" : "outline"}
                        onClick={toggleAspectRatio}
                    >
                        <LuProportions />
                    </IconButton>
                </Group>
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
