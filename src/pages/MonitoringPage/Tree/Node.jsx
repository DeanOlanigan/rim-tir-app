import { NodeBase } from "@/components/TreeView/NodeBase";
import clsx from "clsx";
import styles from "@/components/TreeView/TreeView.module.css";
import { NodeContent } from "./NodeContent";

export const Node = ({ node, style }) => {
    return (
        <div style={style} className={clsx(styles.node, node.state)}>
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
            />
        </div>
    );
};
