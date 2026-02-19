import {
    LuCircle,
    LuGroup,
    LuHexagon,
    LuMoveUpRight,
    LuSlash,
    LuSquare,
    LuType,
} from "react-icons/lu";

export const DEFAULT_GRID_SIZE = 10;
export const SCROLL_STRENGTH = 25;
export const DEFAULT_MIN_ZOOM = 0.2;
export const DEFAULT_MAX_ZOOM = 30;
export const FIT_PADDING = 0.85; // 85% of canvas
export const ROTATION_SNAPS = [0, 45, 90, 135, 180, 225, 270, 315, 360];
export const ROTATION_SNAP_TOLERANCE = 15;
export const GRID_OPACITY = 0.3;
export const GRID_MAJOR_STEP = 25;
export const ZOOM_PERCENTAGE_STEP = 0.1;
export const ACTIONS = {
    select: "select",
    hand: "hand",
    square: "square",
    polygon: "polygon",
    ellipse: "ellipse",
    text: "text",
    arrow: "arrow",
    line: "line",
    zoomIn: "zoomIn",
    zoomOut: "zoomOut",
};
export const SHAPES = {
    rect: "rect",
    polygon: "polygon",
    ellipse: "ellipse",
    text: "text",
    line: "line",
    arrow: "arrow",
    group: "group",
};
export const SHAPES_WITH_SETTINGS = new Set([
    SHAPES.rect,
    SHAPES.polygon,
    SHAPES.ellipse,
    SHAPES.text,
    SHAPES.line,
    SHAPES.arrow,
    SHAPES.group,
]);
export const SHAPES_NAMES = {
    [SHAPES.rect]: "Rectangle",
    [SHAPES.polygon]: "Polygon",
    [SHAPES.ellipse]: "Ellipse",
    [SHAPES.text]: "Text",
    [SHAPES.line]: "Line",
    [SHAPES.arrow]: "Arrow",
    [SHAPES.group]: "Group",
};
export const SHAPES_ICONS = {
    [SHAPES.rect]: LuSquare,
    [SHAPES.polygon]: LuHexagon,
    [SHAPES.ellipse]: LuCircle,
    [SHAPES.text]: LuType,
    [SHAPES.line]: LuSlash,
    [SHAPES.arrow]: LuMoveUpRight,
    [SHAPES.group]: LuGroup,
};
export const MAX_POLY_CORNERS = 12;
export const HOTKEYS = {
    selectTool: { hotkey: "v", keyLabel: "V" },
    handTool: { hotkey: "h", keyLabel: "H" },
    squareTool: { hotkey: "r", keyLabel: "R" },
    polygonTool: { hotkey: "p", keyLabel: "P" },
    ellipseTool: { hotkey: "e", keyLabel: "E" },
    textTool: { hotkey: "t", keyLabel: "T" },
    lineTool: { hotkey: "l", keyLabel: "L" },
    arrowTool: { hotkey: "shift+l", keyLabel: "Shift+L" },
    snapToGrid: { hotkey: "ctrl+shift+quote", keyLabel: "Ctrl+Shift+'" },
    toggleGrid: { hotkey: "ctrl+quote", keyLabel: "Shift+'" },
    toggleRulers: { hotkey: "shift+r", keyLabel: "Shift+R" },
    openGridDialog: { hotkey: "ctrl+alt+quote", keyLabel: "Ctrl+Alt+'" },
    openProject: { hotkey: "ctrl+p", keyLabel: "Ctrl+P" },
    toggleViewOnly: { hotkey: "shift+v", keyLabel: "Shift+V" },
    zoomPlus: { hotkey: "ctrl+equal, ctrl+add", keyLabel: "Ctrl++" },
    zoomMinus: { hotkey: "ctrl+minus, ctrl+subtract", keyLabel: "Ctrl+-" },
    zoomReset: { hotkey: "ctrl+0", keyLabel: "Ctrl+0" },
    fitToFrame: { hotkey: "shift+1", keyLabel: "Shift+1" },
    zoomToSelection: { hotkey: "shift+2", keyLabel: "Shift+2" },
    delete: { hotkey: "backspace, delete", keyLabel: "⌫" },
    duplicate: { hotkey: "ctrl+d", keyLabel: "Ctrl+D" },
    moveToTop: { hotkey: "bracketright", keyLabel: "]" },
    moveToBottom: { hotkey: "bracketleft", keyLabel: "[" },
    moveDown: { hotkey: "ctrl+bracketleft", keyLabel: "Ctrl+[" },
    moveUp: { hotkey: "ctrl+bracketright", keyLabel: "Ctrl+]" },
    minimizeUi: { hotkey: "ctrl+shift+backslash", keyLabel: "Ctrl+Shift+\\" },
    pageUp: { hotkey: "pageup", keyLabel: "PageUp" },
    pageDown: { hotkey: "pagedown", keyLabel: "PageDown" },
    selectAll: { hotkey: "ctrl+a", keyLabel: "Ctrl+A" },
    deselectAll: { hotkey: "esc", keyLabel: "Esc" },
    group: { hotkey: "ctrl+g", keyLabel: "Ctrl+G" },
    ungroup: { hotkey: "ctrl+shift+g", keyLabel: "Ctrl+Shift+G" },
    copy: { hotkey: "ctrl+c", keyLabel: "Ctrl+C" },
    cut: { hotkey: "ctrl+x", keyLabel: "Ctrl+X" },
    paste: { hotkey: "ctrl+v", keyLabel: "Ctrl+V" },
    helpDialog: { hotkey: "?", keyLabel: "?" },
};
export const LAYERS_OPS = {
    moveUp: "moveUp",
    moveDown: "moveDown",
    moveToTop: "moveToTop",
    moveToBottom: "moveToBottom",
};
// THUMBNAIL
export const THUMBNAIL_TARGET_WIDTH = 256;
export const THUMBNAIL_TARGET_HEIGHT = 144;
export const THUMBNAIL_PADDING = 20;
export const THUMB_SPEC = {
    path: "thumbnail.png",
    mime: "image/png",
    width: THUMBNAIL_TARGET_WIDTH,
    height: THUMBNAIL_TARGET_HEIGHT,
};
// Project
export const SCHEMA_VERSION = 3;
export const MAX_ARCHIVE_FILES = 1;
export const MAX_ARCHIVE_FILE_SIZE = 15 * 1024 * 1024;
export const MAX_PROJECT_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_THUMB_FILE_SIZE = 5 * 1024 * 1024;
export const MAX_INFLATED_TOTAL_BYTES = 30 * 1024 * 1024;
export const MAX_FILES_IN_ARCHIVE = 16;
export const ALLOWED_PATHS = new Set([
    "manifest.json",
    "manifest.sha256",
    "project.json",
    "thumbnail.png",
]);
// Rulers
export const RULERS_THICKNESS = 20;
export const RULERS_FONT_SIZE = 10;
export const RULERS_TICK_SIZE = 4;
export const RULERS_TEXT_OFFSET = 6;
export const RULERS_BG_COLOR_DARK = "#000";
export const RULERS_BG_COLOR_LIGHT = "#fff";
export const RULERS_TEXT_COLOR_DARK = "#666";
export const RULERS_TEXT_COLOR_LIGHT = "#555";
export const RULERS_LINE_COLOR_DARK = "#555";
export const RULERS_LINE_COLOR_LIGHT = "#666";
export const RULERS_BORDER_COLOR_DARK = "#999";
export const RULERS_BORDER_COLOR_LIGHT = "#ccc";
// Clipboard
export const CLIPBOARD_TYPE = "rimtir/clipboard";
export const CLIPBOARD_TYPE_VERSION = 1;
// Arrow keys
export const MOVE_PRIMITIVE_STRENGTH = 1;
export const ALT_MOVE_PRIMITIVE_STRENGTH = 10;
export const MOVE_CANVAS_STRENGTH = 50;
export const ALT_MOVE_CANVAS_STRENGTH = 100;
// Locale
export const LOCALE = {
    moveToTop: "На передний план",
    moveToBottom: "На задний план",
    moveUp: "Перенести вперед",
    moveDown: "Перенести назад",
    delete: "Удалить",
    duplicate: "Дублировать",
    group: "Группировать",
    ungroup: "Разгруппировать",
    copy: "Копировать",
    cut: "Вырезать",
    paste: "Вставить",
    selectAll: "Выделить все",
    deselectAll: "Снять выделение",
    zoomPlus: "Приблизить",
    zoomMinus: "Отдалить",
    zoomReset: "Сбросить масштаб",
    zoomToSelection: "Приблизить к выделению",
    fitToFrame: "Масштаб по содержимому",
    pageUp: "Вверх",
    pageDown: "Вниз",
    snapToGrid: "Прикрепить к сетке",
    toggleGrid: "Переключить сетку",
    toggleRulers: "Переключить линейки",
    openGridDialog: "Настройки сетки",
    gridSize: "Размер сетки",
    gridSizeError: "Размер сетки должен быть не менее 1",
    gridColor: "Цвет сетки",
    openProject: "Открыть проект",
    projectManager: "Менеджер проектов",
    toggleViewOnly: "Режим просмотра",
    minimizeUi: "Свернуть UI",
    debugMode: "Режим отладки",
    debugInfo: "Отладочная информация",
    debug: "Отладка",
    currentTool: "Текущий инструмент",
    prevTool: "Предыдущий инструмент",
    selectedNodes: "Выбранные узлы",
    nodes: "Узлы",
    multipleNodesSelected: "Выбраны несколько узлов",
    importToServer: "Импорт на сервер",
    download: "Скачать",
    view: "Просмотр",
    editor: "Редактор",
    editGrid: "Редактировать сетку",
    gridEditor: "Редактор сетки",
    project: "Проект",
    showHitRegions: "Показать области попадания",
    showStartCoordMarker: "Показать маркер начальных координат",
    showNodesTree: "Показать дерево узлов",
    showPagesList: "Показать список страниц",
    nodesTree: "Дерево узлов",
    pages: "Страницы",
    newPage: "Новая страница",
    newLib: "Новая библиотека",
    unsavedChanges: "Несохраненные изменения",
    file: "Файл",
    assets: "Ресурсы",
    projectSettings: "Настройки проекта",
    pageBackground: "Фон страницы",
    selected: "Выбрано",
    variables: "Переменные",
    variable: "Переменная",
    value: "Значение",
    styles: "Стили",
    layers: "Слои",
    position: "Позиция",
    layout: "Размещение",
    appearance: "Внешний вид",
    rotation: "Поворот",
    dimensions: "Размеры",
    skew: "Наклон",
    opacity: "Прозрачность",
    cornerRadius: "Скругление",
    sides: "Стороны",
    fill: "Заливка",
    stroke: "Контур",
    strokeWidth: "Толщина контура",
    lineJoin: "Соединение линий",
    lineCap: "Концы линий",
    tension: "Натяжение",
    dash: "Пунктир",
    gap: "Отступ",
    mixed: "Смешанный",
    solid: "Простой",
    dashed: "Пунктирный",
    closePoly: "Закрыть полигон",
    typography: "Типография",
    fontSize: "Размер шрифта",
    text: "Текст",
    lineHeight: "Высота строки",
    letterSpacing: "Промежуток между буквами",
    alignH: "Выравнивание по горизонтали",
    alignV: "Выравнивание по вертикали",
    textWrap: "Перенос текста",
    ellipsis: "Сокращение",
    textDecoration: "Подчеркивание",
    textStyle: "Стиль текста",
    padding: "Отступ",
    base: "Основные",
    bindings: "Привязки",
    actions: "Действия",
    globalVar: "Глобальная переменная",
    liveUpdates: "Обновления в режиме реального времени",
    enableMqttData: "Включить MQTT данные",
    noActiveBindings: "Нет активных привязок",
    addPropertyBinding: "Добавить привязку свойства",
    allPropertiesAdded: "Все свойства добавлены",
    selectVariable: "Выбрать переменную",
    noItemsFound: "Ничего не найдено",
    width: "Ширина",
    height: "Высота",
    override: "Переопределить",
    source: "Источник",
    inherited: "Наследуется",
    notSet: "Не установлено",
    noRulesSet:
        "Правила не определены. Значение будет сохранено как статическое.",
    bindingDirectTab: "Прямая",
    bindingDirectTabDesc:
        "Значение переменной будет применено непосредственно к: ",
    directEditorDesc:
        "Исходное значение переменной будет передано непосредственно в: ",
    directEditorColorWarn:
        '⚠️ Убедитесь, что переменная содержит допустимую шестнадцатеричную строку (например, "#ff0000").',
    bindingMapTab: "По значению",
    bindingMapTabDesc:
        "Соответствие дискретных значений с конкретным параметром. Первое правило имеет наивысший приоритет.",
    bindingThresholdTab: "Порог",
    mapEditor: "Редактор по значению",
    thresholdEditor: "Редактор порога",
    bindingThresholdTabDesc:
        "Пороговое правило. Первое правило имеет наивысший приоритет.",
    fallback: "По умолчанию",
    multipleObjectsSelected: "Выбрано несколько объектов",
    lessThan: "Меньше",
    greaterThan: "Больше",
    between: "Между",
    click: "Клик",
    rightClick: "Правый клик",
    doubleClick: "Двойной клик",
    mouseDown: "Нажатие мыши",
    mouseUp: "Отпускание мыши",
    navigate: "Переход",
    confirmation: "Подтверждение",
    window: "Окно",
    writeTag: "Записать значение",
    toggleTag: "Переключить бит",
    addAction: "Добавить действие",
    noActions: "Нет действий",
    noSettingsForThisType: "Нет настроек для этого типа",
    title: "Название",
    message: "Сообщение",
    confirmationText: "Текст подтверждения",
    cancelText: "Текст отмены",
    navigateTo: "Переход",
    navigateToTag: "Переход по тегу",
    navigateToTagValue: "Значение тега",
    page: "Страница",
    url: "URL",
    urlAddress: "Адрес URL",
    selectPage: "Выбрать страницу",
    apply: "Применить",
    cancel: "Отмена",
    projectLoadingError: "Ошибка загрузки проекта",
    projectsLoadingError: "Ошибка загрузки проектов",
    projectsLoading: "Загрузка проектов",
    projectLoading: "Загрузка проекта",
    projectSaved: "Проект сохранен",
    projectSavedAs: "Проект сохранен как",
    projectSavedError: "Ошибка сохранения проекта",
    projectSavedAsError: "Ошибка сохранения проекта как",
    projectDeleted: "Проект удален",
    openFromPC: "Открыть с ПК",
    openFromPCDesc: "Выберите .json файл",
    newProject: "Новый проект",
};
