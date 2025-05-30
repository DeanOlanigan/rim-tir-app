import { useParamValues } from "@/hooks/useParamValues";
import { useVariablesStore } from "@/store/variables-store";
import { NodeEditInput } from "../NodeEditInput";
import { BaseVisual } from "./BaseVisual";

export const DefaultVisual = ({ node }) => {
    const name = useVariablesStore((state) => {
        return state.settings[node.id]?.name || "";
    });

    const paramValues = useParamValues(node.id);

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
