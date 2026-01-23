import { nanoid } from "nanoid";
import { useNodeStore } from "../../store/node-store";
import { Button, Menu, Portal } from "@chakra-ui/react";
import { LuPlus } from "react-icons/lu";
import { ACTION_TYPES } from "./constants";

export const AddActionBtn = ({ eventType, selectedNode }) => {
    const handleAddAction = (actionType) => {
        const newEvent = {
            id: nanoid(12),
            type: actionType,
            options: {},
        };
        useNodeStore
            .getState()
            .addNodeEventAction(selectedNode.id, eventType, newEvent);
    };

    return (
        <Menu.Root
            lazyMount
            unmountOnExit
            positioning={{ placement: "top-center", sameWidth: true }}
        >
            <Menu.Trigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    borderStyle="dashed"
                    color="fg.muted"
                    w="100%"
                >
                    <LuPlus size={16} /> Add action
                </Button>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        {ACTION_TYPES.map((action) => (
                            <Menu.Item
                                key={action.type}
                                value={action.type}
                                onClick={() => handleAddAction(action.type)}
                            >
                                {action.label}
                            </Menu.Item>
                        ))}
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};
