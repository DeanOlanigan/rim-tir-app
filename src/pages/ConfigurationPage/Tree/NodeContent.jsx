import { NodeEditInput } from "./NodeEditInput";
import { Icon, Text } from "@chakra-ui/react";
import { useVariablesStore } from "@/store/variables-store";
import { memo } from "react";
import { CONSTANT_VALUES } from "@/config/constants";
import { DroppableInput } from "@/pages/ConfigurationPage/InputComponents";
import { LuTriangleAlert } from "react-icons/lu";
import { useValidationStore } from "@/store/validation-store";

export const NodeContent = memo(function NodeContent({ node }) {
    const { isEditing } = node;
    const { id, type, /* subType, */ name } = node.data;

    const variableName = useVariablesStore(
        (state) => state.settings[name]?.name
    );

    const testAddress = useVariablesStore(
        (state) => state.settings[id].setting?.modbusDoAddress
    );

    const validationErrors = useValidationStore((state) => state.errors?.[id]);

    return isEditing ? (
        type === CONSTANT_VALUES.NODE_TYPES.dataObject ? (
            <DroppableInput
                targetKey={"variable"}
                id={id}
                submit={(value) => node.submit(value)}
                reset={() => node.reset()}
                forNode
            />
        ) : (
            <NodeEditInput
                name={name}
                submit={(value) => node.submit(value)}
                reset={() => node.reset()}
            />
        )
    ) : (
        <>
            <Text truncate>
                {type === CONSTANT_VALUES.NODE_TYPES.dataObject
                    ? (testAddress || "???") + " " + (variableName || "")
                    : name}
            </Text>
            {validationErrors && (
                <Icon
                    color={"fg.error"}
                    as={LuTriangleAlert}
                    title={Object.values(Object.values(validationErrors)[0])
                        .flat()
                        .join("\n")}
                />
            )}
        </>
    );
});
