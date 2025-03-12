import { Box, Button, HStack } from "@chakra-ui/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import "../../components/ResizebalePanel/ResizebalePanel.css";
import { TreeCard } from "./TreeCard/TreeCard";
import { useVariablesStore } from "../../store/variables-store";
import { EditorCard } from "./EditorCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

function ConfigurationPage() {
    console.log("Render ConfigurationPage");

    //const [selectedNode, setSelectedNode] = useState();

    return (
        <DndProvider backend={HTML5Backend}>
            <Box height="100%">
                <PanelGroup autoSaveId="persistence" direction="horizontal">
                    <Panel collapsible collapsedSize={0} minSize={15}>
                        <PanelGroup
                            autoSaveId="persistence1"
                            direction="vertical"
                        >
                            <Panel сollapsible collapsedSize={0} minSize={30}>
                                {/* <VariablesWrapper /> */}
                                <ReceiveWrapper />
                            </Panel>
                            <PanelResizeHandle className="verticalLine" />
                            <Panel сollapsible collapsedSize={0} minSize={30}>
                                <SendWrapper />
                            </Panel>
                        </PanelGroup>
                    </Panel>
                    <PanelResizeHandle className="verticalLine" />
                    <Panel minSize={45}>
                        <EditorCard />
                    </Panel>
                    <PanelResizeHandle className="verticalLine" />
                    <Panel
                        collapsible
                        collapsedSize={0}
                        defaultSize={30}
                        minSize={15}
                    >
                        {/* <TestCard /> */}
                        <VariablesWrapper />
                    </Panel>
                </PanelGroup>
            </Box>
        </DndProvider>
    );
}

export default ConfigurationPage;

// TODO Подумать над решением с обертками, может быть есть решение лучше
const VariablesWrapper = () => {
    console.log("RENDER VariablesWrapper");
    const variables = useVariablesStore((state) => state.variables);
    return <TreeCard data={variables} treeType={"variables"} />;
};

const SendWrapper = () => {
    console.log("RENDER SendWrapper");
    const send = useVariablesStore((state) => state.send);
    return <TreeCard data={send} treeType={"send"} />;
};

const ReceiveWrapper = () => {
    console.log("RENDER ReceiveWrapper");
    const receive = useVariablesStore((state) => state.receive);
    return <TreeCard data={receive} treeType={"receive"} />;
};

import { Card } from "@chakra-ui/react";
import { AutoSizer } from "react-virtualized";
import { Tree } from "react-arborist";
import { useState } from "react";
import styles from "../../components/TreeView/TreeView.module.css";
import { DropCursor } from "../../components/TreeView/DropCursor";
import { useTreeViewHandlers } from "../../hooks/useTreeViewHandlers";
import { useEffect, useRef } from "react";

const TestCard = () => {
    console.log("Render TestCard");
    const [tree, setTree] = useState(null);
    const test = useVariablesStore((state) => state.test);

    const prevProps = useRef(tree);
    useEffect(() => {
        if (prevProps.current !== tree) {
            console.log("tree changed:", prevProps.current, "->", tree);
            prevProps.current = tree;
        }
    }, [tree]);

    const {
        handleRenameNode,
        handleCreateNode,
        handleDeleteNode,
        handleMoveNode,
        handleContextMenu,
        handleSelect,
        handleDisableDrop,
    } = useTreeViewHandlers("test", { current: tree });

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
                <HStack>
                    <Button
                        size={"xs"}
                        onClick={() => tree.create({ type: "leaf" })}
                    >
                        create leaf
                    </Button>
                    <Button
                        size={"xs"}
                        onClick={() => tree.create({ type: "internal" })}
                    >
                        create internal
                    </Button>
                    <Button
                        size={"xs"}
                        onClick={() => tree.create({ type: "variable" })}
                    >
                        create variable
                    </Button>
                    <Button
                        size={"xs"}
                        onClick={() => tree.create({ type: "folder" })}
                    >
                        create folder
                    </Button>
                    <Button size={"xs"} onClick={() => console.log(tree)}>
                        clg tree
                    </Button>
                    <Button
                        size={"xs"}
                        onClick={() => tree.edit(tree.focusedNode)}
                    >
                        rename
                    </Button>
                    <Button
                        size={"xs"}
                        onClick={() => tree.delete([...tree.selectedIds])}
                    >
                        delete
                    </Button>
                </HStack>
            </Card.Header>
            <Card.Body px={"0"} position={"relative"} overflow={"hidden"}>
                <AutoSizer>
                    {({ height, width }) => (
                        <Tree
                            ref={(t) => setTree(t)}
                            height={height}
                            width={width}
                            className={styles.tree}
                            openByDefault={true}
                            overscanCount={8}
                            padding={16}
                            rowHeight={30}
                            indent={16}
                            renderCursor={DropCursor}
                            renderDragPreview={DragPreview}
                            data={test}
                            onRename={handleRenameNode}
                            onCreate={handleCreateNode}
                            onDelete={handleDeleteNode}
                            onMove={handleMoveNode}
                            onContextMenu={handleContextMenu}
                            onSelect={handleSelect}
                        >
                            {Node}
                        </Tree>
                    )}
                </AutoSizer>
            </Card.Body>
        </Card.Root>
    );
};
const getStyle = (offset) => {
    if (!offset) return { display: "none" };
    const { x, y } = offset;
    return { transform: `translate(${x}px, ${y}px)` };
};

const layerStyles = {
    position: "fixed",
    pointerEvents: "none",
    zIndex: 100,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
};

const DragPreview = ({ offset }) => {
    return (
        <div style={layerStyles}>
            <div style={getStyle(offset)}>
                <div
                    style={{
                        height: "24px",
                        width: "100px",
                        background: "red",
                    }}
                ></div>
            </div>
        </div>
    );
};

import { LuFolder, LuFile } from "react-icons/lu";
import clsx from "clsx";
const Node = ({ node, style, dragHandle }) => {
    const Icon = node.isInternal ? LuFolder : LuFile;
    const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);
    return (
        <div
            ref={dragHandle}
            style={style}
            className={clsx(styles.node, node.state)}
            onClick={() => node.isInternal && node.toggle()}
        >
            <div className={styles.indentLines}>
                {new Array(indentSize / 16).fill(0).map((_, index) => {
                    return <div key={index}></div>;
                })}
            </div>
            <FolderArrow node={node} />
            <Icon className={styles.icon} />{" "}
            <span className={styles.text}>
                {node.isEditing ? <Input node={node} /> : node.data.name}
            </span>
        </div>
    );
};

import { LuArrowDown, LuArrowRight } from "react-icons/lu";
function FolderArrow({ node }) {
    return (
        <span className={styles.arrow}>
            {node.isInternal ? (
                node.isOpen ? (
                    <LuArrowDown />
                ) : (
                    <LuArrowRight />
                )
            ) : null}
        </span>
    );
}

function Input({ node }) {
    return (
        <input
            autoFocus
            name="name"
            type="text"
            defaultValue={node.data.name}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => node.reset()}
            onKeyDown={(e) => {
                if (e.key === "Escape") node.reset();
                if (e.key === "Enter") node.submit(e.currentTarget.value);
            }}
        />
    );
}
