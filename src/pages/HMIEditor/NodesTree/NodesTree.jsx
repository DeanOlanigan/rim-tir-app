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
import { setEquals, toSet, useNodesData } from "./helpers";
import { useThrottledResizeObserver } from "@/hooks/useThrottledResizeObserver";
import { LOCALE, SHAPES_ICONS } from "../constants";

// TODO доделать перехват фокуса при создании фигуры

export const NodesTree = ({ api }) => {
    const data = useNodesData();
    const treeRef = useRef();
    const tweenRef = useRef(null);

    const showNodesTree = useActionsStore((state) => state.showNodesTree);
    const selectedIds = useNodeStore((state) => state.selectedIds);

    const isReadyRef = useRef(false);
    const isSyncingRef = useRef(false);

    const { ref, width, height } = useThrottledResizeObserver(100);

    useEffect(() => {
        if (!showNodesTree) return;
        const tree = treeRef.current;
        if (!tree) return;

        isReadyRef.current = false;
        isSyncingRef.current = true;

        tree.deselectAll();
        if (selectedIds.length) {
            tree.select(selectedIds[0]);
            for (let i = 1; i < selectedIds.length; i++) {
                tree.selectMulti(selectedIds[i]);
            }
            tree.scrollTo(selectedIds[selectedIds.length - 1]);
        }

        isSyncingRef.current = false;
        isReadyRef.current = true;
    }, [selectedIds, showNodesTree]);

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
        if (!isReadyRef.current) return;
        if (isSyncingRef.current) return;

        const tree = nodes[0]?.tree;
        if (!tree) return;

        if (
            setEquals(
                tree.selectedIds,
                toSet(useNodeStore.getState().selectedIds),
            )
        )
            return;

        useNodeStore.getState().setSelectedIds(Array.from(tree.selectedIds));
    };

    const handleRename = ({ id, name }) => {
        useNodeStore.getState().updateNode(id, { name });
    };

    return (
        <Flex direction={"column"} h={"100%"} minH={0}>
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
                {width === 0 && height === 0 ? null : (
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
                                            <NodeIcon
                                                nodeId={node.id}
                                                onDoubleClick={() =>
                                                    focusById(node.id)
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

const NodeIcon = ({ nodeId, onDoubleClick }) => {
    const type = useNodeStore((s) => s.nodes[nodeId]?.type);
    const IconCmp = SHAPES_ICONS[type];

    return <Icon as={IconCmp} onDoubleClick={onDoubleClick} />;
};
