import { toAbs, toWorld } from "./coords";
import { snap } from "./geom";

export function dragBound(pos, stage, gridSize, snapToGrid) {
    const step = snapToGrid ? gridSize : 1;
    const local = toWorld(stage, pos);
    const res = {
        x: snap(local.x, step, 0),
        y: snap(local.y, step, 0),
    };
    return toAbs(stage, res);
}
