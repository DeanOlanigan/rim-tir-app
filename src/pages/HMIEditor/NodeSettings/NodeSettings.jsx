import { Flex, Heading, HStack, Tabs } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { SelectedButtonsGroup } from "./SelectedButtonsGroup";
import { SHAPES_NAMES, SHAPES_WITH_SETTINGS } from "../constants";
import { BaseSettings } from "./Base";
import { AdvancedSettings } from "./Advanced";
import { ActionsSettings } from "./Actions";

export const NodeSettings = ({ api }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    if (!selectedIds.length) return null;

    const types = selectedIds.map(
        (id) => api.canvas.getNodes().get(id).attrs.type,
    );
    if (!types.every((type) => SHAPES_WITH_SETTINGS.has(type))) return null;

    const isMultiple = selectedIds.length > 1;

    const heading = isMultiple
        ? `${selectedIds.length} selected`
        : SHAPES_NAMES[types[0]];

    return (
        <Flex
            bg={"bg"}
            w={"500px"}
            h={"100%"}
            p={2}
            borderRadius={"md"}
            shadow={"md"}
            direction={"column"}
            gap={2}
        >
            <HStack w={"100%"} justify={"space-between"}>
                <Heading size={"md"} ms={2}>
                    {heading}
                </Heading>
                <SelectedButtonsGroup
                    ids={selectedIds}
                    api={api}
                    types={types}
                />
            </HStack>
            <Tabs.Root
                variant={"line"}
                defaultValue="base"
                lazyMount
                unmountOnExit
                fitted
                w={"100%"}
                h={"100%"}
                display={"flex"}
                flexDirection={"column"}
                overflow={"hidden"}
                size={"sm"}
            >
                <Tabs.List>
                    <Tabs.Trigger value="base">Base</Tabs.Trigger>
                    <Tabs.Trigger value="bindings">Bindings</Tabs.Trigger>
                    <Tabs.Trigger value="actions">Actions</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="base" h={"100%"} mt={2} overflow={"auto"}>
                    <BaseSettings
                        api={api}
                        types={types}
                        selectedIds={selectedIds}
                    />
                </Tabs.Content>
                <Tabs.Content value="bindings" flex={1} overflow={"hidden"}>
                    <AdvancedSettings
                        api={api}
                        types={types}
                        selectedIds={selectedIds}
                    />
                </Tabs.Content>
                <Tabs.Content
                    value="actions"
                    h={"100%"}
                    mt={2}
                    overflow={"auto"}
                >
                    <ActionsSettings
                        api={api}
                        types={types}
                        selectedIds={selectedIds}
                    />
                </Tabs.Content>
            </Tabs.Root>
        </Flex>
    );
};
