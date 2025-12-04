import {
    Fieldset,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuProportions } from "react-icons/lu";
import { isLineLikeType, round4 } from "../utils";
import { patchNodesThrottled } from "./utils";

function collectSelectionDimensions(nodeRef, selectedIds) {
    let width;
    let height;

    const same = (prev, next) => {
        if (prev === undefined) return next;
        return Math.abs(prev - next) < 0.5 ? prev : NaN;
    };

    selectedIds.forEach((id) => {
        const node = nodeRef.current.get(id);
        if (!node) return;
        const type = node.attrs.type;
        let w;
        let h;

        if (isLineLikeType(type)) {
            const rect = node.getSelfRect();
            w = rect.width;
            h = rect.height;
        } else {
            w = node.width();
            h = node.height();
        }

        width = width === undefined ? w : same(width, w);
        height = height === undefined ? h : same(height, h);
    });

    return {
        width: width === undefined || Number.isNaN(width) ? "" : width,
        height: height === undefined || Number.isNaN(height) ? "" : height,
    };
}

function resizeLineLike(node, targetWidth, targetHeight) {
    const rect = node.getSelfRect();
    const curWidth = rect.width || 1;
    const curHeight = rect.height || 1;

    const sx = targetWidth / curWidth;
    const sy = targetHeight / curHeight;

    const oldPoints = node.points();
    const newPoints = [];

    for (let i = 0; i < oldPoints.length; i += 2) {
        const px = oldPoints[i];
        const py = oldPoints[i + 1];

        const relX = px - rect.x;
        const relY = py - rect.y;

        const scaleX = round4(rect.x + relX * sx);
        const scaleY = round4(rect.y + relY * sy);

        newPoints.push(scaleX, scaleY);
    }

    node.points(newPoints);
    return newPoints;
}

export const DimensionsBlock = ({ node, nodesRef, selectedIds }) => {
    const type = node.attrs.type;
    const isLineLike = isLineLikeType(type);
    const isMultiple = selectedIds.length > 1;

    console.log({
        pos: node.position(),
        apos: node.absolutePosition(),
        size: node.size(),
        gcr: node.getClientRect(),
        gcrst: node.getClientRect({ skipTransform: true }),
        gcrssh: node.getClientRect({ skipShadow: true }),
        gcrsst: node.getClientRect({ skipStroke: true }),
        gcrrt: node.getClientRect({ relativeTo: node.parent }),
        gcrrtsshsst: node.getClientRect({
            relativeTo: node.parent,
            skipShadow: true,
            skipStroke: true,
        }),
        gsr: node?.getSelfRect?.(),
    });

    const initialDim = useMemo(() => {
        if (isMultiple) {
            return collectSelectionDimensions(nodesRef, selectedIds);
        }
        const size = node.size();
        return { width: size.width, height: size.height };
    }, [isMultiple, node, nodesRef, selectedIds]);

    const [dim, setDim] = useState(initialDim);
    const [aspectRatio, setAspectRatio] = useState(false);

    const handleChangeDim = (value, type) => {
        const val = Number.isNaN(value) ? 0 : value;
        const ids = selectedIds.length ? selectedIds : [node.id()];

        const patchesById = {};

        ids.forEach((id) => {
            const n = nodesRef.current.get(id);
            if (!n) return;
            const t = n.attrs.type;
            const isLineLike = isLineLikeType(t);

            if (isLineLike) {
                const rect = n.getSelfRect();
                const curWidth = rect.width || 1;
                const curHeight = rect.height || 1;

                let targetWidth = curWidth;
                let targetHeight = curHeight;

                if (aspectRatio) {
                    if (type === "width") {
                        const scale = val / curWidth;
                        targetWidth = val;
                        targetHeight = curHeight * scale;
                    } else {
                        const scale = val / curHeight;
                        targetWidth = curWidth * scale;
                        targetHeight = val;
                    }
                } else {
                    if (type === "width") targetWidth = val;
                    if (type === "height") targetHeight = val;
                }

                const newPoints = resizeLineLike(
                    n,
                    Math.max(targetWidth, 0),
                    Math.max(targetHeight, 0)
                );

                patchesById[id] = {
                    points: newPoints,
                    width: targetWidth,
                    height: targetHeight,
                };
            } else {
                if (aspectRatio) {
                    const target = Math.max(val, 0);
                    n.width(target);
                    n.height(target);

                    patchesById[id] = {
                        width: target,
                        height: target,
                    };
                } else {
                    const target = Math.max(val, 0);
                    n[type](target);

                    patchesById[id] = {
                        [type]: target,
                    };
                }
            }
        });

        setDim((prev) => {
            if (aspectRatio) {
                if (isLineLike || isMultiple) {
                    return {
                        ...prev,
                        [type]: val,
                    };
                }
                return { width: val, height: val };
            } else {
                return {
                    ...prev,
                    [type]: val,
                };
            }
        });

        patchNodesThrottled(ids, patchesById);
    };

    const toggleAspectRatio = () => {
        setAspectRatio((prev) => !prev);
    };

    return (
        <Fieldset.Root>
            <Fieldset.Legend>Dimensions</Fieldset.Legend>
            <Fieldset.Content mt={1}>
                <Group>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        value={dim.width}
                        onValueChange={(e) =>
                            handleChangeDim(e.valueAsNumber, "width")
                        }
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>W</NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
                    <NumberInput.Root
                        size={"xs"}
                        min={0}
                        value={dim.height}
                        onValueChange={(e) =>
                            handleChangeDim(e.valueAsNumber, "height")
                        }
                    >
                        <NumberInput.Control />
                        <InputGroup
                            startElementProps={{
                                pointerEvents: "auto",
                            }}
                            startElement={
                                <NumberInput.Scrubber>H</NumberInput.Scrubber>
                            }
                        >
                            <NumberInput.Input />
                        </InputGroup>
                    </NumberInput.Root>
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
