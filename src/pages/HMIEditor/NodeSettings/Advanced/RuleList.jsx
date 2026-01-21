import { Box, Heading, HStack, IconButton, VStack } from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { LuArrowRight, LuGripVertical, LuPlus, LuTrash2 } from "react-icons/lu";
import { ParamSet } from "./ParamSet";
import { useNodeStore } from "../../store/node-store";
import {
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
    closestCenter,
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

const getDefaultParamValue = (type) => {
    switch (type) {
        case "color":
            return "#000000";
        case "number":
            return 0;
        case "string":
            return "text";
        default:
            return "";
    }
};

export const RuleList = ({
    binding,
    selectedIds,
    type,
    title,
    emptyText,
    createRule,
    renderInput,
}) => {
    const rules = binding.rules || [];
    const updateBinding = useNodeStore.getState().updateBinding;
    const updateRules = (newRules) =>
        updateBinding(selectedIds, binding.property, { rules: newRules });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
    );

    const handleAdd = () => {
        const newRule = {
            id: nanoid(12),
            set: getDefaultParamValue(type),
            ...createRule(),
        };
        updateRules([...rules, newRule]);
    };

    const handleRemove = (index) => {
        const newRules = rules.filter((_, i) => i !== index);
        updateRules(newRules);
    };

    const handleChange = (index, field, value) => {
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], [field]: value };
        updateRules(newRules);
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over || active.id === over.id) return;

        const oldIndex = rules.findIndex((r) => r.id === active.id);
        const newIndex = rules.findIndex((r) => r.id === over.id);

        updateRules(arrayMove(rules, oldIndex, newIndex));
    };

    return (
        <VStack align={"start"} w={"100%"} gap={3}>
            {/* Header */}
            <HStack w={"100%"} justify="space-between">
                <Heading size={"xs"} color="fg.muted" fontWeight="medium">
                    {title}
                </Heading>
                <IconButton
                    variant={"ghost"}
                    size={"xs"}
                    onClick={handleAdd}
                    aria-label="Add rule"
                >
                    <LuPlus />
                </IconButton>
            </HStack>

            {/* Empty State */}
            {rules.length === 0 && (
                <Box
                    w="100%"
                    textAlign="center"
                    py={2}
                    color="fg.muted"
                    fontSize="xs"
                >
                    {emptyText}
                </Box>
            )}

            {/* List */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToVerticalAxis]}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={rules.map((r) => r.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <VStack w="100%" gap={2}>
                        {rules.map((rule, i) => (
                            <SortableRuleRow
                                key={rule.id}
                                rule={rule}
                                index={i}
                                type={type}
                                renderInput={renderInput}
                                onChange={handleChange}
                                onRemove={handleRemove}
                            />
                        ))}
                    </VStack>
                </SortableContext>
            </DndContext>
        </VStack>
    );
};

const SortableRuleRow = ({
    rule,
    index,
    type,
    renderInput,
    onChange,
    onRemove,
}) => {
    const {
        attributes,
        listeners,
        transform,
        transition,
        setNodeRef,
        isDragging,
    } = useSortable({ id: rule.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 1000 : "auto",
        position: "relative",
    };

    return (
        <HStack
            ref={setNodeRef}
            w={"100%"}
            gap={2}
            style={style}
            bg={isDragging ? "bg.emphasized" : "transparent"}
            borderRadius={"md"}
        >
            <Box
                color={"fg.muted"}
                cursor={"grab"}
                _active={{ cursor: "grabbing" }}
                {...listeners}
                {...attributes}
            >
                <LuGripVertical />
            </Box>
            {/* ЛЕВАЯ ЧАСТЬ (Специфичная) */}
            {renderInput(rule, index, onChange)}

            {/* СТРЕЛКА */}
            <Box color="fg.muted">
                <LuArrowRight size={12} />
            </Box>

            {/* ПРАВАЯ ЧАСТЬ (Результат - ParamSet) */}
            <Box flex={1}>
                <ParamSet
                    type={type}
                    value={rule.set}
                    onChange={(val) => onChange(index, "set", val)}
                />
            </Box>

            {/* УДАЛЕНИЕ */}
            <IconButton
                variant={"ghost"}
                colorPalette="red"
                size={"xs"}
                onClick={() => onRemove(index)}
                aria-label="Remove"
            >
                <LuTrash2 size={14} />
            </IconButton>
        </HStack>
    );
};
