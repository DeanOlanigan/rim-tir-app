import { Box, Text } from "@chakra-ui/react";
import {
    closestCenter,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useNodeStore } from "../../store/node-store";
import { ActionItem } from "./ActionItem";
import { LOCALE } from "../../constants";

export const ActionEvents = ({ eventType, selectedNode }) => {
    const actions = selectedNode.events[eventType] || [];

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
    );

    const handleDelete = (id) => {
        useNodeStore
            .getState()
            .removeNodeEventAction(selectedNode.id, eventType, id);
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        const oldIndex = actions.findIndex((e) => e.id === active.id);
        const newIndex = actions.findIndex((e) => e.id === over.id);

        const newOrder = arrayMove(actions, oldIndex, newIndex);

        useNodeStore
            .getState()
            .reorderNodeEventActions(selectedNode.id, eventType, newOrder);
    };

    return (
        <>
            {actions.length === 0 && (
                <Box
                    p={4}
                    border="1px dashed"
                    borderColor="border.emphasized"
                    borderRadius="md"
                    textAlign="center"
                >
                    <Text fontSize="sm" color="gray.500">
                        {LOCALE.noActions}
                    </Text>
                </Box>
            )}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={actions.map((action) => action.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {actions.map((action) => (
                        <ActionItem
                            key={action.id}
                            selectedNodeId={selectedNode.id}
                            action={action}
                            eventType={eventType}
                            onRemove={handleDelete}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </>
    );
};
