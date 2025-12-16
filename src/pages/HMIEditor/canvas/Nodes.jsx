import {
    Arrow,
    Ellipse,
    Group,
    Line,
    Rect,
    RegularPolygon,
    Text,
} from "react-konva";
import { useActionsStore } from "./../store/actions-store";
import { patchStoreRaf, useNodeStore } from "./../store/node-store";
import { ACTIONS, SHAPES } from "../constants";
import { dragBound } from "./utils/dragBound";
import { isHasRadius, round4 } from "../utils";

function ellipseToKonva(p) {
    const cx = p.x + p.width / 2;
    const cy = p.y + p.height / 2;
    return {
        x: cx,
        y: cy,
        radiusX: p.width / 2,
        radiusY: p.height / 2,
        rotation: p.rotation ?? 0,
    };
}

function move(node) {
    const type = node.attrs.type;
    let x, y;
    if (isHasRadius(type)) {
        const rx = Math.abs(node.radiusX() * node.scaleX());
        const ry = Math.abs(node.radiusY() * node.scaleY());

        const width = rx * 2;
        const height = ry * 2;

        x = round4(node.x() - width / 2);
        y = round4(node.y() - height / 2);
    } else {
        x = round4(node.x());
        y = round4(node.y());
    }

    return { x, y };
}

const common = {
    name: "node",
    dragBoundFunc(pos) {
        const { gridSize, snapToGrid } = useActionsStore.getState();
        const stage = this.getStage();
        const absRect = this.getClientRect({
            skipShadow: true,
            skipStroke: true,
        });
        const curAbsPos = this.getAbsolutePosition();

        const absTlCurrent = {
            x: absRect.x,
            y: absRect.y,
        };
        const deltaPos = {
            x: pos.x - curAbsPos.x,
            y: pos.y - curAbsPos.y,
        };
        const absTlProposed = {
            x: absTlCurrent.x + deltaPos.x,
            y: absTlCurrent.y + deltaPos.y,
        };

        const abs = dragBound(absTlProposed, stage, gridSize, snapToGrid);

        const delta = {
            x: abs.x - absTlProposed.x,
            y: abs.y - absTlProposed.y,
        };

        return {
            x: pos.x + delta.x,
            y: pos.y + delta.y,
        };
    },
    onDragMove(e) {
        const node = e.target;
        const id = node.id();
        if (!id) return;
        const patch = {};
        patch[id] = move(node);
        patchStoreRaf([id], patch);
    },
    onDragEnd(e) {
        const node = e.target;
        const id = node.id();
        if (!id) return;
        useNodeStore.getState().updateNode(id, move(node));
    },
};

export const Nodes = ({ nodesRef, viewOnlyMode }) => {
    const currentAction = useActionsStore((state) => state.currentAction);
    const rootIds = useNodeStore((state) => state.rootIds);
    return (
        <NodeWrapper
            ids={rootIds}
            nodesRef={nodesRef}
            draggable={currentAction === ACTIONS.select && !viewOnlyMode}
        />
    );
};

const NodeWrapper = ({ ids, draggable, nodesRef }) => {
    return ids.map((id) => (
        <NodeInstance
            key={id}
            id={id}
            draggable={draggable}
            nodesRef={nodesRef}
        />
    ));
};

const NodeInstance = ({ id, draggable, nodesRef }) => {
    const node = useNodeStore((state) => state.nodes[id]);
    if (!node) return null;

    const registerRef = (el) => {
        if (el) nodesRef.current.set(id, el);
        else nodesRef.current.delete(id);
    };

    const params = {
        ...node,
        ...common,
        draggable,
    };

    switch (node.type) {
        case SHAPES.rect:
            return <Rect key={id} {...params} ref={registerRef} />;
        case SHAPES.polygon:
            return <RegularPolygon key={id} {...params} ref={registerRef} />;
        case SHAPES.ellipse: {
            const k = ellipseToKonva(node);
            return (
                <Ellipse
                    key={id}
                    {...params}
                    x={k.x}
                    y={k.y}
                    radiusX={k.radiusX}
                    radiusY={k.radiusY}
                    rotation={k.rotation}
                    ref={registerRef}
                />
            );
        }
        case SHAPES.text:
            return <Text key={id} {...params} ref={registerRef} />;
        case SHAPES.line:
            return (
                <Line
                    key={id}
                    {...params}
                    ref={registerRef}
                    hitStrokeWidth={node.strokeWidth + 3 || 3}
                />
            );
        case SHAPES.arrow:
            return (
                <Arrow
                    key={id}
                    {...params}
                    ref={registerRef}
                    hitStrokeWidth={node.strokeWidth + 3 || 3}
                />
            );
        case SHAPES.group:
            return (
                <Group key={id} {...params} ref={registerRef}>
                    <NodeWrapper
                        ids={node.childrenIds}
                        nodesRef={nodesRef}
                        draggable={false}
                    />
                </Group>
            );
        default:
            return null;
    }
};
