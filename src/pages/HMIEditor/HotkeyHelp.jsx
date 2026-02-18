import {
    Box,
    Heading,
    HStack,
    Kbd,
    SimpleGrid,
    Text,
    VStack,
} from "@chakra-ui/react";
import { HOTKEYS, LOCALE } from "./constants";

const EXTRA_LOCALE = {
    selectTool: "Инструмент: Выбор",
    handTool: "Инструмент: Рука",
    squareTool: "Инструмент: Прямоугольник",
    lineTool: "Инструмент: Линия",
    arrowTool: "Инструмент: Стрелка",
    textTool: "Инструмент: Текст",
    helpDialog: "Открыть справку",
    // Заголовки категорий
    categoryTools: "Инструменты",
    categoryEdit: "Редактирование",
    categoryView: "Просмотр и навигация",
    categoryGrid: "Сетка и направляющие",
    categoryArrange: "Упорядочивание",
    categoryGeneral: "Общее",
};

const HOTKEY_GROUPS = [
    {
        title: EXTRA_LOCALE.categoryTools,
        keys: [
            "selectTool",
            "handTool",
            "squareTool",
            "lineTool",
            "arrowTool",
            "textTool",
        ],
    },
    {
        title: EXTRA_LOCALE.categoryEdit,
        keys: [
            "copy",
            "cut",
            "paste",
            "duplicate",
            "delete",
            "group",
            "ungroup",
            "selectAll",
            "deselectAll",
        ],
    },
    {
        title: EXTRA_LOCALE.categoryView,
        keys: [
            "zoomPlus",
            "zoomMinus",
            "zoomReset",
            "fitToFrame",
            "zoomToSelection",
            "toggleViewOnly",
            "minimizeUi",
            "pageUp",
            "pageDown",
        ],
    },
    {
        title: EXTRA_LOCALE.categoryArrange,
        keys: ["moveToTop", "moveToBottom", "moveUp", "moveDown"],
    },
    {
        title: EXTRA_LOCALE.categoryGrid,
        keys: ["snapToGrid", "toggleGrid", "toggleRulers", "openGridDialog"],
    },
    {
        title: EXTRA_LOCALE.categoryGeneral,
        keys: ["openProject", "helpDialog"],
    },
];

const getActionTitle = (key) => {
    return LOCALE[key] || EXTRA_LOCALE[key] || key;
};

export const HotkeyHelp = () => {
    return (
        <SimpleGrid columns={{ base: 1, md: 2 }} rowGap={8} columnGap={10}>
            {HOTKEY_GROUPS.map((group) => (
                <HotkeyGroup
                    key={group.title}
                    title={group.title}
                    keys={group.keys}
                />
            ))}
        </SimpleGrid>
    );
};

export const HotkeyGroup = ({ title, keys }) => (
    <Box>
        <Heading
            size="xs"
            mb={3}
            textTransform="uppercase"
            color="fg.muted"
            letterSpacing="wide"
        >
            {title}
        </Heading>
        <VStack align="stretch">
            {keys.map((key) => (
                <HotkeyRow key={key} actionKey={key} />
            ))}
        </VStack>
    </Box>
);

const HotkeyRow = ({ actionKey }) => {
    const config = HOTKEYS[actionKey];
    if (!config) return null;

    return (
        <HStack
            justify="space-between"
            width="100%"
            py={1}
            borderBottomWidth="1px"
            borderColor="border.emphasized"
            _last={{ borderBottom: "none" }}
        >
            <Text fontSize="sm" color="fg.subtle">
                {getActionTitle(actionKey)}
            </Text>
            <HStack>
                <Kbd>{config.keyLabel}</Kbd>
            </HStack>
        </HStack>
    );
};
