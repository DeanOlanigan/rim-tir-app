/**
 * Нормализация дерева:
 * - rootIds/childrenIds: чистка/дедуп/удаление несуществующих
 * - parentId: выставляется по структуре (root => null; дети группы => groupId)
 * - (опц) pruneOrphans: удалить ноды, не принадлежащие ни одной странице
 */
// eslint-disable-next-line
export function normalizeProjectTreeOLD(project, opts = {}) {
    const pruneOrphans = opts.pruneOrphans ?? true;

    const baseNodes = project.nodes ?? {};
    const basePages = project.pages ?? {};

    let nodes = { ...baseNodes };
    let pages = { ...basePages };

    // owner: чтобы один nodeId не оказался в двух страницах
    const owner = new Map(); // nodeId -> pageId
    const usedGlobal = new Set();

    // Заранее: гарантируем parentId=null по умолчанию (если где-то undefined)
    for (const id in nodes) {
        const n = nodes[id];
        if (!n) continue;
        if (!("parentId" in n)) nodes[id] = { ...n, parentId: null };
    }

    for (const pageId of Object.keys(pages)) {
        const page = pages[pageId];
        if (!page) continue;

        // 1) чистим rootIds
        let rootIds = dedupeStrings(page.rootIds).filter((id) => nodes[id]);
        // если node уже принадлежит другой странице — выкидываем из root
        rootIds = rootIds.filter((id) => {
            const prevOwner = owner.get(id);
            if (prevOwner && prevOwner !== pageId) return false;
            owner.set(id, pageId);
            return true;
        });

        const parentOf = new Map(); // childId -> parentId (group)
        const stack = [...rootIds];
        const visited = new Set();

        // 2) DFS по дереву страницы, с чисткой childrenIds у групп
        while (stack.length) {
            const id = stack.pop();
            if (visited.has(id)) continue;
            visited.add(id);
            usedGlobal.add(id);

            const n = nodes[id];
            if (!n) continue;

            // node уже принадлежит другой странице => игнорируем
            const prevOwner = owner.get(id);
            if (prevOwner && prevOwner !== pageId) continue;
            owner.set(id, pageId);

            if (n.type !== SHAPES.group) continue;

            const rawKids = Array.isArray(n.childrenIds) ? n.childrenIds : [];
            const cleanKids = [];
            const seenKids = new Set();

            for (const childId of rawKids) {
                if (typeof childId !== "string") continue;
                if (childId === id) continue; // self-loop
                if (!nodes[childId]) continue; // no such node
                if (seenKids.has(childId)) continue; // dedupe in childrenIds

                // запрет на “двойное родительство” в рамках страницы:
                if (parentOf.has(childId)) continue;

                // запрет на разделение между страницами:
                const prev = owner.get(childId);
                if (prev && prev !== pageId) continue;

                seenKids.add(childId);
                parentOf.set(childId, id);
                owner.set(childId, pageId);

                cleanKids.push(childId);
                stack.push(childId);
            }

            // применяем cleaned childrenIds, если изменились
            const prevKids = n.childrenIds ?? [];
            const same =
                prevKids.length === cleanKids.length &&
                prevKids.every((v, i) => v === cleanKids[i]);

            if (!same) {
                nodes[id] = { ...n, childrenIds: cleanKids };
            }
        }

        // 3) rootIds не должны включать тех, кто стал child
        const childSet = new Set(parentOf.keys());
        const nextRootIds = rootIds.filter((id) => !childSet.has(id));

        // 4) проставляем parentId для всех visited нод страницы
        //    root => null, child => groupId
        for (const id of visited) {
            const n = nodes[id];
            if (!n) continue;

            const desired = parentOf.get(id) ?? null;
            const have = n.parentId ?? null;
            if (have !== desired) {
                nodes[id] = { ...n, parentId: desired };
            }
        }

        // 5) если rootIds изменились — патчим страницу
        const sameRoots =
            (page.rootIds?.length ?? 0) === nextRootIds.length &&
            (page.rootIds ?? []).every((v, i) => v === nextRootIds[i]);

        if (!sameRoots) {
            pages[pageId] = { ...page, rootIds: nextRootIds };
        }
    }

    // 6) удалить “осиротевшие” ноды (не в дереве ни одной страницы)
    if (pruneOrphans) {
        const nextNodes = {};
        for (const id in nodes) {
            if (usedGlobal.has(id)) nextNodes[id] = nodes[id];
        }
        nodes = nextNodes;
    }

    // 7) если activePageId битый — выбрать первую страницу
    let activePageId = project.activePageId;
    if (!activePageId || !pages[activePageId]) {
        const first = Object.keys(pages)[0] ?? null;
        activePageId = first;
    }

    return { ...project, nodes, pages, activePageId };
}

import { SHAPES } from "@/pages/HMIEditor/constants";
import { isGroupType } from "../utils";

/**
 * @typedef {{
 * code: string,
 * message: string,
 * pageId?: string,
 * nodeId?: string,
 * path?: string,
 * }} NormalizeIssue
 */

function dedupeStrings(arr) {
    const set = new Set();
    const out = [];
    for (const x of arr ?? []) {
        if (typeof x === "string" && !set.has(x)) {
            set.add(x);
            out.push(x);
        }
    }
    return out;
}

function makeReporter(opts) {
    const mode = opts?.mode ?? "repair";
    const strict = mode === "strict";
    const onIssue = typeof opts?.onIssue === "function" ? opts.onIssue : null;
    const issues = [];

    const report = (issue) => {
        issues.push(issue);
        onIssue?.(issue);
        if (strict) {
            throw new Error(issue.message);
        }
    };

    return { issues, report };
}

/**
 * Проверяет целостность id и наличие parentId.
 * Мутирует draftNodes.
 */
function sanitizeBaseNodes(draftNodes, report) {
    for (const key in draftNodes) {
        const n = draftNodes[key];
        if (!n) continue;

        let changed = false;
        let nextNode = n;

        // 1. Sanity check: id внутри объекта должен совпадать с ключом
        if (n.id != null && n.id !== key) {
            report({
                code: "NODE_ID_MISMATCH",
                message: `Некорректный проект: nodes["${key}"].id ("${n.id}") != "${key}". ID исправлен.`,
                nodeId: key,
            });
            nextNode = { ...nextNode, id: key };
            changed = true;
        }

        // 2. Гарантируем наличие поля parentId
        if (!("parentId" in nextNode)) {
            nextNode = { ...nextNode, parentId: null };
            changed = true;
        }

        if (changed) {
            draftNodes[key] = nextNode;
        }
    }
}

function getChildrenArray(node) {
    return Array.isArray(node?.childrenIds) ? node.childrenIds : [];
}

/**
 * Возвращает причину удаления ребра или null.
 */
function getDropReason({
    parentId,
    childId,
    draftNodes,
    owner,
    pageId,
    parentOf,
    visiting,
    seenKids,
}) {
    if (typeof childId !== "string") return "NOT_STRING";
    if (childId === parentId) return "SELF_LOOP";
    if (!draftNodes[childId]) return "MISSING_NODE";

    // Дубликат в рамках одного массива childrenIds
    if (seenKids.has(childId)) return "DUP_IN_CHILDREN";

    // Цикл: ссылка на узел, который сейчас в стеке обхода (предок)
    if (visiting.has(childId)) return "CYCLE";

    // У ребенка уже есть родитель (на этой же странице)
    if (parentOf.has(childId)) return "MULTI_PARENT";

    // Узел принадлежит другой странице
    const prevOwner = owner.get(childId);
    if (prevOwner && prevOwner !== pageId) return "CROSS_PAGE";

    return null;
}

/**
 * Очищает childrenIds одной группы.
 * Мутирует draftNodes (если состав детей изменился) и заполняет карты owner/parentOf.
 */
function processGroupChildren({
    groupId,
    groupNode,
    draftNodes,
    owner,
    pageId,
    parentOf,
    visiting,
    report,
}) {
    const hadArray = Array.isArray(groupNode?.childrenIds);
    const rawKids = getChildrenArray(groupNode);
    const cleanKids = [];
    const seenKids = new Set();
    let changed = !hadArray;

    for (const childId of rawKids) {
        const reason = getDropReason({
            parentId: groupId,
            childId,
            draftNodes,
            owner,
            pageId,
            parentOf,
            visiting,
            seenKids,
        });

        if (reason) {
            report({
                code: "DROP_CHILD_EDGE",
                message: `Нормализация: удалена ссылка ${groupId} -> ${String(childId)} (${reason})`,
                pageId,
                nodeId: groupId,
            });
            changed = true;
            continue;
        }

        seenKids.add(childId);
        parentOf.set(childId, groupId);
        owner.set(childId, pageId);
        cleanKids.push(childId);
    }

    if (changed) {
        draftNodes[groupId] = { ...groupNode, childrenIds: cleanKids };
    }

    return cleanKids;
}

/**
 * Итеративный обход дерева страницы.
 * Заполняет visited, parentOf, owner. Исправляет childrenIds в draftNodes.
 */
function walkPageAndSanitize({ pageId, rootIds, draftNodes, owner, report }) {
    const visited = new Set();
    const visiting = new Set(); // для поиска циклов
    const parentOf = new Map(); // childId -> groupId

    // Стек кадров: { id, phase: 'enter' | 'exit' }
    // Изначально пушим корни в обратном порядке, чтобы первый был на вершине стека
    const stack = rootIds.map((id) => ({ id, phase: "enter" })).reverse();

    while (stack.length > 0) {
        const frame = stack.pop();
        const { id, phase } = frame;

        if (phase === "exit") {
            visiting.delete(id);
            continue;
        }

        // --- ENTER ---
        if (visited.has(id)) continue;

        const n = draftNodes[id];
        if (!n) continue; // могло быть удалено или отсутствовать

        // Проверка владельца (owner)
        const currentOwner = owner.get(id);
        if (currentOwner && currentOwner !== pageId) {
            report({
                code: "NODE_SHARED_BETWEEN_PAGES",
                message: `Узел ${id} уже принадлежит странице ${currentOwner}, пропускаем для ${pageId}`,
                pageId,
                nodeId: id,
            });
            continue;
        }
        owner.set(id, pageId);

        visited.add(id);
        visiting.add(id);

        // Если это группа, обрабатываем детей
        let childrenToVisit = [];
        if (isGroupType(n.type)) {
            childrenToVisit = processGroupChildren({
                groupId: id,
                groupNode: n,
                draftNodes,
                owner,
                pageId,
                parentOf,
                visiting,
                report,
            });
        }

        // Планируем выход после обработки детей
        stack.push({ id, phase: "exit" });

        // Добавляем детей в стек (в обратном порядке, чтобы сохранить порядок обхода)
        for (let i = childrenToVisit.length - 1; i >= 0; i--) {
            stack.push({ id: childrenToVisit[i], phase: "enter" });
        }
    }

    return { visited, parentOf };
}

/**
 * Выставляет корректные parentId для посещённых узлов.
 * Мутирует draftNodes.
 */
function fixParentLinks(draftNodes, visited, parentOf) {
    for (const id of visited) {
        const n = draftNodes[id];
        if (!n) continue;

        const desiredParentId = parentOf.get(id) ?? null;

        if (n.parentId !== desiredParentId) {
            draftNodes[id] = { ...n, parentId: desiredParentId };
        }
    }
}

function pruneOrphanNodes(draftNodes, usedGlobal) {
    const next = {};
    for (const id in draftNodes) {
        if (usedGlobal.has(id)) {
            next[id] = draftNodes[id];
        }
    }
    return next;
}

/**
 * Основная функция нормализации.
 */
export function normalizeProjectTree(project, opts = {}) {
    const pruneOrphans = opts.pruneOrphans ?? true;
    const { report } = makeReporter(opts);

    // 1. Создаем "черновик" nodes для мутаций (Performance optimization)
    // Мы копируем только верхний уровень объекта, сами узлы копируются по мере изменения (COW внутри логики)
    let draftNodes = { ...(project.nodes ?? {}) };

    // Предварительная очистка id и parentId
    sanitizeBaseNodes(draftNodes, report);

    const basePages = project.pages ?? {};
    const nextPages = { ...basePages };

    const owner = new Map(); // nodeId -> pageId
    const usedGlobal = new Set();

    for (const pageId of Object.keys(nextPages)) {
        const page = nextPages[pageId];
        if (!page) continue;

        // 1. Фильтруем rootIds: убираем дубли и несуществующие ноды
        // (Проверку owner делаем внутри обхода, так надежнее)
        const initialRootIds = dedupeStrings(page.rootIds).filter(
            (id) => !!draftNodes[id],
        );

        // 2. Обходим дерево, лечим ссылки детей, строим карту родителей
        const { visited, parentOf } = walkPageAndSanitize({
            pageId,
            rootIds: initialRootIds,
            draftNodes,
            owner,
            report,
        });

        // Добавляем посещенные узлы в глобальный список используемых
        for (const id of visited) usedGlobal.add(id);

        // 3. Финальная чистка rootIds:
        // - Убираем тех, кто стал чьим-то ребенком (есть в parentOf)
        // - Убираем тех, кто был захвачен другой страницей (проверяем visited)
        const finalRootIds = initialRootIds.filter((id) => {
            if (!visited.has(id)) return false; // отсекаем захваченные другой страницей
            if (parentOf.has(id)) return false; // отсекаем тех, кто стал ребенком
            return true;
        });

        // 4. Фиксим parentId у узлов
        fixParentLinks(draftNodes, visited, parentOf);

        // 5. Обновляем страницу, если rootIds изменились
        // Сравнение длин и содержимого
        const rootsChanged =
            finalRootIds.length !== (page.rootIds?.length ?? 0) ||
            !finalRootIds.every((val, index) => val === page.rootIds[index]);

        if (rootsChanged) {
            nextPages[pageId] = { ...page, rootIds: finalRootIds };
        }
    }

    // Удаление сирот
    if (pruneOrphans) {
        draftNodes = pruneOrphanNodes(draftNodes, usedGlobal);
    }

    // Валидация activePageId
    let activePageId = project.activePageId;
    const pageKeys = Object.keys(nextPages);
    if (!activePageId || !nextPages[activePageId]) {
        if (pageKeys.length > 0) {
            const first = pageKeys[0];
            if (activePageId !== first) {
                report({
                    code: "ACTIVE_PAGE_INVALID",
                    message:
                        "activePageId сброшен на первую доступную страницу",
                });
            }
            activePageId = first;
        } else {
            activePageId = "page-1";
        }
    }

    return {
        ...project,
        nodes: draftNodes,
        pages: nextPages,
        activePageId,
    };
}

export function normalizeProjectTreeWithReport(project, opts = {}) {
    const collected = [];
    const normalized = normalizeProjectTree(project, {
        ...opts,
        onIssue: (i) => collected.push(i),
    });
    return { project: normalized, issues: collected };
}
