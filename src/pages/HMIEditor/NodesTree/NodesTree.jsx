import { NodeToggleBtn } from "@/components/TreeView/NodeToggleBtn";
import styles from "@/components/TreeView/TreeView.module.css";
import { Flex, Heading, HStack, Icon, Input, Text } from "@chakra-ui/react";
import clsx from "clsx";
import { useEffect, useRef } from "react";
import { Tree } from "react-arborist";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { flyToNode } from "../utils/flyToNode";
import { IndentLines } from "@/components/TreeView/IndentLines";
import { VisibleButton } from "./VisibleButton";
import { setDiff, setEquals, toSet, useNodesData } from "./helpers";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { LOCALE } from "../constants";

export const NodesTree = ({ api }) => {
    const data = useNodesData();
    const treeRef = useRef();
    const tweenRef = useRef(null);

    const showNodesTree = useActionsStore((state) => state.showNodesTree);
    const selectedIds = useNodeStore((state) => state.selectedIds);

    const syncRef = useRef(false);

    const { ref, width, height } = useThrottledResizeObserver(100);

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

    const handleSelect = (nodes) => {
        if (syncRef.current) return;
        const tree = nodes[0]?.tree;

        const nextSet = tree ? tree.selectedIds : new Set();
        if (setEquals(nextSet, toSet(useNodeStore.getState().selectedIds)))
            return;

        useNodeStore.getState().setSelectedIds(Array.from(nextSet));
    };

    const handleRename = ({ id, name }) => {
        useNodeStore.getState().updateNode(id, { name });
    };

    return (
        <Flex direction={"column"} h={"100%"} minH={0}>
            <Flex justify="space-between" align="center" mb={2}>
                <Heading size={"md"}>{LOCALE.nodesTree}</Heading>
            </Flex>
            <Flex
                w={"100%"}
                h={"100%"}
                minH={0}
                position={"relative"}
                ref={ref}
            >
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
                    disableDrag
                >
                    {({ node, style, dragHandle }) => {
                        return (
                            <div
                                ref={dragHandle}
                                style={style}
                                className={clsx(
                                    styles.node,
                                    node.state,
                                    "group",
                                )}
                            >
                                <HStack w={"100%"}>
                                    <IndentLines
                                        paddingLeft={style.paddingLeft}
                                    />
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
        <Text truncate>{name}</Text>
    );
};

const ItemNameEditor = ({ name, submit, reset }) => {
    return (
        <Input
            size={"2xs"}
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
