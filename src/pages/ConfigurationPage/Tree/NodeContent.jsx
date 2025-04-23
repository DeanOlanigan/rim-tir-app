import { NodeEditInput } from "./NodeEditInput";
import { Text } from "@chakra-ui/react";
import { useVariablesStore } from "../../../store/variables-store";
import { memo } from "react";
import { CONSTANT_VALUES } from "../../../config/constants";
import { DroppableInput } from "../InputComponents";

export const NodeContent = memo(function NodeContent({
    id,
    type,
    subType,
    name,
    isEditing,
    submit,
    reset,
}) {
    const variableName = useVariablesStore(
        (state) => state.settings[name]?.name
    );

    return isEditing ? (
        type === CONSTANT_VALUES.NODE_TYPES.dataObject ? (
            <DroppableInput
                targetKey={"variable"}
                id={id}
                submit={submit}
                reset={reset}
                forNode
            />
        ) : (
            <NodeEditInput name={name} submit={submit} reset={reset} />
        )
    ) : (
        <Text truncate>
            {type === CONSTANT_VALUES.NODE_TYPES.dataObject
                ? variableName
                : name}
        </Text>
    );
});
