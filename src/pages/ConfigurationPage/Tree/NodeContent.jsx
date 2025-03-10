import { NodeEditInput } from "./NodeEditInput";
//import { NodeChooseVar } from "./NodeChooseVar";
import { icons, badges } from "../../../components/TreeView/DefaultView";
import { memo } from "react";
import { Text } from "@chakra-ui/react";

const NodeContent = ({ node }) => {
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
                    {node.data.name || node.data.setting?.variable}
                </Text>
            )}
        </div>
    );
};
export default memo(NodeContent);
