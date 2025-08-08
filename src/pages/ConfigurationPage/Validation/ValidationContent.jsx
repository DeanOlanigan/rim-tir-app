import {
    Badge,
    Box,
    Button,
    Flex,
    Icon,
    Separator,
    Text,
} from "@chakra-ui/react";
import { LuArrowRight, LuChevronRight, LuDot } from "react-icons/lu";
import { useVariablesStore } from "@/store/variables-store";
import { useConfigTreeApiStore } from "@/store/config-tree-api-store";
import { EditorBreadcrumb } from "../Editor/Breadcrumb";

export const ValidationContent = ({ errors }) => {
    const settings = useVariablesStore((state) => state.settings);
    const updateSelectedIds = useVariablesStore(
        (state) => state.updateSelectedIds
    );
    const treeApis = useConfigTreeApiStore((state) => state.configTreeApi);

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

    return (
        <Flex
            direction={"column"}
            gap={"2"}
            h={"180px"}
            overflowY={"auto"}
            px={"2"}
        >
            {Object.entries(errors).map(([nodeId, params]) => (
                <Flex key={nodeId} direction={"column"} gap={"2"}>
                    <Button
                        asChild
                        size={"1.5xs"}
                        onClick={() => selectNodeHandler(nodeId)}
                    >
                        <Badge
                            variant={"solid"}
                            justifyContent={"space-between"}
                            overflowX={"auto"}
                        >
                            {/* TODO: Нарушаем разделение на слои, нужно хлебные крошки выносить на слой выше */}
                            <EditorBreadcrumb
                                id={nodeId}
                                color={"fg.inverted"}
                            />
                            <Icon as={LuArrowRight} />
                        </Badge>
                    </Button>
                    <Box>
                        {Object.entries(params).map(([param, validators]) =>
                            Object.entries(validators).map(
                                ([validator, msgs]) =>
                                    msgs.map((msg, i) => (
                                        <Flex
                                            key={`${param}-${validator}-${i}`}
                                        >
                                            <Icon size={"md"} as={LuDot} />
                                            <Text>{msg}</Text>
                                        </Flex>
                                    ))
                            )
                        )}
                    </Box>
                    <Separator borderColor={"border.error"} />
                </Flex>
            ))}
        </Flex>
    );
};
