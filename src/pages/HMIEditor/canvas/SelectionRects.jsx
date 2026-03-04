import { Rect } from "react-konva";
import { useEffectiveNode } from "../store/interactive-store";
import { useNodeStore } from "../store/node-store";
import { getNodeParentLocalAABB } from "../store/utils/geometry";

export const SelectionRects = () => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    if (selectedIds.length < 2) return null;
    return selectedIds.map((id) => <SelectionRect key={id} id={id} />);
};

const SelectionRect = ({ id }) => {
    const node = useEffectiveNode(id);
    const aabb = getNodeParentLocalAABB(node);
    return (
        <Rect
            x={aabb.x}
            y={aabb.y}
            width={aabb.width}
            height={aabb.height}
            stroke="rgb(0, 100, 255)"
            strokeWidth={2}
            strokeScaleEnabled={false}
            listening={false}
        />
    );
};
