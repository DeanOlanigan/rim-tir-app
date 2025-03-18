import {
    MenuRoot,
    MenuItem,
    MenuContent,
    MenuContextTrigger,
    MenuSeparator,
} from "../../../components/ui/menu";
import { Menu, Portal } from "@chakra-ui/react";
import { menuConfig } from "../../../config/contextMenu";
import { useContextMenuStore } from "../../../store/contextMenu-store";

// TODO Подумать как избежать ре-рендера
export const ContextMenuWrapper = () => {
    const context = useContextMenuStore((state) => state.context);
    const { apiPath, type, subType, treeType, isOpen, position } = context;
    // Нужно передавать отдельным пропсом, а не через api дерева, иначе неверно отображается контекстное меню
    const focusedNodeType = subType || type || "default";

    /* console.log(
        "%cContextMenuWrapper",
        `color: white; background: ${
            focusedNodeType === "default" ? "green" : "blue"
        };`,
        [treeType, focusedNodeType]
    ); */

    if (!apiPath) {
        return null;
    }

    const items = menuConfig[treeType][focusedNodeType];

    if (!items) return null;

    return (
        <Menu.Root
            lazyMount
            unmountOnExit
            open={isOpen}
            positioning={{
                x: position.x,
                y: position.y,
                width: apiPath.width,
                height: apiPath.height,
            }}
        >
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        {items.map((item, index) => {
                            if (item.type === "separator") {
                                return <MenuSeparator key={`sep_${index}`} />;
                            }
                            return (
                                <MenuItem
                                    key={item.key}
                                    value={item.key}
                                    {...item.style}
                                    onClick={() => item.action?.(apiPath)}
                                >
                                    {item.icon?.()}
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
