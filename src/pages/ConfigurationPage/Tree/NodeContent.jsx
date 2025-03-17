import { NodeEditInput } from "./NodeEditInput";
//import { NodeChooseVar } from "./NodeChooseVar";
import { icons, badges } from "../../../components/TreeView/DefaultView";
//import { memo } from "react";
import { Text } from "@chakra-ui/react";
import { useVariablesStore } from "../../../store/variables-store";
import { memo } from "react";

export const NodeContent = memo(function NodeContent({
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
            {type === "protocol" ||
            type === "interface" ||
            type === "funcGroup" ||
            type === "asdu"
                ? badges[subType] || badges[type]
                : null}
            {isEditing ? (
                <NodeEditInput name={name} submit={submit} reset={reset} />
            ) : (
                <Text truncate>
                    {type === "dataObject" ? variableName : name}
                </Text>
            )}
        </div>
    );
});
