import {
    Badge,
    Box,
    Button,
    Flex,
    Icon,
    Separator,
    Text,
} from "@chakra-ui/react";
import { LuChevronRight, LuDot } from "react-icons/lu";
import { useVariablesStore } from "@/store/variables-store";
import { useConfigTreeApiStore } from "@/store/config-tree-api-store";

export const ValidationContent = ({ errors }) => {
    const settings = useVariablesStore((state) => state.settings);
    const updateSelectedIds = useVariablesStore(
        (state) => state.updateSelectedIds
    );
    const treeApis = useConfigTreeApiStore((state) => state.configTreeApi);

    const selectNodeHandler = (nodeId) => {
        const targetType =
            settings[nodeId]?.type === "variable" ? "variables" : "connections";
        updateSelectedIds(targetType, new Set([nodeId]));
        // TODO Полное уебанство
        if (settings[nodeId]?.type === "variable") {
            treeApis.variables.current.scrollTo(nodeId);
            treeApis.variables.current.select(nodeId);
        } else {
            Object.entries(treeApis).forEach(([key, api]) => {
                if (key !== "variables") {
                    api.current.scrollTo(nodeId);
                    api.current.select(nodeId);
                }
            });
        }
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
                        size={"2xs"}
                        onClick={() => selectNodeHandler(nodeId)}
                    >
                        <Badge
                            variant={"solid"}
                            justifyContent={"space-between"}
                        >
                            {settings[nodeId]?.name}
                            <Icon as={LuChevronRight} />
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
