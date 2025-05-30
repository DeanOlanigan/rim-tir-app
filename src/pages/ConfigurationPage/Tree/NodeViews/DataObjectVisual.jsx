import { useParamValues } from "@/hooks/useParamValues";
import { useVariablesStore } from "@/store/variables-store";
import { Code } from "@chakra-ui/react";
import { DroppableInput } from "../../InputComponents";
import { BaseVisual } from "./BaseVisual";

export const DataObjectVisual = ({ node }) => {
    const name = useVariablesStore((state) => {
        const variableId = state.settings[node.id]?.variableId;
        return state.settings[variableId]?.name || "";
    });

    const paramValues = useParamValues(node.id);

    return (
        <BaseVisual
            paramValues={paramValues}
            name={name}
            isEditing={node.isEditing}
            editor={
                <DroppableInput
                    targetKey={"variable"}
                    id={node.id}
                    submit={(value) => node.submit(value)}
                    reset={() => node.reset()}
                    forNode
                />
            }
            nameRenderer={(name) => (
                <Code variant={"subtle"} colorPalette={"blue"}>
                    {name}
                </Code>
            )}
        />
    );
};
