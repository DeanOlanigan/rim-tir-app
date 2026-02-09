import {
    Box,
    Card,
    Float,
    FormatByte,
    HStack,
    Icon,
    IconButton,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuMonitor, LuTrash2 } from "react-icons/lu";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { useOpeningState } from "./useOpeningState";

export const ProjectCard = ({ project, onClick, onDelete }) => {
    const { isOpening, openingMutation } = useOpeningState();
    const isCurrentOpenning = openingMutation.includes(project.value);
    const isDisabled = isOpening && !isCurrentOpenning;

    const style = {
        opacity: isDisabled ? 0.4 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
        _hover: isDisabled
            ? {}
            : { borderColor: "colorPalette.500", shadow: "sm" },
        onClick: isDisabled ? () => {} : () => onClick(project.value),
        className: isDisabled ? "" : "group",
    };

    return (
        <Card.Root
            variant="outline"
            {...style}
            position={"relative"}
            overflow="hidden"
        >
            <Float offset={4}>
                <IconButton
                    size={"2xs"}
                    display={{ base: "none", _groupHover: "flex" }}
                    variant={"subtle"}
                    onClick={async (e) => {
                        e.stopPropagation();
                        const isConfirmed = await confirmDialog.open(
                            CONFIRM_DIALOG_ID,
                            {
                                title: "Confirmation",
                                message: "Are you sure?",
                            },
                        );
                        if (!isConfirmed) return;
                        onDelete(project.value);
                    }}
                >
                    <LuTrash2 />
                </IconButton>
            </Float>
            <Box
                bg="gray.100"
                h="100px"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                {isCurrentOpenning ? (
                    <Spinner color={"colorPalette.500"} />
                ) : (
                    <Icon as={LuMonitor} boxSize="8" color="gray.400" />
                )}
            </Box>
            <Card.Body p="3">
                <VStack align="start" gap="1">
                    <Text
                        fontWeight="medium"
                        lineClamp={1}
                        title={project.label}
                    >
                        {project.label}
                    </Text>
                    <HStack
                        color="gray.500"
                        fontSize="xs"
                        width="full"
                        justify="space-between"
                    >
                        <Text>
                            {new Date(project.mtime).toLocaleDateString()}
                        </Text>
                        <FormatByte value={project.size} />
                    </HStack>
                </VStack>
            </Card.Body>
        </Card.Root>
    );
};
