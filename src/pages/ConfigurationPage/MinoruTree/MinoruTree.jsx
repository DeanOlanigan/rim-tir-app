import { Card, Button, Box, Flex, Text } from "@chakra-ui/react";
import styles from "./MinoruTree.module.css";
import { Tree } from "@minoru/react-dnd-treeview";
import { useTestStore } from "../../../store/minoruTree-store";
import { MinoruCustomNode } from "./MinoruCustomNode";
import { MinoruCustomDragPreview } from "./MinoruCustomDragPreview";
import { MinoruPlaceholder } from "./MinoruPlaceholder";

export const MinoruTree = () => {
    const { variablesTree, setVariablesTree, selectedNode, setSelectedNode } =
        useTestStore((state) => state);
    const handleDrop = (newTreeData) => setVariablesTree(newTreeData);
    const handleSelect = (node) => setSelectedNode(node);
    return (
        <Card.Root
            size={"sm"}
            h={"100%"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <Text>{selectedNode ? selectedNode.text : ""}</Text>
                <Button size={"xs"} onClick={() => console.log(variablesTree)}>
                    clg tree
                </Button>
            </Card.Header>
            <Card.Body px={"2"} position={"relative"} overflow={"auto"}>
                <Tree
                    tree={variablesTree}
                    initialOpen={true}
                    rootId={0}
                    onDrop={handleDrop}
                    sort={false}
                    insertDroppableFirst={false}
                    classes={{
                        root: styles.treeRoot,
                        draggingSource: styles.draggingSource,
                        placeholder: styles.placeholderContainer,
                    }}
                    canDrop={(
                        tree,
                        { dragSource, dropTargetId, dropTarget }
                    ) => {
                        if (dragSource?.parent === dropTargetId) {
                            return true;
                        }
                    }}
                    dropTargetOffset={5}
                    dragPreviewRender={(monitorProps) => (
                        <MinoruCustomDragPreview monitorProps={monitorProps} />
                    )}
                    placeholderRender={(node, { depth }) => (
                        <MinoruPlaceholder node={node} depth={depth} />
                    )}
                    render={(node, { depth, isOpen, onToggle }) => (
                        <MinoruCustomNode
                            node={node}
                            depth={depth}
                            isOpen={isOpen}
                            isSelected={node.id === selectedNode?.id}
                            onToggle={onToggle}
                            onSelect={handleSelect}
                        />
                    )}
                />
            </Card.Body>
        </Card.Root>
    );
};
