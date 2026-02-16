import { useColorMode } from "@/components/ui/color-mode";
import { useCallback } from "react";
import { Shape } from "react-konva";
import { useActionsStore } from "../store/actions-store";
import {
    RULERS_BG_COLOR_DARK,
    RULERS_BG_COLOR_LIGHT,
    RULERS_BORDER_COLOR_DARK,
    RULERS_BORDER_COLOR_LIGHT,
    RULERS_FONT_SIZE,
    RULERS_LINE_COLOR_DARK,
    RULERS_LINE_COLOR_LIGHT,
    RULERS_TEXT_COLOR_DARK,
    RULERS_TEXT_COLOR_LIGHT,
    RULERS_TEXT_OFFSET,
    RULERS_THICKNESS,
    RULERS_TICK_SIZE,
} from "../constants";

function getStepSize(scale) {
    const minScreenSpace = 50;
    const stepInUnits = minScreenSpace / scale;

    const magnitude = Math.pow(10, Math.floor(Math.log10(stepInUnits)));
    const residual = stepInUnits / magnitude;

    if (residual > 5) return 10 * magnitude;
    if (residual > 2) return 5 * magnitude;
    if (residual > 1) return 2 * magnitude;
    return magnitude;
}

function drawRuler({ ctx, shape, style }) {
    const stage = shape.getStage();
    if (!stage) return;

    const layer = shape.getLayer();
    const pixelRatio =
        layer?.getCanvas?.().getPixelRatio?.() ?? window.devicePixelRatio ?? 1;

    // Размеры вьюпорта (экрана)
    const vw = stage.width();
    const vh = stage.height();

    // Текущая трансформация сцены
    const scale = stage.scaleX();
    const sx = stage.x();
    const sy = stage.y();

    // Вычисляем шаг линейки
    const step = getStepSize(scale);

    ctx.save();
    // Сбрасываем трансформацию, чтобы рисовать интерфейс поверх всего
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(pixelRatio, pixelRatio);

    // --- 1. Фон и базовые стили ---
    ctx.fillStyle = style.rulerBg;
    // Горизонтальная
    ctx.fillRect(0, 0, vw, RULERS_THICKNESS);
    // Вертикальная
    ctx.fillRect(0, 0, RULERS_THICKNESS, vh);
    // Квадратик в углу (пересечение)
    ctx.fillRect(0, 0, RULERS_THICKNESS, RULERS_THICKNESS);

    // Настройки шрифта
    ctx.font = `${RULERS_FONT_SIZE}px sans-serif`;
    ctx.lineWidth = 2;
    ctx.strokeStyle = style.rulerLine;
    ctx.fillStyle = style.rulerText;

    // Выравнивание текста
    ctx.textAlign = "center";
    ctx.textBaseLine = "bottom";

    ctx.beginPath();

    // --- 2. Горизонтальная линейка (Ось X) ---
    // Определяем диапазон видимых значений сцены
    const startValueX = Math.floor(-sx / scale / step) * step;
    const endValueX = Math.ceil((vw - sx) / scale / step) * step;

    // Бежим по "виртуальным" координатам с шагом step
    for (let val = startValueX; val <= endValueX; val += step) {
        // Проецируем виртуальную координату в экранную
        const screenX = val * scale + sx;

        // Не рисуем, если залезли на вертикальную линейку
        if (screenX < RULERS_THICKNESS + RULERS_FONT_SIZE) continue;

        // Длинная риска + Текст
        const px = Math.round(screenX);
        ctx.moveTo(px, RULERS_THICKNESS);
        ctx.lineTo(px, RULERS_THICKNESS - RULERS_TICK_SIZE);

        // Текст смещаем немного вправо от риски
        ctx.fillText(
            Math.round(val).toString(),
            px,
            RULERS_THICKNESS - RULERS_TICK_SIZE - RULERS_TEXT_OFFSET,
        );
    }

    // --- 3. Вертикальная линейка (Ось Y) ---
    const startValueY = Math.floor(-sy / scale / step) * step;
    const endValueY = Math.ceil((vh - sy) / scale / step) * step;

    for (let val = startValueY; val <= endValueY; val += step) {
        const screenY = val * scale + sy;

        if (screenY < RULERS_THICKNESS + RULERS_FONT_SIZE) continue;

        const py = Math.round(screenY);
        ctx.moveTo(RULERS_THICKNESS, py);
        ctx.lineTo(RULERS_THICKNESS - RULERS_TICK_SIZE, py);

        // Для вертикального текста: сохраняем, поворачиваем, рисуем, восстанавливаем
        ctx.save();
        ctx.translate(
            RULERS_THICKNESS - RULERS_TICK_SIZE - RULERS_TEXT_OFFSET,
            py,
        );
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(Math.round(val).toString(), 0, 0);
        ctx.restore();
    }

    ctx.stroke();

    // --- 4. Рамка линейки ---
    // Рисуем рамку границы линеек для красоты
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = style.rulerBorder;
    // Вертикальная черта границы
    ctx.moveTo(RULERS_THICKNESS + 0.5, 0);
    ctx.lineTo(RULERS_THICKNESS + 0.5, vh);
    // Горизонтальная черта границы
    ctx.moveTo(0, RULERS_THICKNESS + 0.5);
    ctx.lineTo(vw, RULERS_THICKNESS + 0.5);

    ctx.stroke();
    ctx.restore();
}

const rulersDarkStyle = {
    rulerBg: RULERS_BG_COLOR_DARK,
    rulerLine: RULERS_LINE_COLOR_DARK,
    rulerText: RULERS_TEXT_COLOR_DARK,
    rulerBorder: RULERS_BORDER_COLOR_DARK,
};
const rulersLightStyle = {
    rulerBg: RULERS_BG_COLOR_LIGHT,
    rulerLine: RULERS_LINE_COLOR_LIGHT,
    rulerText: RULERS_TEXT_COLOR_LIGHT,
    rulerBorder: RULERS_BORDER_COLOR_LIGHT,
};

export const Ruler = () => {
    const showRulers = useActionsStore((state) => state.showRulers);
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const { colorMode } = useColorMode();
    const isDark = colorMode === "dark";

    const sceneFunc = useCallback(
        (ctx, shape) => {
            const style = isDark ? rulersDarkStyle : rulersLightStyle;
            drawRuler({ ctx, shape, style });
        },
        [isDark],
    );

    return (
        showRulers &&
        !viewOnlyMode && (
            <Shape
                perfectDrawEnabled={false}
                shadowForStrokeEnabled={false}
                listening={false}
                sceneFunc={sceneFunc}
            />
        )
    );
};
