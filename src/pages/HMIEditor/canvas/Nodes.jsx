import { Arrow, Ellipse, Group, Line, Rect, RegularPolygon } from "react-konva";
import { useActionsStore } from "./../store/actions-store";
import { useNodeStore } from "./../store/node-store";
import { ACTIONS } from "../constants";
import { dragBound } from "./utils/dragBound";

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
    onDragEnd(e) {
        const nodeId = e.target.attrs?.id;
        if (!nodeId) return;
        useNodeStore.getState().updateNode(nodeId, {
            x: e.target.x(),
            y: e.target.y(),
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
        case "rect":
            return <Rect key={node.id} {...params} ref={registerRef} />;
        case "polygon":
            return (
                <RegularPolygon key={node.id} {...params} ref={registerRef} />
            );
        case "ellipse":
            return <Ellipse key={node.id} {...params} ref={registerRef} />;
        case "line":
            return (
                <Line
                    key={node.id}
                    {...params}
                    ref={registerRef}
                    hitStrokeWidth={node.strokeWidth + 3 || 3}
                />
            );
        case "arrow":
            return <Arrow key={node.id} {...params} ref={registerRef} />;
        case "group":
            return (
                <Group key={node.id} {...params} x={0} y={0} ref={registerRef}>
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
