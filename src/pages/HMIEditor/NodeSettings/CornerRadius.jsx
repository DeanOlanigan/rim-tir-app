import {
    Fieldset,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
    SimpleGrid,
    Slider,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import {
    RxCornerBottomLeft,
    RxCornerBottomRight,
    RxCornerTopLeft,
    RxCornerTopRight,
} from "react-icons/rx";
import { LuMaximize } from "react-icons/lu";
import { patchNodeThrottled } from "./utils";

const CORNER_ICONS = [
    RxCornerTopLeft,
    RxCornerTopRight,
    RxCornerBottomLeft,
    RxCornerBottomRight,
];

function fromNodeCornerRadius(node) {
    const cr = node.cornerRadius();
    if (Array.isArray(cr)) {
        const [tl = 0, tr = 0, br = 0, bl = 0] = cr;
        return [tl, tr, bl, br];
    }
    const v = typeof cr === "number" && Number.isFinite(cr) ? cr : 0;
    return [v, v, v, v];
}

function toNodeCornerRadius([tl, tr, bl, br]) {
    return [tl, tr, br, bl];
}

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

export const CornerRadiusBlock = ({ node }) => {
    const initialCorners = useMemo(() => fromNodeCornerRadius(node), [node]);
    const [corners, setCorners] = useState(initialCorners);
    const [showMixed, setShowMixed] = useState(!areAllEqual(initialCorners));

    const syncNode = (nextCorners) => {
        node.cornerRadius(toNodeCornerRadius(nextCorners));
    };

    const handleUniformChange = (raw) => {
        const v = normalizeNumber(raw);
        const next = [v, v, v, v];
        setCorners(next);
        syncNode(next);
        patchNodeThrottled(node.id(), { cornerRadius: next });
    };

    const handleMixedChange = (index, raw) => {
        const v = normalizeNumber(raw);
        const next = [...corners];
        next[index] = v;
        setCorners(next);
        syncNode(next);
        patchNodeThrottled(node.id(), { cornerRadius: next });
    };

    const toggleMixed = () => {
        setShowMixed((prev) => {
            const next = !prev;
            if (!next) {
                setCorners((prev) => {
                    const v = normalizeNumber(prev[0] ?? 0);
                    const collapsed = [v, v, v, v];
                    syncNode(collapsed);
                    return collapsed;
                });
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
                        value={areAllEqual(corners) ? corners[0] ?? 0 : ""}
                        onValueChange={(e) =>
                            handleUniformChange(e.valueAsNumber)
                        }
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
                        value={[areAllEqual(corners) ? corners[0] ?? 0 : 0]}
                        onValueChange={(e) => handleUniformChange(e.value[0])}
                    >
                        <Slider.Control>
                            <Slider.Track>
                                <Slider.Range />
                            </Slider.Track>
                            <Slider.Thumbs />
                        </Slider.Control>
                    </Slider.Root>
                    <IconButton
                        size={"xs"}
                        variant={showMixed ? "solid" : "outline"}
                        onClick={toggleMixed}
                    >
                        <LuMaximize />
                    </IconButton>
                </Group>
                {showMixed && (
                    <SimpleGrid columns={2} gap={2}>
                        {corners.map((value, index) => {
                            const Icon = CORNER_ICONS[index];
                            return (
                                <NumberInput.Root
                                    key={index}
                                    size={"xs"}
                                    min={0}
                                    max={100}
                                    value={value}
                                    onValueChange={(e) =>
                                        handleMixedChange(
                                            index,
                                            e.valueAsNumber
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
                                        <NumberInput.Input />
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
