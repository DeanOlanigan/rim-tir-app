import { NodeToggleBtn } from "@/components/TreeView/NodeToggleBtn";
import styles from "@/components/TreeView/TreeView.module.css";
import { Flex, Heading, HStack, Icon, Input, Text } from "@chakra-ui/react";
import clsx from "clsx";
import { useRef } from "react";
import { Tree } from "react-arborist";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { flyToNode } from "../utils/flyToNode";
import { IndentLines } from "@/components/TreeView/IndentLines";
import { VisibleButton } from "./VisibleButton";
import { setEquals, useNodesData } from "./helpers";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { LOCALE, SHAPES_ICONS } from "../constants";
import { useArboristSelectionSync } from "./useArboristSelectionSync";
import { useContextMenuStore } from "@/store/contextMenu-store";
import { DropCursor } from "@/components/TreeView/DropCursor";

function isSameOrInside(node, possibleAncestor) {
    // node: NodeApi (куда дропаем)
    // possibleAncestor: NodeApi (что тащим)
    let cur = node;
    while (cur) {
        if (cur.id === possibleAncestor.id) return true; // в себя или в своего потомка
        cur = cur.parent;
    }
    return false;
}

function collectDescendantIds(nodeApi) {
    const out = [];
    const stack = [...(nodeApi.children ?? [])];
    while (stack.length) {
        const n = stack.pop();
        out.push(n.id);
        if (n.children?.length) stack.push(...n.children);
    }
    return out;
}

function collectAncestorIds(nodeApi) {
    const out = [];
    let p = nodeApi.parent;
    while (p) {
        out.push(p.id);
        p = p.parent;
    }
    return out;
}

function normalizeSelection(tree, nextSelected, addedIds) {
    const selected = new Set(nextSelected);

    for (const id of addedIds) {
        const node = tree.get?.(id);
        if (!node) continue;

        // 1) если выбрали ребёнка — выкинуть предков
        for (const ancId of collectAncestorIds(node)) selected.delete(ancId);

        // 2) если выбрали родителя — выкинуть детей/всех потомков
        for (const descId of collectDescendantIds(node))
            selected.delete(descId);
    }

    return selected;
}

function getHighlightRootId(node) {
    // ближайший выбранный предок (сам node не считается)
    let p = node.parent;
    while (p) {
        if (p.isSelected) return p.id;
        p = p.parent;
    }
    return null;
}

export const NodesTree = ({ api }) => {
    const data = useNodesData();
    const treeRef = useRef();
    const tweenRef = useRef(null);

    const showNodesTree = useActionsStore((state) => state.showNodesTree);
    const selectedIds = useNodeStore((state) => state.selectedIds);

    const { ref, width, height } = useThrottledResizeObserver(100);

    const canRenderTree = showNodesTree && width > 0 && height > 0;

    const { isReadyRef, isSyncingRef, markSelectionFromTree } =
        useArboristSelectionSync({
            api,
            treeRef,
            selectedIds,
            canRenderTree,
            data,
        });

    if (!showNodesTree) return null;

    const flyToNodeById = (id) => {
        const stage = api.getStage();
        if (!stage) return;

        // 1) если у ноды есть id как attrs.id

        const node = api.getNodes().get(id);
        if (!node) return;

        flyToNode(stage, node, { tweenRef, zoomToFit: true, duration: 0.35 });
        // или zoomToFit: true, чтобы еще и приблизить/отдалить
    };

    const handleSelect = () => {
        if (!isReadyRef.current) return;
        if (isSyncingRef.current) return;

        const tree = treeRef.current;
        if (!tree) return;

        const prev = new Set(useNodeStore.getState().selectedIds);
        const next = new Set(tree.selectedIds);

        if (setEquals(prev, next)) return;

        const added = [];
        for (const id of next) if (!prev.has(id)) added.push(id);

        const normalized = added.length
            ? normalizeSelection(tree, next, added)
            : next;

        markSelectionFromTree();
        useNodeStore.getState().setSelectedIds(Array.from(normalized));
    };

    const handleRename = ({ id, name }) => {
        useNodeStore.getState().updateNode(id, { name });
    };

    const handleContextMenu = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        useNodeStore.getState().setSelectedIds([id]);
        useContextMenuStore.getState().updateContext("sch", {
            x: e.clientX,
            y: e.clientY,
            apiPath: [id],
            visible: true,
        });
    };

    const handleDisableDrop = (args) => {
        const { parentNode, dragNodes } = args;
        if (!parentNode) return false;
        return (
            dragNodes.some((dragNode) =>
                isSameOrInside(parentNode, dragNode),
            ) ?? false
        );
    };

    return (
        <Flex
            direction={"column"}
            h={"100%"}
            minH={0}
            onPointerDownCapture={() =>
                useActionsStore.getState().setFocusOwner("nodesTree")
            }
        >
            <Flex justify="space-between" align="center" mb={2}>
                <Heading size={"md"} userSelect={"none"}>
                    {LOCALE.nodesTree}
                </Heading>
            </Flex>
            <Flex
                w={"100%"}
                h={"100%"}
                minH={0}
                position={"relative"}
                ref={ref}
            >
                {canRenderTree && (
                    <Tree
                        ref={treeRef}
                        data={data}
                        width={width}
                        height={height}
                        overscanCount={2}
                        indent={16}
                        rowHeight={32}
                        onSelect={handleSelect}
                        onRename={handleRename}
                        disableDrop={handleDisableDrop}
                        renderCursor={DropCursor}
                        onMove={() => {}}
                    >
                        {({ node, style, dragHandle, tree }) => {
                            const rootId = getHighlightRootId(node);
                            const hl = rootId != null && !node.isSelected;

                            const visible = tree.visibleNodes;

                            const next = Array.isArray(visible)
                                ? visible[node.rowIndex + 1]
                                : null;

                            const nextRootId = next
                                ? getHighlightRootId(next)
                                : null;
                            const nextHighlighted = next
                                ? nextRootId != null && !next.isSelected
                                : false;

                            // roundBottom только если подсветка "заканчивается" в следующей строке
                            const roundBottom =
                                hl &&
                                !(nextHighlighted && nextRootId === rootId);

                            return (
                                <div
                                    ref={dragHandle}
                                    onContextMenu={(e) =>
                                        handleContextMenu(e, node.id)
                                    }
                                    style={style}
                                    className={clsx(
                                        {
                                            highlighted: hl,
                                            roundBottom: roundBottom,
                                        },
                                        styles.node,
                                        node.state,
                                        "group",
                                    )}
                                >
                                    <HStack w={"100%"} h={"100%"}>
                                        <IndentLines
                                            paddingLeft={style.paddingLeft}
                                        />
                                        <HStack w={"100%"} h={"100%"}>
                                            {!node.isLeaf && (
                                                <NodeToggleBtn
                                                    toggle={() => node.toggle()}
                                                    isOpen={node.isOpen}
                                                />
                                            )}
                                            <NodeIcon
                                                nodeId={node.id}
                                                onDoubleClick={() =>
                                                    flyToNodeById(node.id)
                                                }
                                            />
                                            <HStack
                                                w={"100%"}
                                                h={"100%"}
                                                onDoubleClick={() => {
                                                    node.edit();
                                                }}
                                            >
                                                <ItemName node={node} />
                                            </HStack>
                                            <VisibleButton node={node} />
                                        </HStack>
                                    </HStack>
                                </div>
                            );
                        }}
                    </Tree>
                )}
            </Flex>
        </Flex>
    );
};

const ItemName = ({ node }) => {
    const name = useNodeStore((state) => state.nodes[node.id].name);

    return node.isEditing ? (
        <ItemNameEditor
            name={name}
            submit={(value) => node.submit(value)}
            reset={() => node.reset()}
        />
    ) : (
        <Text truncate ps={2}>
            {name}
        </Text>
    );
};

const ItemNameEditor = ({ name, submit, reset }) => {
    return (
        <Input
            h={"2rem"}
            size={"2xs"}
            border={"none"}
            outlineWidth={"2px"}
            outlineOffset={"-2px"}
            fontSize={"md"}
            fontWeight={"medium"}
            _selection={{
                bg: "bg.emphasized",
            }}
            autoFocus
            type="text"
            defaultValue={name}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={(e) => submit(e.currentTarget.value)}
            onKeyDown={(e) => {
                if (e.key === "Escape") reset();
                if (e.key === "Enter") submit(e.currentTarget.value);
            }}
        />
    );
};

const NodeIcon = ({ nodeId, onDoubleClick }) => {
    const type = useNodeStore((s) => s.nodes[nodeId]?.type);
    const IconCmp = SHAPES_ICONS[type];

    return <Icon as={IconCmp} onDoubleClick={onDoubleClick} />;
};
