import { Button, Flex, Icon, Popover, Portal, Text } from "@chakra-ui/react";
import { LuArrowRight, LuDot, LuTriangleAlert } from "react-icons/lu";

export const NodeError = ({ validationErrors }) => {
    return (
        validationErrors && (
            <Popover.Root size={"xs"} lazyMount unmountOnExit>
                <Popover.Trigger asChild>
                    <Button
                        colorPalette={"red"}
                        variant={"surface"}
                        size={"2xs"}
                        rounded={"md"}
                    >
                        <Icon as={LuTriangleAlert} />
                        Обнаружены ошибки узла
                        <Icon as={LuArrowRight} />
                    </Button>
                </Popover.Trigger>
                <Portal>
                    <Popover.Positioner>
                        <Popover.Content
                            w={"100%"}
                            colorPalette={"red"}
                            bg={"bg.error/40"}
                            backdropFilter={"blur(4px)"}
                            borderColor={"red.muted"}
                            borderStartWidth={"2px"}
                            borderEndWidth={"2px"}
                        >
                            <Popover.Body>
                                <Flex
                                    direction={"column"}
                                    gap={"2"}
                                    maxH={"110px"}
                                    overflow={"auto"}
                                >
                                    {Array.from(validationErrors).map(
                                        ([, e]) => (
                                            <Flex key={e.id} align={"center"}>
                                                <Icon size={"md"} as={LuDot} />
                                                <Text>{e.messages}</Text>
                                            </Flex>
                                        )
                                    )}
                                </Flex>
                            </Popover.Body>
                        </Popover.Content>
                    </Popover.Positioner>
                </Portal>
            </Popover.Root>
        )
    );
};
