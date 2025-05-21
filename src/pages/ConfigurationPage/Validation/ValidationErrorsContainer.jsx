import { Presence, Box } from "@chakra-ui/react";
import { useValidationStore } from "../../../store/validation-store";
import { ValidationAlert } from "./ValidationAlert";
import { ValidationContent } from "./ValidationContent";

export const ValidationErrorsContainer = () => {
    const errors = useValidationStore((state) => state.errors);
    const hasErrors = Object.keys(errors).length > 0;

    return (
        <Presence
            lazyMount
            unmountOnExit
            present={hasErrors}
            animationName={{ _open: "fade-in", _closed: "fade-out" }}
            animationDuration={"moderate"}
        >
            <Box
                position={"absolute"}
                top={12}
                left={["5vw", "calc(50% - 250px)"]}
                w={["90vw", "500px"]}
            >
                <ValidationAlert
                    title={
                        "Обнаружены ошибки, нажмите, чтобы увидеть подробности"
                    }
                    content={<ValidationContent errors={errors} />}
                />
            </Box>
        </Presence>
    );
};
