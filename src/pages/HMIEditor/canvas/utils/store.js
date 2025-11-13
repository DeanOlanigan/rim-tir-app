export const updateStoreNode = (node, updateNode) => {
    const data = {
        type: node.attrs.type,
        id: node.attrs.id,
        x: Math.round(node.attrs.x),
        y: Math.round(node.attrs.y),
        fill: node.attrs.fill,
        stroke: node.attrs.stroke,
        strokeWidth: node.attrs.strokeWidth,
        fillAfterStrokeEnabled: node.attrs.fillAfterStrokeEnabled,
        cornerRadius: node.attrs.cornerRadius,
    };
    if (node.attrs.type === "rect") {
        data.width = Math.round(node.attrs.width);
        data.height = Math.round(node.attrs.height);
    }
    if (node.attrs.type === "ellipse") {
        data.radiusX = node.attrs.radiusX;
        data.radiusY = node.attrs.radiusY;
    }
    updateNode(node.attrs.id, data);
};
