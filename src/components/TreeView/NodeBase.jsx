import { NodeToggleBtn } from "./NodeToggleBtn";
import { IndentLines } from "./IndentLines";
import { Badge } from "./Badge";
import { LuBan } from "react-icons/lu";
import { Icon, HStack } from "@chakra-ui/react";
import { iconsMap } from "@/config/icons";
import { configuratorConfig } from "@/store/configurator-config";
import { memo } from "react";

export const NodeBase = memo(function NodeBase({
    paddingLeft,
    node,
    errors,
    visual,
    isIgnored,
    isIgnoredAccessor,
    isCutted,
    params,
}) {
    const icon = configuratorConfig.nodePaths?.[node.data.path]?.icon;
    const color = configuratorConfig.nodePaths?.[node.data.path]?.color;
    const TypeIcon = iconsMap[icon];
    const shortname = configuratorConfig.nodePaths?.[node.data.path]?.shortname;
    const label = configuratorConfig.nodePaths?.[node.data.path]?.label;
    const accessorIsIgnoredStyle = isIgnoredAccessor && {
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
            h={"80%"}
            pe={"2"}
            {...accessorIsIgnoredStyle}
        >
            <IndentLines paddingLeft={paddingLeft} />
            <HStack w={"100%"}>
                {!node.isLeaf && (
                    <NodeToggleBtn
                        toggle={() => node.toggle()}
                        isOpen={node.isOpen}
                    />
                )}
                <HStack w={"100%"} pl={"2"} {...isCuttedStyle} minW={0}>
                    {isIgnored && (
                        <Icon
                            color={"red.400"}
                            strokeWidth={3}
                            as={LuBan}
                            title={"Заблокирован"}
                        />
                    )}
                    {TypeIcon && (
                        <Icon
                            as={TypeIcon}
                            color={
                                isCutted || isIgnoredAccessor
                                    ? "fg.subtle"
                                    : `${color}.500`
                            }
                        />
                    )}
                    {shortname && (
                        <Badge
                            isIgnored={isCutted || isIgnoredAccessor}
                            shortname={shortname}
                            label={label}
                            color={color}
                        />
                    )}
                    {params}
                    {visual}
                </HStack>
            </HStack>
            {errors}
        </HStack>
    );
});
