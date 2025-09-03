import { NodeToggleBtn } from "./NodeToggleBtn";
import { IndentLines } from "./IndentLines";
import { Badge } from "./Badge";
import { LuPiggyBank } from "react-icons/lu";
import { Icon, HStack } from "@chakra-ui/react";
import { iconsMap } from "@/config/icons";
import { configuratorConfig } from "@/utils/configurationParser";
import { ParamViewer } from "./ParamViewer";
import { NODE_TYPES } from "@/config/constants";

function hasIgnoreAccessor(node) {
    while (node) {
        if (node.data.isIgnored) return true;
        node = node.parent;
    }
    return false;
}

export const NodeBase = ({ paddingLeft, node, errors, visual }) => {
    const accessorIsIgnored = hasIgnoreAccessor(node);
    const icon = configuratorConfig.nodePaths[node.data.path]?.icon;
    const TypeIcon = iconsMap[icon?.name];
    const iconColor = icon?.color;
    const shortName = configuratorConfig.nodePaths[node.data.path]?.shortName;
    const label = configuratorConfig.nodePaths[node.data.path]?.label;

    return (
        <HStack
            w={"100%"}
            borderRadius={"md"}
            pe={"2"}
            {...(accessorIsIgnored && {
                bg: "bg.muted",
                color: "fg.subtle",
                colorPalette: "gray",
            })}
        >
            <IndentLines paddingLeft={paddingLeft} />
            <HStack w={"100%"} minW={0} truncate>
                {!node.isLeaf && (
                    <NodeToggleBtn
                        toggle={() => node.toggle()}
                        isOpen={node.isOpen}
                    />
                )}
                <HStack
                    w={"100%"}
                    pl={"2"}
                    {...(node.data.isCutted && { color: "fg.subtle" })}
                    minW={0}
                    truncate
                >
                    {node.data.isIgnored && (
                        <Icon
                            color={"red.400"}
                            strokeWidth={2}
                            size={"lg"}
                            as={LuPiggyBank}
                            title={"Заблокирован"}
                        />
                    )}
                    {TypeIcon && (
                        <Icon as={TypeIcon} color={`${iconColor}.500`} />
                    )}
                    {shortName && (
                        <Badge
                            isIgnored={node.data.isCutted || accessorIsIgnored}
                            shortName={shortName}
                            label={label}
                            color={iconColor}
                        />
                    )}
                    <ParamViewer
                        id={node.id}
                        path={node.data.path}
                        isVariable={node.data.type === NODE_TYPES.variable}
                    />
                    {visual}
                </HStack>
            </HStack>
            {errors}
        </HStack>
    );
};
