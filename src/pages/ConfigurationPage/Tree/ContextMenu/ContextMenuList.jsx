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
                if (item.type === "paste-node") {
                    disabled = getDisabledState(apiPath);
                }

                return (
                    <Menu.Item
                        key={item.type}
                        value={item.type}
                        disabled={disabled}
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

function getDisabledState(apiPath) {
    const copyBuffer = useVariablesStore.getState().copyBuffer;
    const settings = useVariablesStore.getState().settings;
    const treeType = apiPath.props.treeType;

    if (copyBuffer.type !== treeType) {
        return true;
    }
    if (treeType === "send" || treeType === "receive") {
        if (
            copyBuffer.tree.some(
                (node) => node.type !== copyBuffer.tree[0].type
            )
        )
            return true;

        const testId = copyBuffer.tree[0].id;
        const meaningNode = getMeaningNode(testId, settings);
        const focusedNode = getMeaningNode(
            apiPath.focusedNode.data.id,
            settings
        );
        console.log(
            "focusedNode:",
            focusedNode.subType || focusedNode.type,
            "meaningNode:",
            meaningNode.subType || meaningNode.type
        );
        console.log(
            "type",
            apiPath.focusedNode.data.type,
            copyBuffer.tree[0].type
        );
        // TODO Неполная проверка узлов при вставке в узлы соединений
        return !(focusedNode.type === meaningNode.type);
    }
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
