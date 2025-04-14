import styles from "../../../components/TreeView/TreeView.module.css";
import clsx from "clsx";
import { NodeContent } from "./NodeContent";
import { memo } from "react";
import { NodeToggleBtn } from "./NodeToggleBtn";
import { useContextMenuStore } from "../../../store/contextMenu-store";

export const Node = memo(function Node({ node, style, dragHandle, tree }) {
    //console.log("%cRender NEW Node", "color: white; background: purple;");

    /* const prevProps = useRef(node);
    useEffect(() => {
        if (prevProps.current !== node) {
            console.log("node changed:", prevProps.current, "->", node);
            prevProps.current = node;
        }
    }, [node]); */
    const updateContext = useContextMenuStore((state) => state.updateContext);
    const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);

    return (
        <div
            ref={dragHandle}
            style={style}
            className={clsx(styles.node, node.state, {
                [styles.highlight]:
                    tree.dragDestinationParent?.isAncestorOf(node) &&
                    tree.dragDestinationParent?.id !==
                        tree.dragNode?.parent?.id,
            })}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                node.focus();
                node.select();
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
            <div className={styles.indentLines}>
                {new Array(indentSize / 16).fill(0).map((_, index) => {
                    return <div key={index}></div>;
                })}
            </div>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                }}
            >
                {node.isLeaf ? null : (
                    <NodeToggleBtn
                        toggle={() => node.toggle()}
                        isOpen={node.isOpen}
                    />
                )}
                <NodeContent
                    id={node.data.id}
                    type={node.data.type}
                    subType={node.data.subType}
                    name={node.data.name}
                    isEditing={node.isEditing}
                    submit={(e) => node.submit(e)}
                    reset={() => node.reset()}
                />
            </div>
        </div>
    );
});
