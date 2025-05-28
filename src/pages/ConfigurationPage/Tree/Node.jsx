import styles from "@/components/TreeView/TreeView.module.css";
import clsx from "clsx";
import { NodeContent } from "./NodeContent";
import { memo } from "react";
import { useContextMenuStore } from "@/store/contextMenu-store";
import { NodeBase } from "@/components/TreeView/NodeBase";
import { getNodeFactory } from "./NodeViews/factory";
import { nodeTypeVisualMap } from "./NodeViews/nodeTypeVisualMap";

export const Node = memo(function Node({ node, style, dragHandle, tree }) {
    //console.log("%cRender NEW Node", "color: white; background: purple;");
    const updateContext = useContextMenuStore((state) => state.updateContext);
    const handleContextMenu = (e) => {
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
    };
    const getNodeVisual = getNodeFactory(nodeTypeVisualMap);
    const NodeVisual = getNodeVisual(node);
    return (
        <div
            ref={dragHandle}
            style={style}
            className={clsx(styles.node, node.state)}
            onContextMenu={handleContextMenu}
        >
            <NodeBase node={node} paddingLeft={style.paddingLeft}>
                <NodeVisual node={node} />
            </NodeBase>
        </div>
    );
});
