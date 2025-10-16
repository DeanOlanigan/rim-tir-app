import { useVariablesStore } from "@/store/variables-store";
import { Code, Text } from "@chakra-ui/react";
import { ComboboxInput } from "../../InputComponents";

export const DataObjectVisual = ({ node }) => {
    const name = useVariablesStore((state) => {
        const variableId = state.settings[node.id]?.setting?.variableId;
        return state.settings[variableId]?.name || "";
    });

    return node.isEditing ? (
        <ComboboxInput id={node.id} reset={() => node.reset()} />
    ) : (
        name && (
            <Code variant={"subtle"} colorPalette={"blue"} truncate>
                <Text truncate>{name}</Text>
            </Code>
        )
    );
};
