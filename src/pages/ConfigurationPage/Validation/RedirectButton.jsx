import { useVariablesStore } from "@/store/variables-store";
import { Button, Icon } from "@chakra-ui/react";
import { LuArrowRight } from "react-icons/lu";
import { EditorBreadcrumb } from "../Breadcrumb/Breadcrumb";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { useTreeRegistry } from "@/store/tree-registry-store";

export const RedirectButton = ({ id }) => {
    const settings = useVariablesStore.getState().settings;
    const updateSelectedIds = useVariablesStore.getState().updateSelectedIds;
    const treeApis = useTreeRegistry.getState().getScopeApis("config");
    const selectNodeHandler = (nodeId) => {
        const targetType =
            settings[nodeId]?.rootId === "variables"
                ? "variables"
                : "connections";
        updateSelectedIds(targetType, new Set([nodeId]));
        const target = settings[nodeId]?.rootId;
        treeApis[target].scrollTo(nodeId);
        treeApis[target].select(nodeId);
    };
    const breadcrumbs = useBreadcrumb(id);

    return (
        <Button
            variant={"surface"}
            rounded={"md"}
            size={"2xs"}
            justifyContent={"space-between"}
            w={"100%"}
            onClick={() => selectNodeHandler(id)}
        >
            <EditorBreadcrumb breadcrumbs={breadcrumbs} color={"red.fg"} />
            <Icon as={LuArrowRight} colorPalette={"red"} />
        </Button>
    );
};
