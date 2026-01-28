import {
    Flex,
    Heading,
    HStack,
    IconButton,
    Menu,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { useColorModeValue } from "@/components/ui/color-mode";
import { LuLibraryBig, LuPlus, LuStickyNote, LuTrash2 } from "react-icons/lu";
import { useActionsStore } from "../store/actions-store";

export const Pages = () => {
    const pages = useNodeStore((state) => state.pages);
    const activePageId = useNodeStore((state) => state.activePageId);

    // Преобразуем объект pages в массив для рендеринга
    const pagesList = Object.values(pages);

    // Цвета для активного и неактивного состояния
    const activeBg = useColorModeValue("blue.100", "blue.900");
    const hoverBg = useColorModeValue("gray.100", "gray.700");

    const showPagesList = useActionsStore((state) => state.showPagesList);
    if (!showPagesList) return null;

    const handleAddPage = (type) => {
        // Можно генерировать имя 'Page N', но пока просто дефолт
        const count = pagesList.length + 1;
        useNodeStore.getState().addPage(`Page ${count}`, type);
    };

    const handleDelete = (e, id) => {
        e.stopPropagation(); // Чтобы при клике на урну не происходило переключение на страницу
        useNodeStore.getState().removePage(id);
    };

    return (
        <Flex direction={"column"} h={"100%"} minH={0}>
            {/* --- HEADER --- */}
            <Flex justify="space-between" align="center" mb={2}>
                <Heading size={"md"}>Pages</Heading>

                <Menu.Root>
                    <Menu.Trigger asChild>
                        <IconButton
                            size="2xs"
                            aria-label="Add page"
                            variant="solid"
                        >
                            <LuPlus />
                        </IconButton>
                    </Menu.Trigger>
                    <Portal>
                        <Menu.Positioner>
                            <Menu.Content>
                                <Menu.Item
                                    value="new-screen-page"
                                    onClick={() => handleAddPage("SCREEN")}
                                >
                                    <LuStickyNote />
                                    New page
                                </Menu.Item>
                                <Menu.Item
                                    value="new-library-page"
                                    onClick={() => handleAddPage("LIBRARY")}
                                >
                                    <LuLibraryBig />
                                    New library
                                </Menu.Item>
                            </Menu.Content>
                        </Menu.Positioner>
                    </Portal>
                </Menu.Root>
            </Flex>

            {/* --- LIST --- */}
            <VStack align="stretch" gap={0} overflowY="auto" flex={1}>
                {pagesList.map((page) => {
                    const isActive = page.id === activePageId;

                    return (
                        <HStack
                            key={page.id}
                            p={1}
                            ps={4}
                            borderRadius="md"
                            cursor="pointer"
                            bg={isActive ? activeBg : "transparent"}
                            _hover={{ bg: isActive ? activeBg : hoverBg }}
                            onClick={() =>
                                useNodeStore.getState().setActivePage(page.id)
                            }
                            justify="space-between"
                            className="group" // Для показа кнопки удаления при ховере
                            transition="all 0.2s"
                        >
                            <HStack spacing={3} overflow="hidden">
                                <Text
                                    fontSize="sm"
                                    fontWeight={
                                        isActive ? "semibold" : "normal"
                                    }
                                    isTruncated
                                >
                                    {page.name}
                                </Text>
                            </HStack>

                            {/* Кнопка удаления (появляется при наведении на строку) */}
                            <IconButton
                                size="2xs"
                                aria-label="Delete page"
                                variant="ghost"
                                colorPalette={"red"}
                                opacity={0}
                                _groupHover={{ opacity: 1 }}
                                onClick={(e) => handleDelete(e, page.id)}
                                disabled={pagesList.length <= 1} // Не даем удалить последнюю
                            >
                                <LuTrash2 />
                            </IconButton>
                        </HStack>
                    );
                })}
            </VStack>
        </Flex>
    );
};
