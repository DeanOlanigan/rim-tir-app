import { Box, Flex, Heading, Switch, Text, VStack } from "@chakra-ui/react";
import { PARAMS_CONFIG } from "./params-config";
import { AddParam } from "./AddParam";
import { BindingCard } from "./BindingCard";
import { useNodeStore } from "../../store/node-store";
import { getCommonSupportedProps } from "./shape-supported-props";
import { useShallow } from "zustand/shallow";
import { useActionsStore } from "../../store/actions-store";
import { VariableSelect } from "../VariableSelect";
import { useVariables } from "../use-variables";

export const AdvancedSettings = ({ types, selectedIds }) => {
    const { data: variables } = useVariables();
    const bindingsItems = useNodeStore(
        useShallow((s) => s.nodes[selectedIds[0]]?.bindings?.items || []),
    );
    const isLiveUpdate = useActionsStore((s) => s.isLiveUpdate);
    const setLiveUpdates = useActionsStore((s) => s.setLiveUpdates);

    const supportedProps = getCommonSupportedProps(types);

    const activeProperties = bindingsItems.map((b) => b.property);
    const availableParams = Object.keys(PARAMS_CONFIG).filter(
        (p) => supportedProps.includes(p) && !activeProperties.includes(p),
    );

    const globalVariable = useNodeStore(
        (s) => s.nodes[selectedIds[0]]?.bindings?.globalVarId,
    );

    return (
        <VStack align={"start"} p={2} w={"100%"} h={"100%"} minH={0}>
            {/* Глобальные настройки */}
            <VStack align={"start"} w={"100%"}>
                <Heading size={"md"}>Global</Heading>
                <VariableSelect
                    variables={variables}
                    value={globalVariable}
                    onChange={(e) =>
                        useNodeStore
                            .getState()
                            .setBindingGlobalVarId(selectedIds, e)
                    }
                />
                <Flex
                    justify="space-between"
                    align="center"
                    w="100%"
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    bg="bg.subtle"
                >
                    <VStack align="start" gap={0}>
                        <Text fontSize="sm" fontWeight="medium">
                            Live Updates
                        </Text>
                        <Text fontSize="xs" color="fg.muted">
                            Enable MQTT data
                        </Text>
                    </VStack>
                    <Switch.Root
                        checked={isLiveUpdate}
                        onCheckedChange={(e) => setLiveUpdates(e.checked)}
                        size="sm"
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                    </Switch.Root>
                </Flex>
            </VStack>
            {/* Биндинги */}
            <VStack align={"start"} w={"100%"} flex={1} minH={0}>
                <Heading size={"md"}>Bindings</Heading>
                <Flex
                    direction={"column"}
                    w={"100%"}
                    minH={0}
                    overflow={"auto"}
                    gap={2}
                    pe={2}
                >
                    {bindingsItems.map((binding) => {
                        if (!PARAMS_CONFIG[binding.property]) return null;
                        return (
                            <BindingCard
                                key={binding.id}
                                binding={binding}
                                config={PARAMS_CONFIG[binding.property]}
                                variables={variables}
                                isMultiple={selectedIds.length > 1}
                                selectedIds={selectedIds}
                                globalVariable={globalVariable}
                            />
                        );
                    })}
                    {bindingsItems.length === 0 && (
                        <Box
                            p={4}
                            border="1px dashed"
                            borderColor="border.emphasized"
                            borderRadius="md"
                            textAlign="center"
                        >
                            <Text fontSize="sm" color="gray.500">
                                No active bindings
                            </Text>
                        </Box>
                    )}
                </Flex>
            </VStack>
            {/* Кнопка добавления */}
            <AddParam
                selectedIds={selectedIds}
                availableParams={availableParams}
            />
        </VStack>
    );
};
