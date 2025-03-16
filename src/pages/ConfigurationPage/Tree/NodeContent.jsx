import { NodeEditInput } from "./NodeEditInput";
//import { NodeChooseVar } from "./NodeChooseVar";
import { icons, badges } from "../../../components/TreeView/DefaultView";
//import { memo } from "react";
import { Text } from "@chakra-ui/react";
import { useVariablesStore } from "../../../store/variables-store";
import { memo } from "react";

export const NodeContent = memo(
    function NodeContent({ node }) {
        const variableName = useVariablesStore(
            (state) => state.settings[node.data.name]?.name
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
                {icons[node.data.type]}
                {node.data.type === "protocol" ||
                node.data.type === "interface" ||
                node.data.type === "funcGroup" ||
                node.data.type === "asdu"
                    ? badges[node.data.subType] || badges[node.data.type]
                    : null}
                {node.isEditing ? (
                    <NodeEditInput node={node} />
                ) : (
                    <Text truncate>
                        {node.data.type === "dataObject"
                            ? variableName
                            : node.data.name}
                    </Text>
                )}
            </div>
        );
    },
    (prev, next) => {
        return (
            prev.node.data.name === next.node.data.name &&
            prev.node.data.type === next.node.data.type &&
            prev.node.data.subType === next.node.data.subType &&
            prev.node.isEditing === next.node.isEditing &&
            true
        );
    }
);
