const shapeRegistry = {};

export function registerShape(type, impl) {
    shapeRegistry[type] = impl;
}

export function getShape(type) {
    return shapeRegistry[type] || null;
}
