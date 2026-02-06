// src/pages/HMIEditor/store/utils/layers/reorderRootIds.js
import { LAYERS_OPS } from "@/pages/HMIEditor/constants";

/**
 * @param {string[]} rootIds - текущее упорядочение rootIds страницы
 * @param {string[]|string} moveIds - id(ы) которые надо переместить (сохраняется их относительный порядок)
 * @param {"moveToTop"|"moveUp"|"moveDown"|"moveToBottom"} dir
 * @returns {string[]} новый массив rootIds (не мутирует входные)
 */
export function reorderRootIds(rootIds, moveIds, dir) {
    const ids = Array.isArray(moveIds) ? moveIds : [moveIds];

    // Создаем Map для быстрого поиска индексов
    const rootIndex = new Map(rootIds.map((id, i) => [id, i]));

    // Фильтруем и сортируем перемещаемые ID в том порядке, в котором они идут в оригинале
    const orderedIds = ids
        .filter((id) => rootIndex.has(id))
        .sort((a, b) => rootIndex.get(a) - rootIndex.get(b));
    if (orderedIds.length === 0) return rootIds.slice();

    // Остальные элементы (неподвижные)
    const rest = rootIds.filter((id) => !orderedIds.includes(id));

    switch (dir) {
        case LAYERS_OPS.moveToTop:
            return [...rest, ...orderedIds];

        case LAYERS_OPS.moveToBottom:
            return [...orderedIds, ...rest];

        case LAYERS_OPS.moveUp: {
            // Двигаем ВПРАВО (к концу массива)
            // Берем индекс последнего перемещаемого элемента
            const lastMovedId = orderedIds[orderedIds.length - 1];
            const lastOrigIndex = rootIndex.get(lastMovedId);

            // Ищем элемент, который стоял сразу ПОСЛЕ нашей группы в оригинальном массиве
            const afterId = rootIds[lastOrigIndex + 1];

            // Если после нас ничего не было, мы уже в топе
            if (!afterId) {
                return [...rest, ...orderedIds];
            }

            // Находим позицию соседа в массиве rest
            const neighborIndexInRest = rest.indexOf(afterId);

            // ВАЖНО: Если neighborIndexInRest === -1, значит сосед тоже перемещается (входит в moveIds),
            // но логика фильтрации orderedIds это исключает, если мы берем lastOrigIndex.
            // Однако, если мы двигаем группу, "сосед" может быть частью группы.
            // Поэтому надежнее искать ближайшего соседа справа, который есть в rest,
            // но для простых сдвигов достаточно проверить:

            if (neighborIndexInRest === -1) {
                // Если сосед не найден в rest (странная ситуация при корректных данных), кидаем в конец
                return [...rest, ...orderedIds];
            }

            const newRest = rest.slice();
            newRest.splice(neighborIndexInRest + 1, 0, ...orderedIds);

            return newRest;
        }

        case LAYERS_OPS.moveDown: {
            // Двигаем ВЛЕВО (к началу массива)
            const firstMovedId = orderedIds[0];
            const firstOrigIndex = rootIndex.get(firstMovedId);

            // Если мы уже в начале (индекс 0), двигать некуда
            if (firstOrigIndex === 0) {
                return [...orderedIds, ...rest];
            }

            // Ищем элемент, который стоял ПЕРЕД нашей группой
            const beforeId = rootIds[firstOrigIndex - 1];
            const neighborIndexInRest = rest.indexOf(beforeId);

            const newRest = rest.slice();

            // Вставляем ПЕРЕД соседом (на его место, сдвигая его вправо)
            // Если соседа нет в rest (индекс -1), вставляем в начало (0)
            const insertIndex =
                neighborIndexInRest === -1 ? 0 : neighborIndexInRest;
            newRest.splice(insertIndex, 0, ...orderedIds);
            return newRest;
        }

        default:
            return rootIds.slice();
    }
}
