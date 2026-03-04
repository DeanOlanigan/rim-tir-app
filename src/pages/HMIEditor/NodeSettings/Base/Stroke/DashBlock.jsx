import {
    createListCollection,
    Field,
    Group,
    Portal,
    Select,
} from "@chakra-ui/react";
import {
    applyPatch,
    isFiniteValue,
    sameCheck,
    useEffectiveParamsByIds,
    useNodesByIds,
} from "../../utils";
import { LOCALE } from "@/pages/HMIEditor/constants";
import { CommittedNumberInput } from "../../CommittedNumberInput";
import { useNodeStore } from "@/pages/HMIEditor/store/node-store";
import { useInteractiveStore } from "@/pages/HMIEditor/store/interactive-store";

const lineTypes = createListCollection({
    items: [
        { label: LOCALE.mixed, value: "mixed", disabled: true },
        { label: LOCALE.solid, value: "solid" },
        { label: LOCALE.dashed, value: "dashed" },
    ],
});

function isValidDashArray(d) {
    return (
        Array.isArray(d) &&
        d.length === 2 &&
        isFiniteValue(d[0]) &&
        isFiniteValue(d[1])
    );
}

function normalizeDashPart(x, fallback = 4) {
    return isFiniteValue(x) ? x : fallback;
}

function resolveDash(dashes) {
    if (!Array.isArray(dashes) || dashes.length === 0) {
        return { mixed: true, value: [undefined, undefined] };
    }

    const first = dashes[0];
    const hasFirst = isValidDashArray(first);
    const a = hasFirst ? first[0] : undefined;
    const b = hasFirst ? first[1] : undefined;

    const same = dashes.every(
        (d) => isValidDashArray(d) && d[0] === a && d[1] === b,
    );

    return {
        mixed: !same,
        value: [a, b],
    };
}

export const DashBlock = ({ ids }) => {
    const store = useNodeStore.getState();
    const idsKey = ids.join("|");

    const allDashEnabled = useNodesByIds(ids, "dashEnabled");
    let dashEnabledSame = sameCheck(allDashEnabled);

    switch (dashEnabledSame) {
        case true:
            dashEnabledSame = "dashed";
            break;
        case false:
            dashEnabledSame = "solid";
            break;
        default:
            dashEnabledSame = "mixed";
            break;
    }

    const dashes = useEffectiveParamsByIds(ids, "dash");
    const { mixed: dashMixed, value: dashBase } = resolveDash(dashes);

    const dashUi0 = dashMixed ? null : normalizeDashPart(dashBase[0], 0);
    const dashUi1 = dashMixed ? null : normalizeDashPart(dashBase[1], 0);

    const beginInteractive = () => {
        const int = useInteractiveStore.getState();
        int.begin();
    };
    const cancelInteractive = () => {
        const int = useInteractiveStore.getState();
        if (int.active) int.cancel();
    };

    const handleTypeChange = (e) => {
        cancelInteractive();
        const value = e.value[0];

        if (value !== "solid" && value !== "dashed") return;
        const nextEnabled = value === "dashed";

        const patch = {};
        ids.forEach((id, idx) => {
            const p = { dashEnabled: nextEnabled };

            if (nextEnabled) {
                const d = dashes[idx];
                if (!isValidDashArray(d)) {
                    p.dash = [4, 4];
                }
            }

            patch[id] = p;
        });

        store.updateNodes(patch);
    };

    const buildDashPatch = (index, rawNumber) => {
        const val = Number.isNaN(rawNumber) ? 0 : rawNumber;
        const target = Math.max(val, 0);

        const base0 = dashMixed ? 4 : normalizeDashPart(dashBase[0], 4);
        const base1 = dashMixed ? 4 : normalizeDashPart(dashBase[1], 4);

        const next = [base0, base1];
        next[index] = target;

        const patch = {};
        ids.forEach((id) => {
            patch[id] = { dash: next };
        });

        return patch;
    };

    return (
        <>
            <Field.Root>
                <Field.Label>{LOCALE.dash}</Field.Label>
                <Select.Root
                    size={"xs"}
                    collection={lineTypes}
                    value={[dashEnabledSame]}
                    onValueChange={handleTypeChange}
                    lazyMount
                    unmountOnExit
                >
                    <Select.HiddenSelect />
                    <Select.Control>
                        <Select.Trigger>
                            <Select.ValueText />
                        </Select.Trigger>
                        <Select.IndicatorGroup>
                            <Select.Indicator />
                        </Select.IndicatorGroup>
                    </Select.Control>
                    <Portal>
                        <Select.Positioner>
                            <Select.Content>
                                {lineTypes.items.map((item) => (
                                    <Select.Item key={item.value} item={item}>
                                        {item.label}
                                        <Select.ItemIndicator />
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Positioner>
                    </Portal>
                </Select.Root>
            </Field.Root>
            {dashEnabledSame === "dashed" && (
                <Group>
                    <Field.Root>
                        <Field.Label>{LOCALE.dash}</Field.Label>
                        <CommittedNumberInput
                            key={`dash:${idsKey}:a`}
                            uiValue={dashUi0}
                            label={"D"}
                            placeholder={LOCALE.mixed}
                            step={1}
                            min={0}
                            onScrubStart={beginInteractive}
                            onScrub={(n) => {
                                const patch = buildDashPatch(0, n);
                                applyPatch(patch, false);
                            }}
                            onCommit={(n) => {
                                const patch = buildDashPatch(0, n);
                                applyPatch(patch, true);
                            }}
                        />
                    </Field.Root>
                    <Field.Root>
                        <Field.Label>{LOCALE.gap}</Field.Label>
                        <CommittedNumberInput
                            key={`dash:${idsKey}:b`}
                            uiValue={dashUi1}
                            label={"G"}
                            placeholder={LOCALE.mixed}
                            step={1}
                            min={0}
                            onScrubStart={beginInteractive}
                            onScrub={(n) => {
                                const patch = buildDashPatch(1, n);
                                applyPatch(patch, false);
                            }}
                            onCommit={(n) => {
                                const patch = buildDashPatch(1, n);
                                applyPatch(patch, true);
                            }}
                        />
                    </Field.Root>
                </Group>
            )}
        </>
    );
};
