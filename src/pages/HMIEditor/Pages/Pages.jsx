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
import { LuLibraryBig, LuPlus, LuStickyNote, LuTrash2 } from "react-icons/lu";
import { useActionsStore } from "../store/actions-store";
import { LOCALE } from "../constants";

export const Pages = () => {
    const pages = useNodeStore((state) => state.pages);
    const activePageId = useNodeStore((state) => state.activePageId);

    // Преобразуем объект pages в массив для рендеринга
    const pagesList = Object.values(pages);

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
                <Heading size={"md"} userSelect={"none"}>
                    {LOCALE.pages}
                </Heading>

                <Menu.Root positioning={{ placement: "bottom-end" }}>
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
                                    {LOCALE.newPage}
                                </Menu.Item>
                                <Menu.Item
                                    value="new-library-page"
                                    onClick={() => handleAddPage("LIBRARY")}
                                >
                                    <LuLibraryBig />
                                    {LOCALE.newLib}
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
                            bg={
                                isActive ? "colorPalette.subtle" : "transparent"
                            }
                            _hover={{
                                bg: isActive
                                    ? "colorPalette.emphasized"
                                    : "bg.emphasized",
                            }}
                            onClick={() =>
                                useNodeStore.getState().setActivePage(page.id)
                            }
                            justify="space-between"
                            className="group" // Для показа кнопки удаления при ховере
                            transition="all 0.2s"
                            userSelect={"none"}
                        >
                            <HStack overflow="hidden">
                                <Text
                                    fontSize="sm"
                                    fontWeight={isActive ? "medium" : "normal"}
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
