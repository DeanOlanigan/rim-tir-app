import { Tree } from "react-arborist";
import { DropCursor } from "../../../components/TreeView/DropCursor";
import styles from "../../../components/TreeView/TreeView.module.css";
import clsx from "clsx";
import { HStack, IconButton, Box } from "@chakra-ui/react";
import { LuChevronRight, LuPencil } from "react-icons/lu";
import { icons, badges } from "../../../components/TreeView/DefaultView";
import { memo, forwardRef } from "react";
import {
    MenuRoot,
    MenuItem,
    MenuContent,
    MenuItemGroup,
    MenuContextTrigger,
    MenuSeparator
} from "../../../components/ui/menu";
import { LuFolder, LuVariable, LuTrash2 } from "react-icons/lu";

export const TreeView = memo(forwardRef(function TreeView(props, ref) {
    console.log(`%cRender NEW TreeView, ${props.selection}`, "color: white; background: red;");

    return (
        <MenuRoot lazyMount unmountOnExit>
            <MenuContextTrigger asChild>
                <Tree
                    ref={ref}
                    {...props}
                    className={styles.tree}
                    openByDefault={true}
                    overscanCount={2}
                    rowHeight={32}
                    indent={16}
                    renderCursor={DropCursor}
                    onClick={(e) => {
                        e.preventDefault();
                        console.log("TREE: click", ref.current.selectedIds.size );
                        if (ref.current.selectedIds.size === 0) {
                            ref.current.root.focus();
                        };
                    }}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        ref.current.root.focus();
                        ref.current.root.select();
                    }}
                >
                    {Node}
                </Tree>
            </MenuContextTrigger>
            <MenuContent>
                <MenuItemGroup title="Создать">
                    <MenuItem
                        value="variable"
                        onClick={() => {
                            console.log("TREE: create variable");
                            ref.current.create({
                                type: "variable",
                            });
                        }}
                    >
                        <LuVariable />
                        Переменная
                    </MenuItem>
                    <MenuItem
                        value="folder"
                        onClick={() => {
                            console.log("TREE: create folder");
                            ref.current.create({
                                type: "folder",
                            });
                        }}
                    >
                        <LuFolder />
                        Папка
                    </MenuItem>
                </MenuItemGroup>
            </MenuContent>
        </MenuRoot>
    );
}));

const Input = ({ node }) => {
    return (
        <input
            autoFocus
            type="text"
            defaultValue={node.data.name}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={() => node.reset()}
            onKeyDown={(e) => {
                if (e.key === "Escape") node.reset();
                if (e.key === "Enter") node.submit(e.currentTarget.value);
            }}
        />
    );
};

const Node = ({ node, style, dragHandle }) => {
    console.log("%cRender NEW Node", "color: white; background: purple;");
    const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);

    return (
        <MenuRoot lazyMount unmountOnExit>
            <MenuContextTrigger asChild>
                <div
                    ref={dragHandle}
                    style={style}
                    className={clsx(styles.node, node.state)}
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

                    <HStack gap={"4"}>
                        {node.isLeaf ? null :
                            (<IconButton
                                size={"2xs"}
                                variant={"plain"}
                                onClick={() => {
                                    node.toggle();
                                }}
                                color={"fg.subtle"}
                                _hover={{color: "bg.inverted"}}
                            >
                                <Box
                                    w={"19.19px"}
                                    h={"19.19px"}
                                    as={LuChevronRight}
                                    transform={node.isOpen ? "rotate(90deg)" : "rotate(0deg)"}
                                    transition={"transform 0.2s ease-in-out"}
                                />
                            </IconButton>)}
                        <HStack>
                            {icons[node.data.type]}
                            {
                                node.data.type === "protocol" ||
                                node.data.type === "interface" ||
                                node.data.type === "funcGroup" ||
                                node.data.type === "asdu" ?
                                    badges[node.data.subType] || badges[node.data.type] : null
                            }
                            {node.isEditing ? <Input node={node} /> : node.data.name || node.data.setting?.variable}
                        </HStack>
                    </HStack>
                </div>
            </MenuContextTrigger>
            <MenuContent>
                {node.data.type === "folder" && (
                    <>
                        <MenuItemGroup title="Создать">
                            <MenuItem
                                value="variable"
                                onClick={() => {
                                    console.log("NODE: create variable");
                                    node.tree.create({
                                        type: "variable",
                                    });
                                }}
                            >
                                <LuVariable />
                                Переменная
                            </MenuItem>
                            {/* <MenuItem
                                value="folder"
                                onClick={() => {
                                    console.log("NODE: create folder");
                                    node.tree.create({
                                        type: "folder",
                                    });
                                }}
                            >
                                <LuFolder />
                                Папка
                            </MenuItem> */}
                        </MenuItemGroup>
                        <MenuSeparator />
                    </>
                )}
                <MenuItem
                    value="rename"
                    onClick={() => {
                        node.tree.edit(node);
                    }}
                >
                    <LuPencil />
                    Переименовать
                </MenuItem>
                <MenuItem
                    value="delete"
                    color="fg.error"
                    _hover={{ bg: "bg.error", color: "fg.error" }}
                    onClick={() => {
                        console.log(node.tree.selectedIds);
                        node.tree.delete([...node.tree.selectedIds]);
                    }}
                >
                    <LuTrash2 />
                    Удалить
                </MenuItem>
            </MenuContent>
        </MenuRoot>
    );
};
