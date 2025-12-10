// AI here we go
export function collapseBreadcrumbs(items, maxLength, focusIndex, edgeCount) {
    const n = items.length;
    if (maxLength == null || n <= maxLength) return items.slice();

    // Нормализация параметров
    const focus = Math.max(0, Math.min(focusIndex ?? n - 1, n - 1));
    const edges = Math.max(
        1,
        Math.min(edgeCount ?? 1, Math.floor(maxLength / 3)),
    );

    // Базовый скелет: всегда держим левый/правый «край»
    const rightEdgeStart = n - edges; // индекс первого справа, включительно

    // Сколько позиций остаётся на «окно» вокруг фокуса
    // (минус потенциальные два эллипсиса)
    const reservedForEdges = edges + edges; // количество элементов, занятое краями
    const reservedForEllipses = 2; // максимум, по одному с каждой стороны
    const availableForWindow = Math.max(
        0,
        maxLength - reservedForEdges - reservedForEllipses,
    );

    if (availableForWindow <= 0) {
        // Слишком маленький лимит: показываем только края + один эллипсис между ними
        return [
            ...items.slice(0, edges),
            "ellipsis",
            ...items.slice(n - edges),
        ];
    }

    // Распределяем «окно» вокруг focus
    const half = Math.floor(availableForWindow / 2);
    let windowStart = Math.max(edges, focus - half);
    let windowEnd = Math.min(
        rightEdgeStart - 1,
        windowStart + availableForWindow - 1,
    );

    // Если упёрлись справа — подвинем окно влево; если слева — вправо
    const windowLen = windowEnd - windowStart + 1;
    if (windowLen < availableForWindow) {
        const deficit = availableForWindow - windowLen;
        if (windowStart > edges) {
            windowStart = Math.max(edges, windowStart - deficit);
        } else if (windowEnd < rightEdgeStart - 1) {
            windowEnd = Math.min(rightEdgeStart - 1, windowEnd + deficit);
        }
    }

    const result = [];

    // Левая кромка
    result.push(...items.slice(0, edges));

    // Эллипсис слева от окна — только если есть разрыв
    if (windowStart > edges) result.push("ellipsis");

    // Окно вокруг фокуса
    result.push(...items.slice(windowStart, windowEnd + 1));

    // Эллипсис справа от окна — только если есть разрыв
    if (windowEnd < rightEdgeStart - 1) result.push("ellipsis");

    // Правая кромка
    result.push(...items.slice(rightEdgeStart));

    // На всякий случай: если по издержкам получилось чуть длиннее лимита,
    // отрежем из «окна» середину.
    if (result.length > maxLength) {
        // Найдём индексы окна в result
        const leftCut = result.indexOf("ellipsis") + 1;
        const rightCut = result.lastIndexOf("ellipsis") - 1;
        const over = result.length - maxLength;
        if (leftCut > 0 && rightCut > leftCut && over > 0) {
            const midStart =
                leftCut + Math.floor((rightCut - leftCut + 1 - over) / 2);
            result.splice(midStart, over);
        }
    }

    return result;
}
