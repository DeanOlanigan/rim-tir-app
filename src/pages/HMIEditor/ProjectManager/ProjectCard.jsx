import {
    Box,
    Card,
    Float,
    FormatByte,
    HStack,
    Icon,
    IconButton,
    Text,
    VStack,
} from "@chakra-ui/react";
import { LuMonitor, LuStar, LuTrash2 } from "react-icons/lu";

export const ProjectCard = ({ project, onClick, onDelete }) => {
    return (
        <Card.Root
            variant="outline"
            cursor="pointer"
            _hover={{ borderColor: "colorPalette.500", shadow: "sm" }}
            onClick={() => onClick(project.value)}
            position={"relative"}
            overflow="hidden"
            className="group"
        >
            <Float offset={4}>
                <IconButton
                    size={"2xs"}
                    display={{ base: "none", _groupHover: "flex" }}
                    variant={"subtle"}
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(project.value);
                    }}
                >
                    <LuTrash2 />
                </IconButton>
            </Float>
            <Float placement={"top-start"} offset={4}>
                <IconButton
                    size={"2xs"}
                    variant={"ghost"}
                    colorPalette={"yellow"}
                >
                    <Icon as={LuStar} fill={"transparent"} />
                </IconButton>
            </Float>
            <Box
                bg="gray.100"
                h="100px"
                display="flex"
                alignItems="center"
                justifyContent="center"
            >
                <Icon as={LuMonitor} boxSize="8" color="gray.400" />
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
