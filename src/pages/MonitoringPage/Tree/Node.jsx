import { NodeBase } from "../../../components/TreeView/NodeBase";
import { NodeContent } from "./NodeContent";
import clsx from "clsx";
import styles from "../../../components/TreeView/TreeView.module.css";

export const Node = ({ node, style }) => {
    return (
        <div style={style} className={clsx(styles.node, node.state)}>
            <NodeBase
                isLeaf={node.isLeaf}
                toggle={() => node.toggle()}
                isOpen={node.isOpen}
                paddingLeft={style.paddingLeft}
                id={node.data.id}
                type={node.data.type}
                subType={node.data.subType}
                isIgnored={node.data.isIgnored}
            >
                <NodeContent
                    id={node.data.id}
                    type={node.data.type}
                    subType={node.data.subType}
                    name={node.data.name}
                />
            </NodeBase>
        </div>
    );
};
