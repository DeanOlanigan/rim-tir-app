import { Icon, Menu, Portal } from "@chakra-ui/react";
import { LuBan, LuCheckCheck, LuChevronRight } from "react-icons/lu";
import { iconsMap } from "@/config/icons";
import { useVariablesStore } from "@/store/variables-store";
import { getMeaningNode, getParentType } from "@/utils/utils";

function getDisabledState(apiPath) {
    const { copyBuffer, settings } = useVariablesStore.getState();
    const treeType = apiPath.props.treeType;

    if (copyBuffer.type !== treeType) return true;

    const sourceType = copyBuffer.tree[0].type;

    if (treeType === "send" || treeType === "receive") {
        if (copyBuffer.tree.some((node) => node.type !== sourceType))
            return true;

        const focusedNodePath =
            apiPath.focusedNode?.data.type === "folder"
                ? getParentType({ checkNode: apiPath?.focusedNode })
                : apiPath.focusedNode?.data.path || "#";
        const meaningNode = getMeaningNode(copyBuffer.tree[0].id, settings);
        const meaningNodePath = meaningNode.path;

        console.log(focusedNodePath, meaningNodePath);
        if (focusedNodePath !== meaningNodePath) return true;
    }
    return false;
}

export const MenuItem = ({ item, index, apiPath, updateContext }) => {
    if (!item) return null;

    if (item.type === "separator") {
        return <Menu.Separator key={`sep_${index}`} />;
    }
    let disabled = false,
        ContextIcon,
        iconColor,
        label;

    if (item.type === "ignore") {
        if (apiPath.focusedNode?.data?.isIgnored) {
            label = "Разблокировать";
            ContextIcon = LuCheckCheck;
            iconColor = "fg.success";
            item.style = {
                color: "fg.success",
                _hover: { bg: "bg.success", color: "fg.success" },
            };
        } else {
            label = "Заблокировать";
            ContextIcon = LuBan;
            iconColor = "fg.error";
            item.style = {
                color: "fg.error",
                _hover: { bg: "bg.error", color: "fg.error" },
            };
        }
    } else {
        ContextIcon = iconsMap[item.icon.name];
        iconColor = item.icon.color;
        label = item.label;
    }

    if (item.type === "paste") {
        disabled = getDisabledState(apiPath);
    }

    if (item.children && Array.isArray(item.children)) {
        return (
            <Menu.Root key={`submenu_${index}`} size={"sm"}>
                <Menu.TriggerItem disabled={disabled}>
                    <Icon as={ContextIcon} color={iconColor} />
                    {label}
                    <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            {item.children.map((item, index) => (
                                <MenuItem
                                    key={`${item.type}_${item.node}_${item.count}`}
                                    item={item}
                                    index={index}
                                    apiPath={apiPath}
                                    updateContext={updateContext}
                                />
                            ))}
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        );
    }

    return (
        <Menu.Item
            value={`${item.type}_${item.node}_${item.count}`}
            disabled={disabled}
            {...item.style}
            onClick={() => {
                if (!disabled) {
                    /* dispatchAction[item.type]?.({
                        node: item.node,
                        count: item.count,
                        path: item.path,
                        treeApi: apiPath,
                    }); */
                    item.action?.(apiPath);
                    updateContext({ visible: false });
                }
            }}
        >
            <Icon as={ContextIcon} color={iconColor} />
            {label}
        </Menu.Item>
    );
};
