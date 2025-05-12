import { Menu } from "@chakra-ui/react";
import { menuConfig } from "../../../../config/contextMenu";
import { LuBan, LuCheckCheck } from "react-icons/lu";
import { useVariablesStore } from "../../../../store/variables-store";
import { ALLOWED_PARENTS } from "../../../../config/constants";

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
                let disabled = false;
                switch (item.type) {
                    case "separator":
                        return <Menu.Separator key={`sep_${index}`} />;
                    case "change-ignore":
                        if (apiPath.focusedNode.data.isIgnored === true) {
                            label = "Активировать";
                            icon = LuCheckCheck;
                        } else {
                            label = "Деактивировать";
                            icon = LuBan;
                        }
                        break;
                    case "paste-node":
                        disabled = getDisabledState(apiPath);
                        break;
                    case "copy-node":
                        disabled = getCopyDisabledState(apiPath);
                        break;
                    default:
                        break;
                }

                return (
                    <Menu.Item
                        key={item.type}
                        value={item.type}
                        disabled={disabled}
                        {...item.style}
                        onClick={() => {
                            if (!disabled) {
                                item.action?.(apiPath);
                                updateContext({ visible: false });
                            }
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

function getCopyDisabledState(apiPath) {
    const selected =
        apiPath.selectedNodes.length > 1
            ? apiPath.selectedNodes
            : apiPath.focusedNode;

    if (!selected || !Array.isArray(selected)) {
        return false;
    }

    return !selected.every(
        (node) => node?.data.type === selected[0]?.data.type
    );
}

// TODO НЕ РАБОТАЕТ НОРМАЛЬНО
function getDisabledState(apiPath) {
    const { copyBuffer, settings } = useVariablesStore.getState();
    const treeType = apiPath.props.treeType;

    if (copyBuffer.type !== treeType) return true;

    const sourceType = copyBuffer.tree[0].type;
    const targetType = apiPath.focusedNode?.data.type;

    if (treeType === "send" || treeType === "receive") {
        if (copyBuffer.tree.some((node) => node.type !== sourceType))
            return true;
        // ГОВНО
        const testId = copyBuffer.tree[0].id;
        const meaningNode = getMeaningNode(testId, settings);
        const focusedNode = getMeaningNode(
            apiPath.focusedNode?.data.id,
            settings
        );
        console.log(
            "focusedNode:",
            focusedNode?.subType || focusedNode?.type,
            "meaningNode:",
            meaningNode?.subType || meaningNode?.type
        );
        console.log(
            "type",
            apiPath.focusedNode?.data.type,
            copyBuffer.tree[0].type
        );
        console.log("canPaste", !canPaste(sourceType, focusedNode));

        if (focusedNode?.type !== meaningNode?.type) {
            return true;
        }

        if (
            sourceType === "folder" &&
            (targetType === "folder" || targetType === "dataObject")
        ) {
            return true;
        }
    }
    return false;
}

function firstRealParent(nodeId, settings) {
    let cur = settings[nodeId];
    while (cur && cur.type === "dataObject") cur = settings[cur.parentId];
    return cur?.type;
}

function canPaste(sourceType, targetContainerType) {
    return (
        !!targetContainerType &&
        ALLOWED_PARENTS[sourceType]?.includes(targetContainerType)
    );
}

function getMeaningNode(id, settings) {
    function recursive(id) {
        const node = settings[id];
        if (!node) return undefined;

        if (node.type === "folder" || node.type === "dataObject") {
            return recursive(node.parentId);
        } else {
            return node;
        }
    }
    return recursive(id);
}
