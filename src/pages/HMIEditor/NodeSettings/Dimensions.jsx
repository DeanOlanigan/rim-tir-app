import {
    Fieldset,
    Group,
    IconButton,
    InputGroup,
    NumberInput,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { patchNodeThrottled } from "./utils";
import { LuProportions } from "react-icons/lu";
import { isLineLikeType, round4 } from "../utils";

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

export const DimensionsBlock = ({ node, nodesRef, selectedIds }) => {
    const type = node.attrs.type;
    const isLineLike = isLineLikeType(type);
    const isMultiple = selectedIds.length > 1;

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

        if (isLineLike) {
            const rect = node.getSelfRect();
            const curWidth = rect.width || 1;
            const curHeight = rect.height || 1;

            let sx, sy;

            if (aspectRatio) {
                sx = sy = type === "width" ? val / curWidth : val / curHeight;
            } else {
                sx = type === "width" ? val / curWidth : 1;
                sy = type === "height" ? val / curHeight : 1;
            }

            const oldPoints = node.points();
            const newPoints = [];

            for (let i = 0; i < oldPoints.length; i += 2) {
                const px = oldPoints[i];
                const py = oldPoints[i + 1];
                const relX = px - rect.x;
                const relY = py - rect.y;

                const scaledX = round4(rect.x + relX * sx);
                const scaledY = round4(rect.y + relY * sy);

                newPoints.push(scaledX, scaledY);
            }

            node.points(newPoints);
            setDim((prev) => ({ ...prev, [type]: val }));
            patchNodeThrottled(node.id(), { points: newPoints });
        } else {
            if (aspectRatio) {
                node.width(val);
                node.height(val);
                setDim((prev) => ({ ...prev, width: val, height: val }));
                patchNodeThrottled(node.id(), { width: val, height: val });
            } else {
                node[type](val);
                setDim((prev) => ({ ...prev, [type]: val }));
                patchNodeThrottled(node.id(), { [type]: val });
            }
        }
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
