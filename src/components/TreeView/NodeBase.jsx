import { NodeToggleBtn } from "./NodeToggleBtn";
import { IndentLines } from "./IndentLines";
import { Badge } from "./Badge";
import { LuPiggyBank } from "react-icons/lu";
import { Icon, HStack } from "@chakra-ui/react";
import { iconsMap } from "@/config/icons";
import { configuratorConfig } from "@/utils/configurationParser";
import { ParamViewer } from "./ParamViewer";
import { NODE_TYPES } from "@/config/constants";
import { memo } from "react";

export const NodeBase = memo(function NodeBase({
    paddingLeft,
    node,
    errors,
    visual,
    isIgnored,
    accessorIsIgnored,
    isCutted,
    settings,
}) {
    const icon = configuratorConfig.nodePaths[node.data.path]?.icon;
    const TypeIcon = iconsMap[icon?.name];
    const iconColor = icon?.color;
    const shortName = configuratorConfig.nodePaths[node.data.path]?.shortName;
    const label = configuratorConfig.nodePaths[node.data.path]?.label;
    const accessorIsIgnoredStyle = accessorIsIgnored && {
        bg: "bg.muted",
        color: "fg.subtle",
        colorPalette: "gray",
    };
    const isCuttedStyle = isCutted && {
        color: "fg.subtle",
        fontStyle: "italic",
    };

    return (
        <HStack
            w={"100%"}
            borderRadius={"md"}
            pe={"2"}
            {...accessorIsIgnoredStyle}
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
                    {...isCuttedStyle}
                    minW={0}
                    truncate
                >
                    {isIgnored && (
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
                            isIgnored={isCutted || accessorIsIgnored}
                            shortName={shortName}
                            label={label}
                            color={iconColor}
                        />
                    )}
                    <ParamViewer
                        settings={settings}
                        path={node.data.path}
                        isVariable={node.data.type === NODE_TYPES.variable}
                    />
                    {visual}
                </HStack>
            </HStack>
            {errors}
        </HStack>
    );
});
