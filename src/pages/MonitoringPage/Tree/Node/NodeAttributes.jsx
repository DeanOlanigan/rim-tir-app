import { memo } from "react";
import { useLiveValue } from "../../store/mqtt-stream-store";
import { attributes } from "../../setValue/Attributes/attributes";
import { Icon } from "@chakra-ui/react";
import { LuCircle } from "react-icons/lu";

export const NodeAttributes = memo(function NodeAttributes({ id }) {
    const live = useLiveValue(id);

    return (
        <>
            {attributes.map(
                (attr) =>
                    attr?.icon?.as &&
                    live?.quality?.attributes?.includes(attr.name) && (
                        <Icon
                            key={attr.name}
                            size={"md"}
                            {...attr.icon}
                            aria-hidden
                            title={attr.label}
                        />
                    ),
            )}
            <Icon
                as={LuCircle}
                fill={
                    live?.quality?.attributes?.includes("used")
                        ? "fg.success"
                        : "fg.error"
                }
            />
        </>
    );
});
