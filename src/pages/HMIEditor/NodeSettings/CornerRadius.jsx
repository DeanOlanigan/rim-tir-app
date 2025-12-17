import {
    Fieldset,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
    SimpleGrid,
    Slider,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import {
    RxCornerBottomLeft,
    RxCornerBottomRight,
    RxCornerTopLeft,
    RxCornerTopRight,
} from "react-icons/rx";
import { LuMaximize } from "react-icons/lu";
import { sameCheck, useNodesByIds } from "./utils";
import { SHAPES } from "../constants";
import { patchStoreRaf } from "../store/node-store";

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

function fromRectCornerRadiusStore(value) {
    if (Array.isArray(value)) {
        const [tl = 0, tr = 0, br = 0, bl = 0] = value;
        return [tl, tr, bl, br].map((v) => normalizeNumber(v));
    }
    const v = normalizeNumber(value);
    return [v, v, v, v];
}

function toRectCornerRadiusStore([tl, tr, bl, br]) {
    return [tl, tr, br, bl];
}

export const CornerRadiusBlock = ({ ids, types }) => {
    const rawCornerRadiuses = useNodesByIds(ids, "cornerRadius");

    const allRects = useMemo(
        () => types.length > 0 && types.every((t) => t === SHAPES.rect),
        [types],
    );

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

    const uniformValue = useMemo(() => {
        if (!uniformPerNode.length) return "";
        const first = uniformPerNode[0];
        if (first === null) return "";
        return uniformPerNode.every((v) => v === first) ? first : "";
    }, [uniformPerNode]);

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

    useEffect(() => {
        if (!allRects && showMixed) setShowMixed(false);
    }, [allRects, showMixed]);

    const patchUniformAll = (raw) => {
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
        patchStoreRaf(ids, patch);
    };

    const patchMixedRectAll = (cornerIndex, raw) => {
        if (!allRects) return;
        const v = normalizeNumber(raw);

        const base = sameRectCorners ?? rectCornersByNode[0] ?? [0, 0, 0, 0];
        const next = [...base];
        next[cornerIndex] = v;

        const patch = {};
        ids.forEach((id, idx) => {
            const t = types[idx];
            if (t === SHAPES.rect) {
                patch[id] = { cornerRadius: toRectCornerRadiusStore(next) };
            }
        });
        patchStoreRaf(ids, patch);
    };

    const toggleMixed = () => {
        if (!allRects) return;
        setShowMixed((prev) => {
            const next = !prev;
            if (!next) {
                const base = sameRectCorners ??
                    rectCornersByNode[0] ?? [0, 0, 0, 0];
                patchUniformAll(base[0] ?? 0);
            }
            return next;
        });
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Corner radius</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        max={100}
                        value={uniformValue}
                        onValueChange={(e) => patchUniformAll(e.valueAsNumber)}
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>
                                    <LuMaximize />
                                </NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input placeholder="Mixed" />
                        </InputGroup>
                    </NumberInput.Root>
                    <Slider.Root
                        size={"sm"}
                        w={"100%"}
                        value={[uniformValue === "" ? 0 : (uniformValue ?? 0)]}
                        onValueChange={(e) => patchUniformAll(e.value[0])}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
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
                            return (
                                <NumberInput.Root
                                    key={index}
                                    size={"xs"}
                                    min={0}
                                    max={100}
                                    value={value}
                                    onValueChange={(e) =>
                                        patchMixedRectAll(
                                            index,
                                            e.valueAsNumber,
                                        )
                                    }
                                >
                                    <NumberInput.Control />
                                    <InputGroup
                                        startElementProps={{
                                            pointerEvents: "auto",
                                        }}
                                        startElement={
                                            <NumberInput.Scrubber>
                                                <Icon />
                                            </NumberInput.Scrubber>
                                        }
                                    >
                                        <NumberInput.Input placeholder="Mixed" />
                                    </InputGroup>
                                </NumberInput.Root>
                            );
                        })}
                    </SimpleGrid>
                )}
            </Fieldset.Content>
        </Fieldset.Root>
    );
};
