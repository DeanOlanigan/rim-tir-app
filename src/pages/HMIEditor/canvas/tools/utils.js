import { snap } from "../utils/geom";

export const snapPointToGrid = (p, gridSize, snapToGrid) => {
    const step = snapToGrid ? gridSize : 1;
    return {
        x: snap(p.x, step, 0),
        y: snap(p.y, step, 0),
    };
};
