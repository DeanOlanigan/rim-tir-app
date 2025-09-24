import { Icon } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

export const ErrorSign = ({ errors }) => {
    if (!errors) return null;
    const title = Array.from(errors)
        .map(([, error]) => error.messages)
        .flat()
        .join("\n");
    return (
        <Icon
            as={LuTriangleAlert}
            size={"sm"}
            color={"fg.error"}
            title={title}
        />
    );
};
