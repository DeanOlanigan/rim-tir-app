import { Fieldset, Group, IconButton, SimpleGrid } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
    RxCornerBottomLeft,
    RxCornerBottomRight,
    RxCornerTopLeft,
    RxCornerTopRight,
} from "react-icons/rx";
import { LuMaximize } from "react-icons/lu";
import { applyPatch, sameCheck, useEffectiveParamsByIds } from "../utils";
import { LOCALE, SHAPES } from "../../constants";
import { CommittedNumberInput } from "../CommittedNumberInput";
import { useInteractiveStore } from "../../store/interactive-store";

const CORNER_ICONS = [
    RxCornerTopLeft,
    RxCornerTopRight,
    RxCornerBottomLeft,
    RxCornerBottomRight,
];

function normalizeNumber(input) {
    if (typeof input === "number") {
        if (!Number.isFinite(input) || input < 0) return 0;
        return input;
    }

    const normalized = String(input ?? "").replace(",", ".");
    const n = parseFloat(normalized);
    if (!Number.isFinite(n) || n < 0) return 0;
    return n;
}

function areAllEqual(arr) {
    if (!arr.length) return true;
    const first = arr[0];
    return arr.every((v) => v === first);
}

// UI порядок: [tl, tr, bl, br]
function fromRectCornerRadiusStore(value) {
    if (Array.isArray(value)) {
        const [tl = 0, tr = 0, br = 0, bl = 0] = value;
        return [tl, tr, bl, br].map((v) => normalizeNumber(v));
    }
    const v = normalizeNumber(value);
    return [v, v, v, v];
}

// Store порядок: [tl, tr, br, bl]
function toRectCornerRadiusStore([tl, tr, bl, br]) {
    return [tl, tr, br, bl];
}

export const CornerRadiusBlock = ({ ids, types }) => {
    const idsKey = ids.join("|");
    const rawCornerRadiuses = useEffectiveParamsByIds(ids, "cornerRadius");

    const allRects = useMemo(
        () => types.length > 0 && types.every((t) => t === SHAPES.rect),
        [types],
    );

    const beginInteractive = () => {
        const int = useInteractiveStore.getState();
        if (!int.active) int.begin();
    };
    const cancelInteractive = () => {
        const int = useInteractiveStore.getState();
        if (int.active) int.cancel();
    };

    // 1) униформное значение на ноду (для rect: только если все 4 угла равны)
    const uniformPerNode = useMemo(
        () =>
            ids.map((_, idx) => {
                const t = types[idx];
                const cr = rawCornerRadiuses[idx];

                if (t === SHAPES.rect) {
                    const corners = fromRectCornerRadiusStore(cr);
                    return areAllEqual(corners) ? corners[0] : null;
                }

                if (t === SHAPES.polygon) {
                    if (Array.isArray(cr)) return normalizeNumber(cr[0] ?? 0);
                    return normalizeNumber(cr);
                }

                return null;
            }),
        [ids, types, rawCornerRadiuses],
    );

    // "" означает mixed в UI
    const uniformValue = useMemo(() => {
        if (!uniformPerNode.length) return "";
        const first = uniformPerNode[0];
        if (first === null) return "";
        return uniformPerNode.every((v) => v === first) ? first : "";
    }, [uniformPerNode]);

    // 2) rect-only: углы по каждой ноде в UI порядке [tl,tr,bl,br]
    const rectCornersByNode = useMemo(() => {
        if (!allRects) return [];
        return rawCornerRadiuses.map((cr) => fromRectCornerRadiusStore(cr));
    }, [allRects, rawCornerRadiuses]);

    const sameRectCorners = useMemo(() => {
        if (!allRects || !rectCornersByNode.length) return null;
        const first = rectCornersByNode[0];
        const ok = rectCornersByNode.every(
            (a) =>
                a.length === first.length && a.every((v, i) => v === first[i]),
        );
        return ok ? first : null;
    }, [allRects, rectCornersByNode]);

    const perCornerValues = useMemo(() => {
        if (!allRects) return [];
        return [0, 1, 2, 3].map((i) =>
            sameCheck(rectCornersByNode.map((cr) => cr[i])),
        );
    }, [allRects, rectCornersByNode]);

    const initialShowMixed = useMemo(() => {
        if (!allRects) return false;
        if (!sameRectCorners) return true;
        return !areAllEqual(sameRectCorners);
    }, [allRects, sameRectCorners]);

    const [showMixed, setShowMixed] = useState(initialShowMixed);

    // ВАЖНО: сброс showMixed при смене выделения (а не при каждом патче во время scrub)
    useEffect(() => {
        setShowMixed(initialShowMixed);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idsKey]);

    useEffect(() => {
        if (!allRects && showMixed) setShowMixed(false);
    }, [allRects, showMixed]);

    // ---- PATCH BUILDERS ----

    const buildUniformPatch = (raw) => {
        const v = normalizeNumber(raw);
        const patch = {};

        ids.forEach((id, idx) => {
            const t = types[idx];
            if (t === SHAPES.rect) {
                patch[id] = {
                    cornerRadius: toRectCornerRadiusStore([v, v, v, v]),
                };
            } else if (t === SHAPES.polygon) {
                patch[id] = { cornerRadius: v };
            }
        });

        return patch;
    };

    const baseRectCorners = sameRectCorners ??
        rectCornersByNode[0] ?? [0, 0, 0, 0];

    const buildMixedRectPatch = (cornerIndex, raw) => {
        if (!allRects) return null;

        const v = normalizeNumber(raw);
        const next = [...baseRectCorners];
        next[cornerIndex] = v;

        const patch = {};
        ids.forEach((id, idx) => {
            const t = types[idx];
            if (t === SHAPES.rect) {
                patch[id] = { cornerRadius: toRectCornerRadiusStore(next) };
            }
        });

        return patch;
    };

    const toggleMixed = () => {
        if (!allRects) return;

        setShowMixed((prev) => {
            const next = !prev;

            if (!next) {
                const base = baseRectCorners;
                const patch = buildUniformPatch(base[0] ?? 0);
                applyPatch(patch, true, ["cornerRadius"]);
            }

            return next;
        });
    };

    const uniformUiValue =
        typeof uniformValue === "number" ? uniformValue : null;

    return (
        <Fieldset.Root>
            <Fieldset.Legend>{LOCALE.cornerRadius}</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <CommittedNumberInput
                        key={`cr:uniform:${idsKey}`}
                        uiValue={uniformUiValue}
                        label={<LuMaximize />}
                        placeholder={LOCALE.mixed}
                        step={1}
                        min={0}
                        max={100}
                        onFocusChange={(d) => {
                            if (!d.focused) cancelInteractive();
                        }}
                        onScrubStart={beginInteractive}
                        onScrub={(n) => applyPatch(buildUniformPatch(n), false)}
                        onCommit={(n) => applyPatch(buildUniformPatch(n), true)}
                    />
                    {allRects && (
                        <IconButton
                            size={"xs"}
                            variant={showMixed ? "solid" : "outline"}
                            onClick={toggleMixed}
                        >
                            <LuMaximize />
                        </IconButton>
                    )}
                </Group>
                {allRects && showMixed && (
                    <SimpleGrid columns={2} gap={2} mt={2}>
                        {perCornerValues.map((value, index) => {
                            const Icon = CORNER_ICONS[index];
                            const ui = typeof value === "number" ? value : null;

                            return (
                                <CommittedNumberInput
                                    key={`cr:${idsKey}:${index}`}
                                    uiValue={ui}
                                    label={<Icon />}
                                    placeholder={LOCALE.mixed}
                                    step={1}
                                    min={0}
                                    max={100}
                                    onFocusChange={(d) => {
                                        if (!d.focused) cancelInteractive();
                                    }}
                                    onScrubStart={beginInteractive}
                                    onScrub={(n) => {
                                        const patch = buildMixedRectPatch(
                                            index,
                                            n,
                                        );
                                        applyPatch(patch, false);
                                    }}
                                    onCommit={(n) => {
                                        const patch = buildMixedRectPatch(
                                            index,
                                            n,
                                        );
                                        applyPatch(patch, true);
                                    }}
                                />
                            );
                        })}
                    </SimpleGrid>
                )}
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
