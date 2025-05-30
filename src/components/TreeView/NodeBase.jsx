import { NodeToggleBtn } from "./NodeToggleBtn";
import { icons } from "./NodeTypeIcon";
import { IndentLines } from "./IndentLines";
import { Badge } from "./Badge";
import { LuPiggyBank } from "react-icons/lu";
import { Icon, HStack } from "@chakra-ui/react";

function hasIgnoreAccessor(node) {
    while (node) {
        if (node.data.isIgnored) return true;
        node = node.parent;
    }
    return false;
}

export const NodeBase = ({ paddingLeft, node, errors, visual }) => {
    const { isLeaf, isOpen } = node;
    const { type, subType, isIgnored, isCutted } = node.data;

    const accessorIsIgnored = hasIgnoreAccessor(node);
    const TypeIcon = icons[type];
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
            <HStack w={"100%"}>
                {!isLeaf && (
                    <NodeToggleBtn
                        toggle={() => node.toggle()}
                        isOpen={isOpen}
                    />
                )}
                <HStack
                    w={"100%"}
                    pl={"2"}
                    {...(isCutted && { color: "fg.subtle" })}
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
                    {TypeIcon && <Icon as={TypeIcon} />}
                    <Badge
                        isIgnored={isCutted || accessorIsIgnored}
                        type={subType || type}
                    />
                    {visual}
                </HStack>
            </HStack>
            {errors}
        </HStack>
    );
};
