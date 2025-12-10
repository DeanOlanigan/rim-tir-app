import { NodeBase } from "@/components/TreeView/NodeBase";
import clsx from "clsx";
import styles from "@/components/TreeView/TreeView.module.css";
import { NodeContent } from "./NodeContent";
import { NODE_TYPES, TREE_TYPES } from "@/config/constants";
import { memo } from "react";
import { ParamViewer } from "@/components/TreeView/ParamViewer";
import { useSettingsFromCache } from "../../useSettingsFromCache";
import { hasIgnoreAccessor } from "@/utils/checkers";
import { useContextMenuStore } from "@/store/contextMenu-store";
import { crossSelect } from "../crossSelect";

export const Node = memo(function Node({ node, style, tree }) {
    const { updateContext } = useContextMenuStore.getState();
    const settings = useSettingsFromCache();

    const isIgnored = settings[node.id]?.isIgnored;
    const isIgnoredAccessor = hasIgnoreAccessor(settings, node.id);

    const onClick = async (e) => {
        node.handleClick(e);
        if (e.altKey)
            await crossSelect(
                settings,
                node.id,
                "monitoring",
                Object.values(TREE_TYPES),
            );
    };

    const handleContextMenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        node.focus();
        node.open();
        updateContext("mnt", {
            apiPath: tree,
            x: e.clientX,
            y: e.clientY,
            visible: true,
        });
    };

    return (
        <div
            style={style}
            className={clsx(styles.node, node.state)}
            onContextMenu={handleContextMenu}
            onClick={onClick}
        >
            <NodeBase
                node={node}
                paddingLeft={style.paddingLeft}
                visual={
                    <NodeContent
                        id={node.id}
                        type={node.data.type}
                        name={node.data.name}
                    />
                }
                params={
                    <ParamViewer
                        settings={settings}
                        path={node.data.path}
                        id={node.data.id}
                        isVariable={node.data.type === NODE_TYPES.variable}
                    />
                }
                isIgnored={isIgnored}
                isIgnoredAccessor={isIgnoredAccessor}
            />
        </div>
    );
});
