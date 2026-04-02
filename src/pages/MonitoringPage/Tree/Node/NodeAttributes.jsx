import { memo } from "react";
import { useLiveValue } from "../../store/mqtt-stream-store";
import { attributes } from "../../setValue/Attributes/attributes";
import { Icon } from "@chakra-ui/react";
import { LuCircle } from "react-icons/lu";

export const NodeAttributes = memo(function NodeAttributes({ id }) {
    const live = useLiveValue(id);

    return (
        <>
            {live?.quality?.attributes?.map((attr) => {
                const attribute = attributes[attr];
                if (!attribute) return null;
                return (
                    <Icon
                        key={attribute.name}
                        size={"md"}
                        {...attribute.icon}
                        aria-hidden
                        title={attribute.label}
                    />
                );
            })}
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
