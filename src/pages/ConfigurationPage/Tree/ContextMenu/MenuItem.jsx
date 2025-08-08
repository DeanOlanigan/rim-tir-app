import { Icon, Menu, Portal } from "@chakra-ui/react";
import { LuBan, LuCheckCheck, LuChevronRight } from "react-icons/lu";
import { iconsMap } from "@/config/icons";
import { useVariablesStore } from "@/store/variables-store";

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
            apiPath.focusedNode?.data.subType ||
            apiPath.focusedNode?.data.type ||
            treeType;
        let focusedNodeTypeF;
        if (focusedNodeType === treeType) {
            focusedNodeTypeF = treeType;
        } else {
            focusedNodeTypeF = getParentType({
                checkNode: apiPath?.focusedNode,
            });
        }

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

    if (item.type === "copy") {
        disabled = getCopyDisabledState(apiPath);
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
