import { useVariablesStore } from "../store/variables-store";
import { getParentTypeNormalized } from "../utils/utils";
import { selectSelectedData } from "../store/selectors";
import { useMemo } from "react";

export function useSelectedData(type) {
    const settings = useVariablesStore((state) => state.settings);
    const selectedIds = useVariablesStore((state) => state.selectedIds[type]);
    const selectedData = useMemo(() => {
        return selectSelectedData(settings, selectedIds);
    }, [settings, selectedIds]);
    const [singleNode] = selectedData;
    const meaningfulParentType = getParentTypeNormalized({
        data: settings,
        id: singleNode?.id,
    });
    const nodeType = singleNode?.subType || singleNode?.type;

    return {
        selectedData,
        meaningfulParentType,
        nodeType,
    };
}
