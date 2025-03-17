import styles from "../../../components/TreeView/TreeView.module.css";
import clsx from "clsx";
import { NodeContent } from "./NodeContent";
import { memo, useEffect, useRef } from "react";
import { ContextMenuWrapper } from "./ContextMenuWrapper";
import { NodeToggleBtn } from "./NodeToggleBtn";

// TODO Ререндер при перетаскивании всех узлов
export const Node = memo(function Node({ node, style, dragHandle, tree }) {
    //console.log("%cRender NEW Node", "color: white; background: purple;");

    /* const prevProps = useRef(node);
    useEffect(() => {
        if (prevProps.current !== node) {
            console.log("node changed:", prevProps.current, "->", node);
            prevProps.current = node;
        }
    }, [node]); */

    const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);

    return (
        /* <ContextMenuWrapper
            apiPath={tree}
            type={node.data.type}
            subType={node.data.subType}
        > */
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
                //node.select();
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
                    type={node.data.type}
                    subType={node.data.subType}
                    name={node.data.name}
                    isEditing={node.isEditing}
                    submit={(e) => node.submit(e)}
                    reset={() => node.reset()}
                />
            </div>
        </div>
        /* </ContextMenuWrapper> */
    );
});
