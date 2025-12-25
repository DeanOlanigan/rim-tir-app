import { Box, HStack, Icon, IconButton, Text } from "@chakra-ui/react";
import { useNodeStore } from "./store/node-store";
import { useActionsStore } from "./store/actions-store";
import { SHAPES_ICONS } from "./constants";
import { flyToNode } from "./flyToNode";
import { useEffect, useRef } from "react";
import { Tree } from "react-arborist";
import styles from "@/components/TreeView/TreeView.module.css";
import clsx from "clsx";
import { NodeToggleBtn } from "@/components/TreeView/NodeToggleBtn";
import { LuEye, LuEyeOff } from "react-icons/lu";

const useNodesData = () => {
    const rootIds = useNodeStore((state) => state.rootIds);
    if (rootIds.length === 0) return [];
    function createRecursiveList(items) {
        return items.map((id) => {
            const node = useNodeStore.getState().nodes[id];
            const res = {
                id,
                icon: SHAPES_ICONS[node.type],
            };
            if (node.childrenIds)
                res.children = createRecursiveList(node.childrenIds);
            return res;
        });
    }

    return createRecursiveList(rootIds);
};

function toSet(ids) {
    return new Set(ids);
}

function setEquals(a, b) {
    if (a.size !== b.size) return false;
    for (const v of a) if (!b.has(v)) return false;
    return true;
}

function setDiff(a, b) {
    // a \ b
    const out = [];
    for (const v of a) if (!b.has(v)) out.push(v);
    return out;
}

export const NodesTree = ({ api }) => {
    const data = useNodesData();
    const treeRef = useRef();
    const tweenRef = useRef(null);

    const showNodesTree = useActionsStore((state) => state.showNodesTree);
    const selectedIds = useNodeStore((state) => state.selectedIds);

    const syncRef = useRef(false);

    useEffect(() => {
        const tree = treeRef.current;
        if (!tree) return;
        const treeSet = tree.selectedIds;

        const selectedSet = toSet(selectedIds);

        if (setEquals(treeSet, selectedSet)) return;

        syncRef.current = true;

        const removed = setDiff(treeSet, selectedSet);
        for (const id of removed) tree.deselect(id);
        const added = setDiff(selectedSet, treeSet);
        for (const id of added) tree.selectMulti(id);

        if (selectedIds.length)
            tree.scrollTo(selectedIds[selectedIds.length - 1]);

        queueMicrotask(() => {
            syncRef.current = false;
        });
    }, [selectedIds]);

    if (!showNodesTree) return null;

    const focusById = (id) => {
        const stage = api.getStage();
        if (!stage) return;

        // 1) если у ноды есть id как attrs.id

        const node = api.getNodes().get(id);
        if (!node) return;

        flyToNode(stage, node, { tweenRef, zoomToFit: true, duration: 0.35 });
        // или zoomToFit: true, чтобы еще и приблизить/отдалить
    };

    return (
        <Box
            bg={"bg"}
            w={"250px"}
            h={"250px"}
            borderRadius={"md"}
            shadow={"md"}
            p={2}
        >
            <Tree
                ref={treeRef}
                data={data}
                width={234}
                height={234}
                overscanCount={2}
                indent={16}
                rowHeight={32}
                onSelect={(nodes) => {
                    if (syncRef.current) return;

                    const tree = nodes[0]?.tree;
                    if (!tree) return;

                    const nextSet = tree.selectedIds;
                    if (
                        setEquals(
                            nextSet,
                            toSet(useNodeStore.getState().selectedIds),
                        )
                    )
                        return;

                    useNodeStore.getState().setSelectedIds(Array.from(nextSet));
                }}
                onRename={({ id, name }) =>
                    useNodeStore.getState().updateNode(id, { name })
                }
            >
                {({ node, style, dragHandle }) => {
                    return (
                        <div
                            ref={dragHandle}
                            style={style}
                            className={clsx(styles.node, node.state, "group")}
                        >
                            <HStack w={"100%"}>
                                <IndentLines paddingLeft={style.paddingLeft} />
                                <HStack w={"100%"}>
                                    {!node.isLeaf && (
                                        <NodeToggleBtn
                                            toggle={() => node.toggle()}
                                            isOpen={node.isOpen}
                                        />
                                    )}
                                    <Icon
                                        as={node.data.icon}
                                        onDoubleClick={() =>
                                            focusById(node.data.id)
                                        }
                                    />
                                    <HStack
                                        w={"100%"}
                                        onDoubleClick={() => node.edit()}
                                    >
                                        <ItemName node={node} />
                                    </HStack>
                                    <VisibleBtn node={node} />
                                </HStack>
                            </HStack>
                        </div>
                    );
                }}
            </Tree>
        </Box>
    );
};

const IndentLines = ({ paddingLeft }) => {
    const indentSize = Number.parseFloat(`${paddingLeft || 0}`);

    return (
        <div className={styles.indentLines}>
            {new Array(indentSize / 16).fill(0).map((_, index) => {
                return <div key={index}></div>;
            })}
        </div>
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
        <Text truncate>{name}</Text>
    );
};

const ItemNameEditor = ({ name, submit, reset }) => {
    return (
        <input
            autoFocus
            type="text"
            size={"3xs"}
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

const VisibleBtn = ({ node }) => {
    const isVisible = useNodeStore((state) => state.nodes[node.id].visible);

    return (
        <IconButton
            display={{ base: "none", _groupHover: "flex" }}
            size={"2xs"}
            variant={"ghost"}
            css={{
                _icon: {
                    width: "4",
                    height: "4",
                },
            }}
            onClick={(e) => {
                useNodeStore
                    .getState()
                    .updateNode(node.id, { visible: !isVisible });
                e.stopPropagation();
            }}
        >
            {isVisible ? <LuEye /> : <LuEyeOff />}
        </IconButton>
    );
};
