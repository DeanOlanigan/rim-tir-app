import { Menu } from "@chakra-ui/react";
import { menuConfig } from "../../../../config/contextMenu";
import { LuBan, LuCheckCheck } from "react-icons/lu";

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
                let icon = item.icon;
                let label = item.label;
                if (item.type === "separator") {
                    return <Menu.Separator key={`sep_${index}`} />;
                }
                if (item.type === "change-ignore") {
                    if (apiPath.focusedNode.data.isIgnored === true) {
                        label = "Активировать";
                        icon = LuCheckCheck;
                    } else {
                        label = "Деактивировать";
                        icon = LuBan;
                    }
                }
                return (
                    <Menu.Item
                        key={item.type}
                        value={item.type}
                        {...item.style}
                        onClick={() => {
                            item.action?.(apiPath);
                            updateContext({ visible: false });
                        }}
                    >
                        {icon?.()}
                        {label}
                    </Menu.Item>
                );
            })}
        </Menu.Content>
    );
};
