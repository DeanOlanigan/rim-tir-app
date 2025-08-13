import { useConfigTreeApiStore } from "@/store/config-tree-api-store";
import { useVariablesStore } from "@/store/variables-store";
import { Badge, Button, Icon } from "@chakra-ui/react";
import { LuArrowRight } from "react-icons/lu";
import { EditorBreadcrumb } from "../Breadcrumb";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

export const RedirectButton = ({ id }) => {
    const settings = useVariablesStore.getState().settings;
    const updateSelectedIds = useVariablesStore.getState().updateSelectedIds;
    const treeApis = useConfigTreeApiStore.getState().configTreeApi;
    const selectNodeHandler = (nodeId) => {
        const targetType =
            settings[nodeId]?.rootId === "variables"
                ? "variables"
                : "connections";
        updateSelectedIds(targetType, new Set([nodeId]));
        const target = settings[nodeId]?.rootId;
        treeApis[target].current.scrollTo(nodeId);
        treeApis[target].current.select(nodeId);
    };
    const breadcrumbs = useBreadcrumb(id);

    return (
        <Button
            asChild
            size={"1.5xs"}
            w={"100%"}
            onClick={() => selectNodeHandler(id)}
        >
            <Badge
                variant={"solid"}
                justifyContent={"space-between"}
                overflowX={"auto"}
            >
                <EditorBreadcrumb
                    breadcrumbs={breadcrumbs}
                    color={"fg.inverted"}
                />
                <Icon as={LuArrowRight} />
            </Badge>
        </Button>
    );
};
