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

export const ActionEvents = ({ actionId, mockState }) => {
    const data = mockState.events[actionId] || [];

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
            .removeNodeEventAction(mockState.id, actionId, id);
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        const oldIndex = data.findIndex((e) => e.id === active.id);
        const newIndex = data.findIndex((e) => e.id === over.id);

        const newOrder = arrayMove(data, oldIndex, newIndex);

        useNodeStore
            .getState()
            .setNodeEventActions(mockState.id, actionId, newOrder);
    };

    return (
        <>
            {data.length === 0 && (
                <Box
                    p={4}
                    border="1px dashed"
                    borderColor="border.emphasized"
                    borderRadius="md"
                    textAlign="center"
                >
                    <Text fontSize="sm" color="gray.500">
                        Нет событий
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
                    items={data.map((event) => event.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {data.map((event) => (
                        <ActionItem
                            key={event.id}
                            selectedNodeId={mockState.id}
                            event={event}
                            actionId={actionId}
                            onRemove={handleDelete}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </>
    );
};
