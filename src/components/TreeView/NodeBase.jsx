import { NodeToggleBtn } from "./NodeToggleBtn";
import { icons } from "./NodeTypeIcon";
import { IndentLines } from "./IndentLines";
import { Badge } from "./Badge";
import { LuBan, LuPiggyBank } from "react-icons/lu";
import { Flex, Icon as ChakraIcon } from "@chakra-ui/react";

export const NodeBase = ({ paddingLeft, node, children }) => {
    const { isLeaf, isOpen } = node;
    const { id, type, subType, isIgnored, isCutted } = node.data;

    const Icon = icons[type];

    const accessorisIgnored = hasIgnoreAccessor(node);

    return (
        <Flex
            w={"100%"}
            h={"90%"}
            borderRadius={"md"}
            px={"2"}
            {...(accessorisIgnored && {
                bg: "bg.muted",
                color: "fg.subtle",
            })}
        >
            <IndentLines paddingLeft={paddingLeft} />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    width: "100%",
                }}
            >
                {isLeaf ? null : (
                    <NodeToggleBtn
                        toggle={() => node.toggle()}
                        isOpen={isOpen}
                    />
                )}
                <Flex
                    alignItems={"center"}
                    gap={"2"}
                    pl={"1"}
                    w={"100%"}
                    textWrap={"wrap"}
                    {...(isCutted && { color: "fg.subtle" })}
                    colorPalette={"gray"}
                >
                    {isIgnored && (
                        <ChakraIcon
                            color={"red.400"}
                            strokeWidth={2}
                            size={"lg"}
                            as={LuPiggyBank}
                            title={"Заблокирован"}
                        />
                    )}
                    <div>{Icon && <Icon />}</div>
                    <Badge
                        isIgnored={isIgnored || isCutted || accessorisIgnored}
                        type={subType || type || null}
                        id={id}
                    />
                    {children}
                </Flex>
            </div>
        </Flex>
    );
};

function hasIgnoreAccessor(node) {
    if (node.data.isIgnored) return true;
    if (node.parent) return hasIgnoreAccessor(node.parent);
    return false;
}
