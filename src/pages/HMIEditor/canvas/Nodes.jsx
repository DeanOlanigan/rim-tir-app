import { Arrow, Ellipse, Group, Line, Rect } from "react-konva";
import { useActionsStore } from "./../store/actions-store";
import { useNodeStore } from "./../store/node-store";
import { ACTIONS } from "../constants";
import { dragBound } from "./utils/dragBound";

const common = {
    name: "node",
    dragBoundFunc(pos) {
        console.log({ this: this });
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
    const nodes = useNodeStore((state) => state.nodes);

    return (
        <NodeWrapper
            nodes={nodes}
            nodesRef={nodesRef}
            draggable={currentAction === ACTIONS.select}
        />
    );
};

const NodeWrapper = ({ nodes, draggable, nodesRef }) => {
    return nodes.map((node) => (
        <NodeInstance
            key={node.id}
            id={node.id}
            node={node}
            draggable={draggable}
            nodesRef={nodesRef}
        />
    ));
};

const NodeInstance = ({ id, node, draggable, nodesRef }) => {
    const registerRef = (el) => {
        if (el) {
            nodesRef.current.set(id, el);
        } else {
            nodesRef.current.delete(id);
        }
    };

    switch (node.type) {
        case "rect":
            return (
                <Rect key={node.id} {...node} {...common} ref={registerRef} />
            );
        case "ellipse":
            return (
                <Ellipse
                    key={node.id}
                    {...node}
                    {...common}
                    draggable={draggable}
                    ref={registerRef}
                />
            );
        case "line":
            return (
                <Line
                    key={node.id}
                    {...node}
                    {...common}
                    draggable={draggable}
                    ref={registerRef}
                    hitStrokeWidth={node.strokeWidth + 3 || 3}
                />
            );
        case "arrow":
            return (
                <Arrow
                    key={node.id}
                    {...node}
                    {...common}
                    draggable={draggable}
                    ref={registerRef}
                />
            );
        case "group":
            return (
                <Group
                    key={node.id}
                    {...node}
                    {...common}
                    x={0}
                    y={0}
                    draggable={draggable}
                    ref={registerRef}
                >
                    <NodeWrapper
                        nodes={node.children}
                        nodesRef={nodesRef}
                        draggable={false}
                    />
                </Group>
            );
    }
};
