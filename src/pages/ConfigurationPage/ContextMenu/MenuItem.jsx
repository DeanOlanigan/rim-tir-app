import { Icon, Menu, Portal } from "@chakra-ui/react";
import { LuBan, LuCheckCheck, LuChevronRight } from "react-icons/lu";
import { iconsMap } from "@/config/icons";
import { useVariablesStore } from "@/store/variables-store";
import { getDisabledState } from "@/utils/getDisabledState";
import { HOSTKEYS } from "@/config/constants";
import { actionsMap } from "./actions";

export const MenuItem = ({
    item,
    index,
    apiPath,
    updateContext,
    resetTreeFocus = false,
}) => {
    if (!item) return null;
    const treeType = apiPath.props.treeType;
    const focusedId = apiPath.focusedNode?.id;
    const ctx = useVariablesStore.getState();
    const isIgnored = ctx.settings[focusedId]?.isIgnored;

    if (item.type === "separator") {
        return <Menu.Separator key={`sep_${index}`} />;
    }
    let disabled = false,
        ContextIcon,
        iconColor,
        label;

    if (item.type === "ignore") {
        if (isIgnored) {
            label = "Использовать";
            ContextIcon = LuCheckCheck;
            iconColor = "fg.success";
            item.style = {
                color: "fg.success",
                _hover: { bg: "bg.success", color: "fg.success" },
            };
        } else {
            label = "Игнорировать";
            ContextIcon = LuBan;
            iconColor = "fg.error";
            item.style = {
                color: "fg.error",
                _hover: { bg: "bg.error", color: "fg.error" },
            };
        }
    } else {
        ContextIcon = iconsMap[item.icon.name];
        iconColor = `${item.icon.color}.500`;
        label = item.label;
    }

    if (item.type === "paste") {
        disabled = getDisabledState(ctx, focusedId, treeType);
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
                    const fn = actionsMap[item.action];
                    if (!fn) {
                        console.warn(
                            "[context menu] unknown action:",
                            item.action,
                            item,
                        );
                        return;
                    }
                    fn(apiPath, item);
                    updateContext("cfg", { visible: false });
                }
            }}
        >
            <Icon as={ContextIcon} color={iconColor} />
            {label}
            <Menu.ItemCommand>{HOSTKEYS[item.type]}</Menu.ItemCommand>
        </Menu.Item>
    );
};
