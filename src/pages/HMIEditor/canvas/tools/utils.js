import { snap } from "../utils/geom";

export const snapPointToGrid = (p, gridSize, snapToGrid) => {
    const step = snapToGrid ? gridSize : 1;
    return {
        x: snap(p.x, step, 0),
        y: snap(p.y, step, 0),
    };
};

export const BASE_PARAMS = {
    fill: "#c3c3c3",
    stroke: "#000000",
    strokeWidth: 0,
    fillAfterStrokeEnabled: true,
    shadowForStrokeEnabled: false,
    lineJoin: "miter",
    lineCap: "butt",
    dashEnabled: false,
    opacity: 1,
};
