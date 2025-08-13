import { Popover, Portal, Button, Icon } from "@chakra-ui/react";
import { useValidationStore } from "@/store/validation-store";
import { ValidationContent } from "./ValidationContent";
import { LuArrowRight, LuTriangleAlert } from "react-icons/lu";

export const ValidationErrorsContainer = () => {
    const errorsTree = useValidationStore((state) => state.errorsTree);
    if (!errorsTree || errorsTree.size === 0) return null;

    return (
        <Popover.Root size={"xs"} lazyMount unmountOnExit>
            <Popover.Trigger asChild>
                <Button
                    colorPalette={"red"}
                    variant="subtle"
                    size="2xs"
                    rounded="md"
                    shadow="md"
                >
                    <Icon as={LuTriangleAlert} />
                    Показать ошибки
                    <Icon as={LuArrowRight} />
                </Button>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content
                        w={"100%"}
                        colorPalette={"red"}
                        boxShadow={"xl"}
                        bg={"bg.error/40"}
                        backdropFilter={"blur(4px)"}
                        borderColor={"fg.error"}
                        borderStartWidth={"3px"}
                        borderEndWidth={"3px"}
                    >
                        <Popover.Body>
                            <ValidationContent errors={errorsTree} />
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
