import { Menu } from "@chakra-ui/react";
import { menuConfig } from "../../../../config/contextMenu";
import { LuBan, LuCheckCheck } from "react-icons/lu";
import { useVariablesStore } from "../../../../store/variables-store";

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

    if (treeType === "send" || treeType === "receive") {
        if (copyBuffer.tree.some((node) => node.type !== sourceType))
            return true;

        // Получить тип узла, на котором контекстное меню
        const focusedNodeType =
            apiPath.focusedNode?.data.subType || apiPath.focusedNode?.data.type;
        const focusedNodeTypeF = getMeaningFocusedNode(apiPath);

        // Получить значимый тип из иерархии копируемого узла
        const meaningNode = getMeaningNode(copyBuffer.tree[0].id, settings);
        const meaningNodeType = meaningNode?.subType || meaningNode?.type;

        console.log("focusedNodeType", focusedNodeType);
        console.log("focusedNodeTypeF", focusedNodeTypeF);
        console.log("meaningNodeType", meaningNodeType);

        if (focusedNodeTypeF !== meaningNodeType) {
            return true;
        }

        if (
            sourceType === "folder" &&
            (focusedNodeType === "folder" || focusedNodeType === "dataObject")
        ) {
            return true;
        }
    }
    return false;
}

function getMeaningNode(id, settings) {
    function recursive(id) {
        const node = settings[settings[id].parentId];
        if (!node) return undefined;

        if (node.type === "folder" || node.type === "dataObject") {
            return recursive(node.id);
        } else {
            return node;
        }
    }
    return recursive(id);
}

function getMeaningFocusedNode(apiPath) {
    function recursive(node) {
        if (!node || !node.data) return undefined;
        if (node.data.type === "folder" || node.data.type === "dataObject") {
            return recursive(node.parent);
        } else {
            return node;
        }
    }
    const node = apiPath.focusedNode;
    const res = recursive(node);
    return res?.data?.subType || res?.data?.type;
}
