import styles from "../../../components/TreeView/TreeView.module.css";
import clsx from "clsx";
import { NodeContent } from "./NodeContent";
import { memo } from "react";
import { useContextMenuStore } from "../../../store/contextMenu-store";
import { NodeBase } from "../../../components/TreeView/NodeBase";

export const Node = memo(function Node({ node, style, dragHandle, tree }) {
    //console.log("%cRender NEW Node", "color: white; background: purple;");

    /* const prevProps = useRef(node);
    useEffect(() => {
        if (prevProps.current !== node) {
            console.log("node changed:", prevProps.current, "->", node);
            prevProps.current = node;
        }
    }, [node]); */
    const isIgnored = hasIgnoreAccessor(node);
    const updateContext = useContextMenuStore((state) => state.updateContext);
    return (
        <div
            ref={dragHandle}
            style={style}
            className={clsx(styles.node, node.state, {
                [styles.highlight]: isIgnored,
            })}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                while (tree.isFocused(node.id) === false) {
                    console.log(tree.isFocused(node.id));
                    node.focus();
                }
                node.open();
                updateContext({
                    x: e.clientX,
                    y: e.clientY,
                    type: node.data.type,
                    subType: node.data.subType,
                    treeType: tree.props.treeType,
                    apiPath: tree,
                    visible: true,
                });
            }}
        >
            <NodeBase
                isLeaf={node.isLeaf}
                toggle={() => node.toggle()}
                isOpen={node.isOpen}
                paddingLeft={style.paddingLeft}
                id={node.data.id}
                type={node.data.type}
                subType={node.data.subType}
                isIgnored={node.data.isIgnored}
                isCutted={node.data.isCutted}
            >
                <NodeContent
                    id={node.data.id}
                    type={node.data.type}
                    subType={node.data.subType}
                    name={node.data.name}
                    isEditing={node.isEditing}
                    submit={(e) => node.submit(e)}
                    reset={() => node.reset()}
                />
            </NodeBase>
        </div>
    );
});

function hasIgnoreAccessor(node) {
    if (node.data.isIgnored) return true;
    if (node.parent) return hasIgnoreAccessor(node.parent);
    return false;
}
