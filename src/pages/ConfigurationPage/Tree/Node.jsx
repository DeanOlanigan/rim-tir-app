import styles from "@/components/TreeView/TreeView.module.css";
import clsx from "clsx";
import { useContextMenuStore } from "@/store/contextMenu-store";
import { NodeBase } from "@/components/TreeView/NodeBase";
import { nodeTypeVisualMap } from "./NodeViews/nodeTypeVisualMap";
import { NodeError } from "./NodeError";
import { useVariablesStore } from "@/store/variables-store";
import { hasIgnoreAccessor } from "@/utils/utils";

export const Node = ({ node, style, dragHandle, tree }) => {
    const updateContext = useContextMenuStore((state) => state.updateContext);
    const isIgnored = useVariablesStore(
        (state) => state.settings[node.id]?.isIgnored
    );
    const accessorIsIgnored = useVariablesStore((state) =>
        hasIgnoreAccessor(state.settings, node.id)
    );
    const isCutted = useVariablesStore(
        (state) =>
            new Set(state.clipboard.ids).has(node.id) && state.clipboard.cut
    );
    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        while (tree.isFocused(node.id) === false) {
            // TODO : find a better way
            node.focus();
            node.select();
        }
        node.open();
        updateContext({
            apiPath: tree,
            x: e.clientX,
            y: e.clientY,
            visible: true,
        });
    };
    const NodeVisual =
        nodeTypeVisualMap[node.data.type] ?? nodeTypeVisualMap.default;
    return (
        <div
            ref={dragHandle}
            style={style}
            className={clsx(styles.node, node.state)}
            onContextMenu={handleContextMenu}
            onDoubleClick={() => node.edit()}
        >
            <NodeBase
                node={node}
                paddingLeft={style.paddingLeft}
                visual={<NodeVisual node={node} />}
                errors={<NodeError id={node.id} />}
                isIgnored={isIgnored}
                accessorIsIgnored={accessorIsIgnored}
                isCutted={isCutted}
            />
        </div>
    );
};
