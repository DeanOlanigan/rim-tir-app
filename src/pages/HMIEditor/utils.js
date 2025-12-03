import { SHAPES } from "./constants";

export function round4(x) {
    return Math.round(x * 1e4) / 1e4;
}

export function isLineLikeType(type) {
    return type === SHAPES.arrow || type === SHAPES.line;
}
