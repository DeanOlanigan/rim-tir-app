import { Menu } from "@chakra-ui/react";
import { menuConfig } from "../../../../config/contextMenu";

export const ContextMenuList = ({
    subType,
    type,
    treeType,
    updateContext,
    apiPath,
}) => {
    const focusedNodeType = subType || type || "default";
    const items = menuConfig[treeType]?.[focusedNodeType];
    if (!items) return null;

    return (
        <Menu.Content>
            {items.map((item, index) => {
                if (item.type === "separator") {
                    return <Menu.Separator key={`sep_${index}`} />;
                }
                return (
                    <Menu.Item
                        key={item.key}
                        value={item.key}
                        {...item.style}
                        onClick={() => {
                            item.action?.(apiPath);
                            updateContext({ visible: false });
                        }}
                    >
                        {item.icon?.()}
                        {item.label}
                    </Menu.Item>
                );
            })}
        </Menu.Content>
    );
};
