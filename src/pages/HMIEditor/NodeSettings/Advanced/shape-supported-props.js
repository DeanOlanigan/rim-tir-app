export const SHAPE_SUPPORTED_PROPS = {
    rect: ["opacity", "fill", "stroke", "cornerRadius"],
    circle: ["opacity", "fill", "stroke"],
    ellipse: ["opacity", "fill", "stroke"],
    line: ["opacity", "stroke"],
    arrow: ["opacity", "stroke"],
    text: ["opacity", "fill", "stroke", "text"],
    group: ["opacity"],
};

export const getCommonSupportedProps = (types) => {
    if (!types || types.length === 0) return [];

    // Берем свойства первого типа как базу
    let common = SHAPE_SUPPORTED_PROPS[types[0]] || [];

    // Оставляем только те, которые есть у всех остальных типов
    for (let i = 1; i < types.length; i++) {
        const props = SHAPE_SUPPORTED_PROPS[types[i]] || [];
        common = common.filter((p) => props.includes(p));
    }

    return common;
};
