import {
    Badge,
    Box,
    Checkbox,
    ColorSwatch,
    Flex,
    HStack,
    IconButton,
    Spacer,
    Switch,
    Tabs,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuLink, LuTrash2 } from "react-icons/lu";
import { VariableSelect } from "./VariableSelect";
import { useNodeStore } from "../../store/node-store";
import { ThresholdEditor } from "./ThresholdEditor";
import { MapEditor } from "./MapEditor";
import { DirectEditor } from "./DirectEditor";

export const BindingCard = ({
    binding,
    config,
    variables,
    isMultiple,
    selectedIds,
    globalVariable,
}) => {
    const Icon = config.icon;
    const isActive = binding.enabled;
    const isOverride = !binding.useGlobal;

    const globalVarName =
        variables?.find((v) => v.value === globalVariable)?.label ||
        "Global Variable";
    const fallbackValue = useNodeStore(
        (s) => s.nodes[selectedIds[0]]?.[binding.property],
    );

    const update = (changes) =>
        useNodeStore
            .getState()
            .updateBinding(selectedIds, binding.property, changes);
    const remove = () =>
        useNodeStore.getState().removeBinding(selectedIds, binding.property);

    return (
        <Flex
            direction={"column"}
            flexShrink={0}
            borderWidth="1px"
            borderColor={isActive ? "border.emphasized" : "border"}
            borderRadius="md"
            bg="bg.panel"
            overflow="hidden"
            transition="all 0.2s"
            w={"100%"}
        >
            {/* HEADER */}
            <Flex
                p={2}
                align="center"
                bg={isActive ? "bg.subtle" : "transparent"}
                borderBottomWidth={isActive ? "1px" : "0px"}
            >
                <HStack gap={2}>
                    <Icon size={16} />
                    <Text fontWeight="medium" fontSize="sm">
                        {config.label}
                    </Text>
                </HStack>
                <Spacer />
                <HStack gap={3}>
                    <Switch.Root
                        size="sm"
                        checked={isActive}
                        onCheckedChange={(e) => update({ enabled: e.checked })}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control>
                            <Switch.Thumb />
                        </Switch.Control>
                    </Switch.Root>

                    <IconButton
                        variant="ghost"
                        size="xs"
                        color="fg.muted"
                        aria-label="Delete"
                        onClick={remove}
                    >
                        <LuTrash2 size={14} />
                    </IconButton>
                </HStack>
            </Flex>

            {isActive && (
                <VStack align={"start"} p={2} w={"100%"}>
                    {/* 1. SOURCE SELECTOR */}
                    <VStack>
                        <HStack w="100%" justify="space-between">
                            <Checkbox.Root
                                size="xs"
                                checked={isOverride}
                                onCheckedChange={(e) =>
                                    update({ useGlobal: !e.checked })
                                }
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control />
                                <Checkbox.Label>Override</Checkbox.Label>
                            </Checkbox.Root>
                            <Text fontSize="xs" color="fg.muted">
                                Source:
                            </Text>
                            {isOverride ? (
                                // Режим Override: Выбираем локальную переменную
                                <VariableSelect
                                    variables={variables}
                                    value={binding.varId} // Важно: тут показываем локальный varId
                                    onChange={(newVarId) =>
                                        update({ varId: newVarId })
                                    }
                                />
                            ) : (
                                // Режим Inherited: Показываем, что наследуем (Read Only вид)
                                <Flex
                                    w="100%"
                                    h="32px" // Высота стандартного input sm
                                    px={3}
                                    align="center"
                                    borderWidth="1px"
                                    borderRadius="sm"
                                    bg="bg.subtle"
                                    color="fg.muted"
                                    fontSize="xs"
                                    gap={2}
                                >
                                    <LuLink size={12} />
                                    {globalVariable ? (
                                        <Text truncate>
                                            Inherited: {globalVarName}
                                        </Text>
                                    ) : (
                                        <Badge size="xs" colorPalette="yellow">
                                            Not Set
                                        </Badge>
                                    )}
                                </Flex>
                            )}
                        </HStack>
                    </VStack>
                    {/* 2. MODE TABS */}
                    <Tabs.Root
                        w={"100%"}
                        defaultValue={binding.mode || "map"}
                        size="sm"
                        variant="enclosed"
                        fitted
                        onValueChange={(e) =>
                            update({ mode: e.value, rules: [] })
                        }
                    >
                        <Tabs.List w="100%">
                            <Tabs.Trigger value="direct" flex={1}>
                                Direct
                            </Tabs.Trigger>
                            <Tabs.Trigger value="map" flex={1}>
                                Map
                            </Tabs.Trigger>
                            <Tabs.Trigger value="threshold" flex={1}>
                                Threshold
                            </Tabs.Trigger>
                        </Tabs.List>

                        <Box>
                            <Tabs.Content value="direct">
                                <Text fontSize="xs" color="fg.muted" mb={2}>
                                    Value from variable will be directly applied
                                    to <b>{config.label}</b>.
                                </Text>
                                {/* DirectEditor Component here */}
                                <DirectEditor config={config} />
                            </Tabs.Content>

                            <Tabs.Content value="map">
                                <Text fontSize="xs" color="fg.muted" mb={2}>
                                    Map discrete values (0, 1) to specific
                                    visual params. First rule has the highest
                                    priority.
                                </Text>
                                {/* MapEditor Component here */}
                                <MapEditor
                                    binding={binding}
                                    selectedIds={selectedIds}
                                    type={config.type}
                                />
                            </Tabs.Content>

                            <Tabs.Content value="threshold">
                                <Text fontSize="xs" color="fg.muted" mb={2}>
                                    Map continuous values (0, 1) to specific
                                    visual params. First rule has the highest
                                    priority.
                                </Text>
                                {/* ThresholdEditor Component here */}
                                <ThresholdEditor
                                    binding={binding}
                                    selectedIds={selectedIds}
                                    type={config.type}
                                />
                            </Tabs.Content>
                        </Box>
                    </Tabs.Root>

                    {/* 3. FALLBACK */}
                    <HStack gap={2} justify="space-between">
                        <Text fontSize="xs" color="fg.muted">
                            Fallback / Default:
                        </Text>
                        {config.type === "color" ? (
                            <Badge variant={"outline"}>
                                <ColorSwatch
                                    value={fallbackValue}
                                    boxSize={"0.82em"}
                                />
                                {fallbackValue}
                            </Badge>
                        ) : (
                            <Text fontSize="xs">{fallbackValue}</Text>
                        )}
                        {isMultiple && (
                            <Text fontSize={"xs"} color={"fg.error"}>
                                Multiple objects selected
                            </Text>
                        )}
                    </HStack>
                </VStack>
            )}
        </Flex>
    );
};
