import { Popover, Portal, Button } from "@chakra-ui/react";
import { useValidationStore } from "@/store/validation-store";
import { ValidationContent } from "./ValidationContent";
import { LuTriangleAlert } from "react-icons/lu";

export const ValidationErrorsContainer = () => {
    const errors = useValidationStore((state) => state.errors);
    const hasErrors = Object.keys(errors).length > 0;
    if (!hasErrors) {
        return null;
    }

    return (
        <Popover.Root lazyMount unmountOnExit>
            <Popover.Trigger asChild>
                <Button
                    colorPalette={"red"}
                    variant="subtle"
                    size="2xs"
                    rounded="md"
                    shadow="md"
                >
                    <LuTriangleAlert />
                    Показать ошибки
                </Button>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content
                        w={"450px"}
                        colorPalette={"red"}
                        boxShadow={"xl"}
                        bg={"bg.error/40"}
                        backdropFilter={"blur(4px)"}
                        borderColor={"fg.error"}
                        borderStartWidth={"3px"}
                        borderEndWidth={"3px"}
                    >
                        <Popover.Body>
                            <ValidationContent errors={errors} />
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};
