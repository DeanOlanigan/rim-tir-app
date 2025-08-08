import { Menu } from "@chakra-ui/react";
import { getBaseItems } from "./baseItems";
import { MenuItem } from "./MenuItem";

export const ContextMenuList = ({ apiPath, type, subType, updateContext }) => {
    const baseItems = getBaseItems(apiPath);
    if (!baseItems) return null;

    return (
        <Menu.Content>
            {baseItems.map((item, index) => (
                <MenuItem
                    key={index}
                    item={item}
                    index={index}
                    apiPath={apiPath}
                    updateContext={updateContext}
                />
            ))}
        </Menu.Content>
    );
};
