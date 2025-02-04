import React from "react";
import { Tree } from "react-arborist";
import { DropCursor } from "./DropCursor";
import { memo } from "react";
import { motion, AnimatePresence } from "motion/react";
import clsx from "clsx";
import styles from "./TreeView.module.css";
import { useCallback } from "react";
import { Box, Stack, StackSeparator } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

import {
    MenuContent,
    MenuContextTrigger,
    MenuRoot,
} from "../ui/menu";

const INDENT_SIZE = 16;

const BaseNode = memo(function BaseNode(props) {
    //console.log("Render BaseNode");
    const { node, style, dragHandle, tree, preview, children, MenuItems } = props;
    
    const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);

    return (
        <AnimatePresence mode="popLayout">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: -20, scale: 0 }}
                transition={{ duration: 0.2 }}
                className={clsx(styles.node, node.state)}
            >

                <div className={styles.indentLines}>
                    {new Array(indentSize / INDENT_SIZE).fill(0).map((_, index) => {
                        return <div key={index}></div>;
                    })}
                </div>

                {
                    MenuItems === undefined ? 
                        (<NodeContent
                            node={node}
                            style={style}
                            dragHandle={dragHandle}
                            tree={tree}
                            preview={preview}
                        >
                            {children}
                        </NodeContent>) : 
                        (<NodeContext
                            node={node}
                            style={style}
                            dragHandle={dragHandle}
                            tree={tree}
                            preview={preview}
                            MenuItems={MenuItems}
                        >
                            {children}
                        </NodeContext>)
                }
            </motion.div>
        </AnimatePresence>
    );
});

const NodeContext = memo(function NodeContext(props) {
    //console.log("Render NodeContext");
    const { node, dragHandle, style, tree, preview, MenuItems, children } = props;

    return (
        <MenuRoot lazyMount unmountOnExit>
            <MenuContextTrigger w={"100%"}>
                {/* <IconButton
                    size={"xs"}
                    variant={"ghost"}
                    position={"absolute"}
                    right={0}
                >
                    <LuEllipsis />
                </IconButton> */}
                <NodeContent
                    node={node}
                    dragHandle={dragHandle}
                    style={style}
                    tree={tree}
                    preview={preview}
                >
                    {children}
                </NodeContent>
            </MenuContextTrigger>
            <MenuContent>
                {MenuItems}
            </MenuContent>
        </MenuRoot>
    );
});

const NodeContent = memo(function NodeContent(props) {
    //console.log("Render NodeContent");
    const { node, dragHandle, style, children } = props;
    const { type, subType, setting } = node.data;
    
    const childrenProp = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
                type,
                subType,
                setting
            });
        }
        return child;
    });

    return (
        <Stack
            direction={"row"}
            gap={"4"}
            align={"center"}
            onContextMenu={(e) => e.preventDefault()}
            ref={dragHandle}
            style={style}
            w={"calc(100% - 32px)"}
            minW={"350px"}
            h={"100%"}
            onClick={() => {
                node.toggle();
            }}
        >
            {
                node.isLeaf 
                    ? null
                    : 
                    (
                        <Box
                            w={"19.19px"}
                            h={"19.19px"}
                            color={"fg.subtle"}
                            as={LuChevronRight}
                            transform={node.isOpen ? "rotate(90deg)" : "rotate(0deg)"}
                            transition={"transform 0.2s ease-in-out"}
                        />
                    )
            }
            {childrenProp}
        </Stack>
    );
});

export const TreeView = memo(function TreeView(props) {
    console.log("Render TreeView");
    const { height, width, data, children, MenuItems, disableDrag, setNode} = props;

    const onFocus = (node) => {
        console.log("onFocus:", node);
    };

    const onSelect = (nodes) => {
        console.log("onSelect:", nodes);
        if (setNode === undefined) return;
        setNode(nodes);
    };

    return (
        <Tree
            initialData={data}
            className={styles.tree}
            openByDefault={true}
            overscanCount={2}
            rowHeight={32}
            indent={INDENT_SIZE} // Отступ вложенных узлов
            height={height}
            width={width}
            onFocus={onFocus}
            onSelect={onSelect}
            renderCursor={DropCursor}
            disableDrag={disableDrag}
        >
            {useCallback((node) => (
                <BaseNode
                    node={node.node}
                    style={node.style}
                    dragHandle={node.dragHandle}
                    tree={node.tree}
                    preview={node.preview}
                    MenuItems={MenuItems}
                >
                    {children}
                </BaseNode>
            ), [])}
        </Tree>
    );
});
