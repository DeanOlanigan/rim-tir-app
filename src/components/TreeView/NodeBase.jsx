import { NodeToggleBtn } from "./NodeToggleBtn";
import { icons } from "./NodeTypeIcon";
import { IndentLines } from "./IndentLines";
import { Badge } from "./Badge";
import { LuBan } from "react-icons/lu";
import { Flex, Icon as ChakraIcon } from "@chakra-ui/react";

export const NodeBase = ({
    isLeaf,
    toggle,
    isOpen,
    paddingLeft,
    id,
    type,
    subType,
    isIgnored,
    children,
}) => {
    const Icon = icons[type];
    const ignoredStyle = {
        bg: "red.300",
        borderRadius: "md",
    };

    return (
        <>
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
                    <NodeToggleBtn toggle={() => toggle()} isOpen={isOpen} />
                )}
                <Flex
                    alignItems={"center"}
                    gap={"2"}
                    pl={"1"}
                    w={"100%"}
                    textWrap={"wrap"}
                    {...(isIgnored && ignoredStyle)}
                >
                    {isIgnored && (
                        <ChakraIcon
                            color={"red.500"}
                            strokeWidth={4}
                            size={"sm"}
                        >
                            <LuBan title="Ignored" />
                        </ChakraIcon>
                    )}
                    <div>{Icon && <Icon />}</div>
                    <Badge type={subType || type || null} id={id} />
                    {children}
                </Flex>
            </div>
        </>
    );
};
