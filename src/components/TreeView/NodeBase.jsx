import { NodeToggleBtn } from "./NodeToggleBtn";
import { icons } from "./NodeTypeIcon";
import { IndentLines } from "./IndentLines";
import { Badge } from "./Badge";
import { LuBan, LuPiggyBank } from "react-icons/lu";
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
    isCutted,
    children,
}) => {
    const Icon = icons[type];
    const ignoredStyle = {
        color: "fg.subtle",
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
                    {...((isIgnored || isCutted) && ignoredStyle)}
                    colorPalette={"gray"}
                >
                    {isIgnored && (
                        <ChakraIcon
                            color={"red.400"}
                            strokeWidth={2}
                            size={"lg"}
                            as={LuPiggyBank}
                            title={"Деактивирован"}
                        />
                    )}
                    <div>{Icon && <Icon />}</div>
                    <Badge
                        isIgnored={isIgnored || isCutted}
                        type={subType || type || null}
                        id={id}
                    />
                    {children}
                </Flex>
            </div>
        </>
    );
};
