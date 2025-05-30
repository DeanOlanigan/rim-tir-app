import { useValidationStore } from "@/store/validation-store";
import { Icon } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

export const NodeError = ({ id }) => {
    const validationErrors = useValidationStore((state) => state.errors?.[id]);

    return (
        validationErrors && (
            <Icon
                color={"fg.error"}
                as={LuTriangleAlert}
                title={Object.values(Object.values(validationErrors)[0])
                    .flat()
                    .join("\n")}
            />
        )
    );
};
