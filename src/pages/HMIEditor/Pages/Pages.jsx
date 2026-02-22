import { useEffect, useState } from "react";
import {
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    Menu,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import {
    LuLibraryBig,
    LuPencil,
    LuPlus,
    LuStickyNote,
    LuTrash2,
} from "react-icons/lu";
import { useActionsStore } from "../store/actions-store";
import { LOCALE } from "../constants";

const getAnchorRect = (x, y) =>
    DOMRect.fromRect({
        x,
        y,
        width: 1,
        height: 1,
    });

const PagesHeader = ({ onAddPage }) => {
    return (
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
                                onClick={() => onAddPage("SCREEN")}
                            >
                                <LuStickyNote />
                                {LOCALE.newPage}
                            </Menu.Item>
                            <Menu.Item
                                value="new-library-page"
                                onClick={() => onAddPage("LIBRARY")}
                            >
                                <LuLibraryBig />
                                {LOCALE.newLib}
                            </Menu.Item>
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        </Flex>
    );
};

const PageName = ({
    isActive,
    isEditing,
    name,
    editingName,
    onEditingNameChange,
    onCommitRename,
    onCancelRename,
}) => {
    if (!isEditing) {
        return (
            <Text
                fontSize="sm"
                fontWeight={isActive ? "medium" : "normal"}
                isTruncated
                ps={4}
            >
                {name}
            </Text>
        );
    }

    return (
        <Input
            h={"2rem"}
            size={"2xs"}
            border={"none"}
            outlineWidth={"2px"}
            outlineOffset={"-2px"}
            ps={4}
            fontSize={"sm"}
            fontWeight={"medium"}
            _selection={{
                bg: "bg.emphasized",
            }}
            autoFocus
            type="text"
            value={editingName}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onEditingNameChange(e.currentTarget.value)}
            onFocus={(e) => e.currentTarget.select()}
            onBlur={onCommitRename}
            onKeyDown={(e) => {
                if (e.key === "Escape") {
                    e.preventDefault();
                    onCancelRename();
                }
                if (e.key === "Enter") {
                    e.preventDefault();
                    onCommitRename();
                }
            }}
        />
    );
};

const PageRowContextMenu = ({
    open,
    anchorPoint,
    onOpenChange,
    onStartRename,
    onDelete,
    isDeleteDisabled,
}) => {
    return (
        <Menu.Root
            open={open}
            onOpenChange={(e) => onOpenChange(e.open)}
            anchorPoint={anchorPoint}
            positioning={{
                getAnchorRect: () =>
                    getAnchorRect(anchorPoint.x, anchorPoint.y),
            }}
            unmountOnExit
            lazyMount
            skipAnimationOnMount
            size={"sm"}
        >
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
                        <Menu.Item value="rename-page" onClick={onStartRename}>
                            <LuPencil />
                            Переименовать
                        </Menu.Item>
                        <Menu.Item
                            value="delete-page"
                            color="fg.error"
                            _hover={{ bg: "bg.error", color: "fg.error" }}
                            onClick={onDelete}
                            disabled={isDeleteDisabled}
                        >
                            <LuTrash2 />
                            {LOCALE.delete}
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Portal>
        </Menu.Root>
    );
};

const PageRow = ({
    page,
    isActive,
    isEditing,
    editingName,
    onEditingNameChange,
    onCommitRename,
    onCancelRename,
    onSelect,
    onStartRename,
    onDelete,
    isDeleteDisabled,
}) => {
    const [menuState, setMenuState] = useState({
        open: false,
        x: 0,
        y: 0,
    });

    return (
        <>
            <HStack
                h={"2rem"}
                borderRadius="md"
                bg={isActive ? "colorPalette.subtle" : "transparent"}
                _hover={{
                    bg: isActive ? "colorPalette.emphasized" : "bg.emphasized",
                }}
                onClick={() => onSelect(page.id)}
                onDoubleClick={(e) => {
                    e.stopPropagation();
                    onStartRename(page.id);
                }}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setMenuState({ open: true, x: e.clientX, y: e.clientY });
                }}
                justify="space-between"
                transition="all 0.2s"
                userSelect={isEditing ? "text" : "none"}
                p={0}
            >
                <PageName
                    isActive={isActive}
                    isEditing={isEditing}
                    name={page.name}
                    editingName={editingName}
                    onEditingNameChange={onEditingNameChange}
                    onCommitRename={onCommitRename}
                    onCancelRename={onCancelRename}
                />
            </HStack>

            <PageRowContextMenu
                open={menuState.open}
                anchorPoint={{ x: menuState.x, y: menuState.y }}
                onOpenChange={(open) =>
                    setMenuState((prev) => ({ ...prev, open }))
                }
                onStartRename={() => {
                    setMenuState((prev) => ({ ...prev, open: false }));
                    onStartRename(page.id);
                }}
                onDelete={() => {
                    setMenuState((prev) => ({ ...prev, open: false }));
                    onDelete(page.id);
                }}
                isDeleteDisabled={isDeleteDisabled}
            />
        </>
    );
};

export const Pages = () => {
    const pages = useNodeStore((state) => state.pages);
    const activePageId = useNodeStore((state) => state.activePageId);
    const pagesList = Object.values(pages);

    const [editingPageId, setEditingPageId] = useState(null);
    const [editingName, setEditingName] = useState("");

    const showPagesList = useActionsStore((state) => state.showPagesList);

    useEffect(() => {
        if (!editingPageId) return;

        if (!pages[editingPageId]) {
            setEditingPageId(null);
            setEditingName("");
        }
    }, [editingPageId, pages]);

    if (!showPagesList) return null;

    const handleAddPage = (type) => {
        const count = pagesList.length + 1;
        useNodeStore.getState().addPage(`Page ${count}`, type);
    };

    const handleStartRename = (id) => {
        const page = pages[id];
        if (!page) return;

        setEditingPageId(id);
        setEditingName(page.name);
    };

    const handleCommitRename = () => {
        if (!editingPageId) return;

        const page = pages[editingPageId];
        const nextName = editingName.trim();

        setEditingPageId(null);
        setEditingName("");

        if (!page || !nextName || nextName === page.name) return;

        useNodeStore.getState().updatePage(editingPageId, { name: nextName });
    };

    const handleCancelRename = () => {
        setEditingPageId(null);
        setEditingName("");
    };

    const handleDeletePage = (id) => {
        if (pagesList.length <= 1) return;

        if (editingPageId === id) {
            handleCancelRename();
        }

        useNodeStore.getState().removePage(id);
    };

    return (
        <Flex direction={"column"} h={"100%"} minH={0}>
            <PagesHeader onAddPage={handleAddPage} />

            <VStack align="stretch" gap={0} overflowY="auto" flex={1}>
                {pagesList.map((page) => (
                    <PageRow
                        key={page.id}
                        page={page}
                        isActive={page.id === activePageId}
                        isEditing={page.id === editingPageId}
                        editingName={editingName}
                        onEditingNameChange={setEditingName}
                        onCommitRename={handleCommitRename}
                        onCancelRename={handleCancelRename}
                        onSelect={(id) =>
                            useNodeStore.getState().setActivePage(id)
                        }
                        onStartRename={handleStartRename}
                        onDelete={handleDeletePage}
                        isDeleteDisabled={pagesList.length <= 1}
                    />
                ))}
            </VStack>
        </Flex>
    );
};
