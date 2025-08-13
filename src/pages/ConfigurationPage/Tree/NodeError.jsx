import { useValidationStore } from "@/store/validation-store";
import { Icon } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

export const NodeError = ({ id }) => {
    const validationErrors = useValidationStore((state) =>
        state.errorsTree.get(id)
    );
    const title = Array.from(validationErrors || []).map(([, validator]) =>
        Array.from(validator)
            .map(([, error]) => error.messages.map((m) => m).join("\n"))
            .join("\n")
    );

    return (
        validationErrors && (
            <Icon color={"fg.error"} as={LuTriangleAlert} title={title} />
        )
    );
};
