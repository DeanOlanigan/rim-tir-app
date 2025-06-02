import { Menu, Portal } from "@chakra-ui/react";
import { menuConfig } from "@/config/contextMenu";
import { LuBan, LuCheckCheck, LuChevronRight } from "react-icons/lu";
import { useVariablesStore } from "@/store/variables-store";
import { CONSTANT_VALUES } from "@/config/constants";
import { getParentType } from "@/utils/utils";

export const ContextMenuList = ({ apiPath, type, subType, updateContext }) => {
    const focusedNodeType =
        type === CONSTANT_VALUES.NODE_TYPES.root
            ? CONSTANT_VALUES.NODE_TYPES.root
            : subType || type || CONSTANT_VALUES.NODE_TYPES.root;
    const treeType = apiPath.props.treeType;
    const items = menuConfig[treeType]?.[focusedNodeType];
    if (!items) return null;

    return (
        <Menu.Content>
            {items.map((item, index) => {
                return renderMenuItem(item, index, apiPath, updateContext);
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

    // Проверяем, что все выбранные узлы одного типа
    // TODO Можно избавиться от этой проверки, если будем принудительно не давать выбирать узлы разных типов
    return !selected.every(
        (node) => node?.data.type === selected[0]?.data.type
    );
}

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
        const focusedNodeTypeF = getParentType({
            checkNode: apiPath?.focusedNode,
        });

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

// TODO Эта функция должна быть в utils.js
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

function renderMenuItem(item, index, apiPath, updateContext) {
    if (!item) return null;

    if (item.type === "separator") {
        return <Menu.Separator key={`sep_${index}`} />;
    }

    let icon = item.icon;
    let label = item.label;
    let disabled = false;

    if (item.type === "change-ignore") {
        if (apiPath.focusedNode?.data?.isIgnored) {
            label = "Разблокировать";
            icon = LuCheckCheck;
        } else {
            label = "Заблокировать";
            icon = LuBan;
        }
    }

    if (item.type === "paste-node") {
        disabled = getDisabledState(apiPath);
    }

    if (item.type === "copy-node") {
        disabled = getCopyDisabledState(apiPath);
    }

    if (item.children && Array.isArray(item.children)) {
        return (
            <Menu.Root key={`submenu_${index}`}>
                <Menu.TriggerItem disabled={disabled}>
                    {icon?.()} {label} <LuChevronRight />
                </Menu.TriggerItem>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content>
                            {item.children.map((item, index) =>
                                renderMenuItem(
                                    item,
                                    index,
                                    apiPath,
                                    updateContext
                                )
                            )}
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        );
    }

    return (
        <Menu.Item
            key={item.type || `item_${index}`}
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
            {icon?.()} {label}
        </Menu.Item>
    );
}
