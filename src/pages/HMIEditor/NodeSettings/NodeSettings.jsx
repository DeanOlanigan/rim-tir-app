import { Flex, Heading, HStack, Tabs } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { SelectedButtonsGroup } from "./SelectedButtonsGroup";
import { LOCALE, SHAPES_WITH_SETTINGS } from "../constants";
import { BaseSettings } from "./Base";
import { AdvancedSettings } from "./Advanced";
import { ActionsSettings } from "./Actions";

export const NodeSettings = ({ api }) => {
    const selectedIds = useNodeStore((state) => state.selectedIds);
    if (!selectedIds.length) return null;

    const types = selectedIds.map(
        (id) => useNodeStore.getState().nodes[id]?.type,
    );
    if (types.some((t) => !t)) return null;
    if (!types.every((type) => SHAPES_WITH_SETTINGS.has(type))) return null;

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
            pointerEvents={"auto"}
        >
            <NodeSettingsHeader ids={selectedIds} api={api} types={types} />
            <Tabs.Root
                variant={"line"}
                defaultValue="base"
                lazyMount
                unmountOnExit
                fitted
                w={"100%"}
                h={"100%"}
                minH={0}
                display={"flex"}
                flexDirection={"column"}
                size={"sm"}
            >
                <Tabs.List>
                    <Tabs.Trigger value="base">{LOCALE.base}</Tabs.Trigger>
                    <Tabs.Trigger value="bindings">
                        {LOCALE.bindings}
                    </Tabs.Trigger>
                    <Tabs.Trigger value="actions">
                        {LOCALE.actions}
                    </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="base" h={"100%"} mt={2} overflow={"auto"}>
                    <BaseSettings
                        api={api}
                        types={types}
                        selectedIds={selectedIds}
                    />
                </Tabs.Content>
                <Tabs.Content
                    value="bindings"
                    mt={2}
                    flex={1}
                    overflow={"hidden"}
                >
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

const NodeSettingsHeader = ({ ids, api, types }) => {
    const isMultiple = ids.length > 1;
    const selectedName = useNodeStore((state) =>
        isMultiple ? null : state.nodes[ids[0]]?.name,
    );
    const heading = isMultiple
        ? `${LOCALE.selected}: ${ids.length}`
        : selectedName;
    return (
        <HStack w={"100%"} justify={"space-between"}>
            <Heading size={"md"} ms={2}>
                {heading}
            </Heading>
            <SelectedButtonsGroup ids={ids} api={api} types={types} />
        </HStack>
    );
};
