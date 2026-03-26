import {
    Box,
    Card,
    Center,
    Float,
    FormatByte,
    HStack,
    Icon,
    IconButton,
    Image,
    Spinner,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuMonitor, LuTrash2 } from "react-icons/lu";
import { CONFIRM_DIALOG_ID, confirmDialog } from "@/components/confirmDialog";
import { useOpeningState } from "./useOpeningState";
import { useActionsStore } from "../store/actions-store";

export const ProjectCard = ({ project, onClick, onDelete }) => {
    const viewOnlyMode = useActionsStore((s) => s.viewOnlyMode);
    const { isOpening, openingMutation } = useOpeningState();
    const isCurrentOpenning = openingMutation.includes(project.id);
    const isDisabled = isOpening && !isCurrentOpenning;

    const thumbnailURL = `${import.meta.env.VITE_HTTP_HOST}${project.thumbnail}`;
    const Thumbnail = project.thumbnail ? (
        <Image
            src={thumbnailURL}
            alt={project.name}
            fit={"cover"}
            w={"full"}
            h={"full"}
            fallback={<Icon as={LuMonitor} boxSize="8" color="fg" />}
        />
    ) : (
        <Icon as={LuMonitor} boxSize="8" color="fg" />
    );

    const style = {
        opacity: isDisabled ? 0.4 : 1,
        cursor: isDisabled ? "not-allowed" : "pointer",
        _hover: isDisabled ? {} : { bg: "colorPalette.subtle", shadow: "sm" },
        onClick: isDisabled ? () => {} : () => onClick(project.id),
        className: isDisabled ? "" : "group",
    };

    return (
        <Card.Root
            variant="outline"
            {...style}
            position={"relative"}
            overflow="hidden"
        >
            {!viewOnlyMode && (
                <Float offset={4} zIndex={"modal"}>
                    <IconButton
                        size={"2xs"}
                        display={{ base: "none", _groupHover: "flex" }}
                        variant={"subtle"}
                        colorPalette={"red"}
                        onClick={async (e) => {
                            e.stopPropagation();
                            const isConfirmed = await confirmDialog.open(
                                CONFIRM_DIALOG_ID,
                                {
                                    title: "Удаление проекта",
                                    message: `Вы уверены, что хотите удалить ${project.name}?`,
                                },
                            );
                            if (!isConfirmed) return;
                            onDelete(project.id);
                        }}
                    >
                        <LuTrash2 />
                    </IconButton>
                </Float>
            )}
            <Box
                bg="bg"
                w="144px"
                h="81px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderBottomWidth="1px"
                position={"relative"}
            >
                {Thumbnail}
                {isCurrentOpenning && (
                    <Box pos={"absolute"} inset={0} bg={"bg/80"}>
                        <Center h={"full"}>
                            <Spinner color={"colorPalette.500"} />
                        </Center>
                    </Box>
                )}
            </Box>
            <Card.Body p="3">
                <VStack align="start" gap="1">
                    <Text
                        fontWeight="medium"
                        lineClamp={1}
                        title={project.name}
                    >
                        {project.name}
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
