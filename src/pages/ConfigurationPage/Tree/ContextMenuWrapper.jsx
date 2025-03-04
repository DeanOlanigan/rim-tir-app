import {
    MenuRoot,
    MenuItem,
    MenuContent,
    MenuContextTrigger,
    MenuSeparator,
} from "../../../components/ui/menu";
import { menuConfig } from "../../../config/contextMenu";

// TODO Подумать как избежать ре-рендера
export const ContextMenuWrapper = ({
    apiPath,
    type = null,
    subType = null,
    children,
}) => {
    const treeType = apiPath?.props.treeType;
    // Нужно передавать отдельным пропсом, а не через api дерева, иначе неверно отображается контекстное меню
    const focusedNodeType = subType || type || "default";

    console.log(
        "%cContextMenuWrapper",
        `color: white; background: ${
            focusedNodeType === "default" ? "green" : "blue"
        };`,
        [treeType, focusedNodeType]
    );

    if (!apiPath) {
        return children;
    }

    const items = menuConfig[treeType][focusedNodeType];

    if (!items) return children;

    return (
        <MenuRoot lazyMount unmountOnExit>
            <MenuContextTrigger asChild>{children}</MenuContextTrigger>
            <MenuContent>
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
            </MenuContent>
        </MenuRoot>
    );
};
