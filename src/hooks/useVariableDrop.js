import { useDrop } from "react-dnd";
import { useVariablesStore } from "@/store/variables-store";

export function useVariableDrop({ id }) {
    const settings = useVariablesStore((state) => state.settings);
    const { bindVariable, unbindVariable } = useVariablesStore(
        (state) => state
    );

    const [{ isOver, canDrop }, dropRef] = useDrop(
        () => ({
            accept: "NODE",
            canDrop: (item) => {
                return (
                    settings[item.id]?.type === "variable" &&
                    !settings[item.id]?.usedIn
                );
            },
            drop: (item) => {
                console.log("DROP", item);
                unbindVariable(id);
                bindVariable(id, item.id);
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }),
        [id, settings, bindVariable, unbindVariable]
    );
    return { isOver, canDrop, dropRef };
}
