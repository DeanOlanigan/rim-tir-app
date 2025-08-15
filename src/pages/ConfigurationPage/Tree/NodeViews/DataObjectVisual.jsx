import { useVariablesStore } from "@/store/variables-store";
import { Code } from "@chakra-ui/react";
import { BaseVisual } from "./BaseVisual";
import { useGetParameters } from "./getParameters";

export const DataObjectVisual = ({ node }) => {
    const name = useVariablesStore((state) => {
        const variableId = state.settings[node.id]?.variableId;
        return state.settings[variableId]?.name || "";
    });
    const paramValues = useGetParameters(node);

    return (
        <BaseVisual
            paramValues={paramValues}
            name={name}
            isEditing={node.isEditing}
            editor={null}
            nameRenderer={(name) => (
                <Code variant={"subtle"} colorPalette={"blue"}>
                    {name}
                </Code>
            )}
        />
    );
};
