import { useVariablesStore } from "@/store/variables-store";
import { NodeEditInput } from "../NodeEditInput";
import { Text } from "@chakra-ui/react";

export const FolderView = ({ node }) => {
    const name = useVariablesStore((state) => {
        return state.settings[node.id]?.name || "";
    });

    return node.isEditing ? (
        <NodeEditInput
            name={name}
            submit={(value) => node.submit(value)}
            reset={() => node.reset()}
        />
    ) : (
        <Text truncate>{name}</Text>
    );
};
