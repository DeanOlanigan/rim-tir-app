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
import { useNodeStore } from "./../store/node-store";
import { ACTIONS, SHAPES } from "../constants";
import { dragBound } from "./utils/dragBound";
import { round4 } from "../utils";

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
        const nodeId = e.target.attrs?.id;
        if (!nodeId) return;
        useNodeStore.getState().updateNode(nodeId, {
            x: round4(e.target.x()),
            y: round4(e.target.y()),
        });
    },
    onDragEnd(e) {
        const nodeId = e.target.attrs?.id;
        if (!nodeId) return;
        useNodeStore.getState().updateNode(nodeId, {
            x: round4(e.target.x()),
            y: round4(e.target.y()),
        });
    },
};

export const Nodes = ({ nodesRef }) => {
    const currentAction = useActionsStore((state) => state.currentAction);
    const rootIds = useNodeStore((state) => state.rootIds);
    return (
        <NodeWrapper
            ids={rootIds}
            nodesRef={nodesRef}
            draggable={currentAction === ACTIONS.select}
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
        case SHAPES.ellipse:
            return <Ellipse key={id} {...params} ref={registerRef} />;
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
