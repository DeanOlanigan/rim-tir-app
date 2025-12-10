import {
    Fieldset,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
} from "@chakra-ui/react";
import { useState } from "react";
import { LuProportions } from "react-icons/lu";
import { isLineLikeType, round4 } from "../utils";
import { useNodeStore } from "../store/node-store";
import { useShallow } from "zustand/shallow";

function collectSelectionDimensions(nodeRef, nodes) {
    let width;
    let height;

    const same = (prev, next) => {
        if (prev === undefined) return next;
        return Math.abs(prev - next) < 0.5 ? prev : NaN;
    };

    nodes.forEach((node) => {
        const type = node.type;
        let w;
        let h;

        if (isLineLikeType(type)) {
            const refNode = nodeRef.current.get(node.id);
            const rect = refNode.getSelfRect();
            w = rect.width;
            h = rect.height;
        } else {
            w = node.width;
            h = node.height;
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

function changeLineDim(nodesRef, type, id, aspectRatio, val) {
    const refNode = nodesRef.current.get(id);
    const rect = refNode.getSelfRect();
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
        refNode,
        Math.max(targetWidth, 0),
        Math.max(targetHeight, 0),
    );

    return {
        points: newPoints,
        width: targetWidth,
        height: targetHeight,
    };
}

export const DimensionsBlock = ({ ids, nodesRef }) => {
    const nodes = useNodeStore(useShallow((s) => ids.map((id) => s.nodes[id])));
    const { width, height } = collectSelectionDimensions(nodesRef, nodes);

    const [aspectRatio, setAspectRatio] = useState(false);

    const handleChangeDim = (value, type) => {
        const val = Number.isNaN(value) ? 0 : value;
        const patch = {};
        nodes.forEach((n) => {
            const id = n.id;
            const t = n.type;
            const isLineLike = isLineLikeType(t);

            if (isLineLike) {
                patch[id] = changeLineDim(nodesRef, type, id, aspectRatio, val);
            } else {
                if (aspectRatio) {
                    const target = Math.max(val, 0);
                    patch[id] = {
                        width: target,
                        height: target,
                    };
                } else {
                    const target = Math.max(val, 0);
                    patch[id] = {
                        [type]: target,
                    };
                }
            }
        });

        useNodeStore.getState().updateNodes(ids, patch);
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
                        value={width}
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
                        value={height}
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
