import { Box, IconButton } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";
import styles from "../../../components/TreeView/TreeView.module.css";
import clsx from "clsx";
import NodeContent from "./NodeContent";
import { memo } from "react";
import { ContextMenuWrapper } from "./ContextMenuWrapper";

const Node = ({ node, style, dragHandle }) => {
    //console.log("%cRender NEW Node", "color: white; background: purple;");
    const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);

    return (
        <ContextMenuWrapper apiPath={node.tree} type={node.data.type}>
            <div
                ref={dragHandle}
                style={style}
                className={clsx(styles.node, node.state)}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    node.focus();
                    node.select();
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
                        <IconButton
                            size={"2xs"}
                            variant={"plain"}
                            onClick={() => {
                                node.toggle();
                            }}
                            color={"fg.subtle"}
                            _hover={{ color: "bg.inverted" }}
                        >
                            <Box
                                w={"19.19px"}
                                h={"19.19px"}
                                as={LuChevronRight}
                                transform={
                                    node.isOpen
                                        ? "rotate(90deg)"
                                        : "rotate(0deg)"
                                }
                                transition={"transform 0.2s ease-in-out"}
                            />
                        </IconButton>
                    )}
                    <NodeContent node={node} />
                </div>
            </div>
        </ContextMenuWrapper>
    );
};
export default memo(Node);
