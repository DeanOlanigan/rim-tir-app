import { NodeSettings } from "../NodeSettings";
import { ProjectSettings } from "../ProjectSettings";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";

export const RightPanel = ({ api }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const isUiExpanded = useActionsStore((state) => state.isUiExpanded);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);

    if (viewOnlyMode) return null;
    if (!selectedIds.length && isUiExpanded)
        return <ProjectSettings api={api} />;
    if (!selectedIds.length) return null;
    return <NodeSettings api={api} selectedIds={selectedIds} />;
};
