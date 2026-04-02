import {
    Box,
    Flex,
    HStack,
    Icon,
    IconButton,
    Spacer,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuGripVertical, LuTrash2, LuTriangleAlert } from "react-icons/lu";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useNodeStore } from "../../store/node-store";
import { ActionConfiguration } from "./ActionConfiguration";
import { ACTION_TYPES } from "./constants";
import { Tooltip } from "@/components/ui/tooltip";

export const ActionItem = ({ selectedNodeId, action, eventType, onRemove }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: action.id });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 1000 : "auto",
        position: "relative",
    };

    const handleUpdate = (updatedAction) => {
        useNodeStore
            .getState()
            .updateNodeEventAction(selectedNodeId, eventType, updatedAction);
    };

    return (
        <Flex
            ref={setNodeRef}
            style={style}
            direction={"column"}
            borderWidth={"1px"}
            borderColor={"border"}
            borderRadius={"md"}
            bg={isDragging ? "bg.muted" : "bg.panel"}
            w={"100%"}
        >
            {/* HEADER */}
            <Flex p={2} align={"center"} borderBottomWidth={"1px"}>
                <Box
                    py={2}
                    focusVisibleRing={"outside"}
                    borderRadius={"l2"}
                    color={"fg.muted"}
                    cursor={"grab"}
                    _active={{ cursor: "grabbing" }}
                    {...listeners}
                    {...attributes}
                >
                    <LuGripVertical />
                </Box>
                <HStack>
                    <Text ms={2}>
                        {ACTION_TYPES.find((a) => a.type === action.type).label}
                    </Text>
                    {(action.type === "WRITE_TAG" ||
                        action.type === "TOGGLE_TAG") && (
                        <Tooltip
                            showArrow
                            content={
                                "Выполнение этого действия приводит к блокировке"
                            }
                        >
                            <Icon as={LuTriangleAlert} color={"fg.warning"} />
                        </Tooltip>
                    )}
                </HStack>

                <Spacer />

                <IconButton
                    variant="ghost"
                    size="xs"
                    colorPalette={"red"}
                    aria-label="Delete"
                    onClick={() => onRemove(action.id)}
                >
                    <LuTrash2 size={14} />
                </IconButton>
            </Flex>
            {/* CONTENT */}
            <VStack align={"start"} p={2} w={"100%"}>
                <ActionConfiguration action={action} onUpdate={handleUpdate} />
            </VStack>
        </Flex>
    );
};
