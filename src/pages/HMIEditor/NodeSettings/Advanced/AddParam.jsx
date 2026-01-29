import { Button, HStack, Icon, Menu, Portal, Text } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { PARAMS_CONFIG } from "./params-config";
import { useNodeStore } from "../../store/node-store";

export const AddParam = ({ selectedIds, availableParams }) => {
    return (
        <Menu.Root
            lazyMount
            unmountOnExit
            positioning={{ placement: "top-center", sameWidth: true }}
        >
            <Menu.Trigger asChild>
                <Button
                    disabled={availableParams.length === 0}
                    variant="outline"
                    size="sm"
                    borderStyle="dashed"
                    color="fg.muted"
                    w="100%"
                >
                    {availableParams.length === 0 ? (
                        "All properties added"
                    ) : (
                        <>
                            <LuPlus size={16} /> Add Property Binding
                        </>
                    )}
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        {availableParams.map((key) => (
                            <Menu.Item
                                key={key}
                                value={key}
                                onClick={() => {
                                    useNodeStore
                                        .getState()
                                        .updateBinding(selectedIds, key);
                                }}
                            >
                                {/* Chakra v3 syntax might vary slightly for icons in menu */}
                                <HStack gap={2}>
                                    <Icon
                                        as={PARAMS_CONFIG[key].icon}
                                        size={14}
                                    />
                                    <Text>{PARAMS_CONFIG[key].label}</Text>
                                </HStack>
                            </Menu.Item>
                        ))}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
