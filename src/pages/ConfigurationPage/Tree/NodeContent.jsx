import { NodeEditInput } from "./NodeEditInput";
import { icons, badges } from "../../../components/TreeView/DefaultView";
//import { memo } from "react";
import { Badge, Text } from "@chakra-ui/react";
import { useVariablesStore } from "../../../store/variables-store";
import { memo } from "react";
import { CONSTANT_VALUES } from "../../../config/constants";

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

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                paddingLeft: "5px",
                textWrap: "nowrap",
            }}
        >
            {icons[type]}
            {type === CONSTANT_VALUES.NODE_TYPES.protocol ||
            type === CONSTANT_VALUES.NODE_TYPES.interface ||
            type === CONSTANT_VALUES.NODE_TYPES.interface ||
            type === CONSTANT_VALUES.NODE_TYPES.asdu
                ? badges[subType] || badges[type]
                : null}
            {type === CONSTANT_VALUES.NODE_TYPES.dataObject && (
                <Badge variant={"outline"}>{id.slice(0, 8)}</Badge>
            )}
            {isEditing ? (
                <NodeEditInput name={name} submit={submit} reset={reset} />
            ) : (
                <Text truncate>
                    {type === CONSTANT_VALUES.NODE_TYPES.dataObject
                        ? variableName
                        : name}
                </Text>
            )}
        </div>
    );
});
