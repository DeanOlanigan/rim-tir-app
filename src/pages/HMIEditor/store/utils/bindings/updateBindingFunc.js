import { nanoid } from "nanoid";
import { removeNodeFromIndex } from "./removeNodeFromIndex";
import { addNodeToIndex } from "./addNodeToindex";

export function updateBindingFunc(newNodes, newIndex, id, property, changes) {
    const node = newNodes[id];
    if (!node || !node.bindings) return;

    removeNodeFromIndex(newIndex, id);

    const newItems = [...node.bindings.items];
    // Пытаемся найти биндинг с таким же property, а не id!
    // Т.к. у разных нод id биндингов могут отличаться (или быть одинаковыми, как решишь),
    // но логичнее искать по свойству (property: 'fill').

    // ВАЖНО: Мы ищем биндинг по свойству, которое мы редактируем
    // (changes должно содержать property, либо bindingId должен быть ключом свойства)

    const index = newItems.findIndex((b) => b.property === property);

    if (index !== -1) {
        // Обновляем существующий
        newItems[index] = {
            ...newItems[index],
            ...changes,
        };
    } else {
        // Если у второго элемента не было такого биндинга - создаем
        // (но тут нужно быть аккуратным с id)
        newItems.push({
            id: nanoid(12),
            property,
            enabled: true,
            useGlobal: true,
            mode: "map",
            rules: [],
            ...changes,
        });
    }

    newNodes[id] = {
        ...node,
        bindings: { ...node.bindings, items: newItems },
    };

    addNodeToIndex(newIndex, newNodes[id]);
}
