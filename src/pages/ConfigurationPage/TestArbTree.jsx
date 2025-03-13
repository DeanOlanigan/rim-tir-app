import { Card, HStack, Button } from "@chakra-ui/react";
import { AutoSizer } from "react-virtualized";
import { Tree as TreeArborist } from "react-arborist";
import { useState } from "react";
import styles from "../../components/TreeView/TreeView.module.css";
import { DropCursor } from "../../components/TreeView/DropCursor";
import { useTreeViewHandlers } from "../../hooks/useTreeViewHandlers";
import { useEffect, useRef } from "react";
import { useVariablesStore } from "../../store/variables-store";
import { LuArrowDown, LuArrowRight } from "react-icons/lu";
import { LuFolder, LuFile } from "react-icons/lu";
import clsx from "clsx";

export const TestCard = () => {
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
                <HStack overflow={"auto"}>
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
                        <TreeArborist
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
                            initialData={test}
                            /* data={test}
                            onRename={handleRenameNode}
                            onCreate={handleCreateNode}
                            onDelete={handleDeleteNode}
                            onMove={handleMoveNode}
                            onContextMenu={handleContextMenu}
                            onSelect={handleSelect} */
                        >
                            {Node}
                        </TreeArborist>
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
