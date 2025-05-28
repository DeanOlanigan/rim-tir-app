export function getNodeFactory(typeVisualMap) {
    return function getNodeVisual(node) {
        return typeVisualMap[node.data.type] || typeVisualMap.default;
    };
}
