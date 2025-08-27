import { useVariablesStore } from "@/store/variables-store";
import { Code } from "@chakra-ui/react";
import { BaseVisual } from "./BaseVisual";
import { useGetParameters } from "./getParameters";
import { ComboboxInput } from "../../InputComponents";

export const DataObjectVisual = ({ node }) => {
    const name = useVariablesStore((state) => {
        const variableId = state.settings[node.id]?.setting?.variableId;
        return state.settings[variableId]?.name || "";
    });
    const paramValues = useGetParameters(node);

    return (
        <BaseVisual
            paramValues={paramValues}
            name={name}
            isEditing={node.isEditing}
            editor={<ComboboxInput id={node.id} reset={() => node.reset()} />}
            nameRenderer={(name) => (
                <Code variant={"subtle"} colorPalette={"blue"}>
                    {name}
                </Code>
            )}
        />
    );
};
