import { useVariablesStore } from "@/store/variables-store";
import { NodeEditInput } from "../NodeEditInput";
import { BaseVisual } from "./BaseVisual";

export const VariableVisual = ({ node }) => {
    const name = useVariablesStore((state) => {
        return state.settings[node.id]?.name || "";
    });

    return (
        <BaseVisual
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
