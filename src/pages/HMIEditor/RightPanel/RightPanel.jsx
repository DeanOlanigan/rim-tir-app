import { NodeSettings } from "../NodeSettings";
import { ProjectSettings } from "./ProjectSettings";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { Box } from "@chakra-ui/react";

export const RightPanel = ({ api }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const isUiExpanded = useActionsStore((state) => state.isUiExpanded);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const showRulers = useActionsStore((state) => state.showRulers);

    let content = null;

    if (!viewOnlyMode) {
        if (!selectedIds.length && isUiExpanded) {
            content = <ProjectSettings api={api} />;
        } else if (selectedIds.length) {
            content = <NodeSettings api={api} selectedIds={selectedIds} />;
        }
    }

    if (!content) return null;

    return (
        <Box
            h={"100%"}
            minH={0}
            pt={showRulers ? 8 : 2}
            pr={2}
            pb={2}
            transition={"padding 0.2s ease-in-out"}
            pointerEvents={"none"}
        >
            {content}
        </Box>
    );
};
