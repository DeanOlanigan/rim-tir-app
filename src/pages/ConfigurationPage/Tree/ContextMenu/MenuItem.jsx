import { Icon, Menu, Portal } from "@chakra-ui/react";
import { LuBan, LuCheckCheck, LuChevronRight } from "react-icons/lu";
import { iconsMap } from "@/config/icons";
import { useVariablesStore } from "@/store/variables-store";
import { getMeaningNode, getParentType } from "@/utils/utils";
import { CONNECTIONS_TREES, NODE_TYPES, TREE_TYPES } from "@/config/constants";

const sameMeaningPath = (apiPath, firstNodeId, settings) => {
    const focusedNodePath =
        apiPath.focusedNode?.data.type === NODE_TYPES.folder
            ? getParentType({ checkNode: apiPath?.focusedNode })
            : apiPath.focusedNode?.data?.path ?? "#";
    const meaningNodePath = getMeaningNode(firstNodeId, settings)?.path ?? null;
    return meaningNodePath && focusedNodePath === meaningNodePath;
};

const incompatibleDomains = (treeType, bufType) =>
    (treeType === TREE_TYPES.variables && CONNECTIONS_TREES.has(bufType)) ||
    (bufType === TREE_TYPES.variables && CONNECTIONS_TREES.has(treeType));

const differentRootTypes = (focusedId, clipboard) =>
    clipboard.cut && focusedId && (clipboard.ids ?? []).includes(focusedId);

function getDisabledState(apiPath) {
    const { clipboard, settings } = useVariablesStore.getState();
    const treeType = apiPath.props.treeType;

    if (!clipboard?.normalized || !clipboard.type) return true;

    if (incompatibleDomains(treeType, clipboard.type)) return true;

    const focusedId = apiPath.focusedNode?.data?.id;
    if (differentRootTypes(focusedId, clipboard)) return true;

    if (CONNECTIONS_TREES.has(treeType)) {
        const rootNodesIds = clipboard.roots || [];
        if (!rootNodesIds.length) return true;

        const nodes = clipboard.normalized;
        const firstNode = nodes[rootNodesIds[0]];
        const sourceType = firstNode?.type;
        if (!sourceType) return true;

        for (const id of rootNodesIds) {
            if (nodes[id].type !== sourceType) return true;
        }

        if (!sameMeaningPath(apiPath, rootNodesIds[0], settings)) return true;
    }
    return false;
}

export const MenuItem = ({
    item,
    index,
    apiPath,
    updateContext,
    resetTreeFocus = false,
}) => {
    if (!item) return null;
    const focusedId = apiPath.focusedNode?.id;
    const isIgnored =
        useVariablesStore.getState().settings[focusedId]?.isIgnored;

    if (item.type === "separator") {
        return <Menu.Separator key={`sep_${index}`} />;
    }
    let disabled = false,
        ContextIcon,
        iconColor,
        label;

    if (item.type === "ignore") {
        if (isIgnored) {
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
                                    resetTreeFocus={resetTreeFocus}
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
                    resetTreeFocus && apiPath.deselectAll();
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
