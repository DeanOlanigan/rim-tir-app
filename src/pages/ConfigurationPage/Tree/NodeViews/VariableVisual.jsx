import { useVariablesStore } from "@/store/variables-store";
import { NodeEditInput } from "../NodeEditInput";
import { BaseVisual } from "./BaseVisual";
import { useGetParameters } from "./getParameters";

export const VariableVisual = ({ node }) => {
    const name = useVariablesStore((state) => {
        return state.settings[node.id]?.name || "";
    });
    const paramValues = useGetParameters(node);

    return (
        <BaseVisual
            paramValues={paramValues}
            name={name}
            isEditing={node.isEditing}
            editor={
                <NodeEditInput
                    name={name}
                    submit={(value) => node.submit(value)}
                    reset={() => node.reset()}
                />
            }
        />
    );
};
