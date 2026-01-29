import Konva from "konva";
import { useActionsStore } from "./store/actions-store";

/**
 * Плавно "подлетает" к ноде: центрирует её во вьюпорте.
 * Опционально может подобрать scale так, чтобы нода влезла (zoomToFit).
 */
export function flyToNode(stage, node, opts) {
    const {
        duration = 0.35,
        padding = 0,
        zoomToFit = false,
        minScale = 0.1,
        maxScale = 30,
        easing = Konva.Easings.EaseInOut,
        tweenRef,
    } = opts ?? {};

    if (!stage || !node) return;

    // Остановить предыдущую анимацию, если была
    if (tweenRef?.current) {
        tweenRef.current.destroy();
        tweenRef.current = null;
    }

    // bounding box ноды в "экранных" координатах (с учетом текущего pan/zoom stage)
    const r = node.getClientRect({ skipTransform: false });

    // Переведем центр этого rect в "мировые" координаты (stage-local),
    // используя инверсию абсолютного трансформа stage.
    const inv = stage.getAbsoluteTransform().copy().invert();
    const centerWorld = inv.point({
        x: r.x + r.width / 2,
        y: r.y + r.height / 2,
    });

    const viewportW = stage.width();
    const viewportH = stage.height();

    const currentScale = stage.scaleX(); // предполагаем uniform scale

    // Если нужен zoom-to-fit — оценим размеры ноды в world по текущему scale
    const worldW = r.width / currentScale;
    const worldH = r.height / currentScale;

    let nextScale = currentScale;
    if (zoomToFit) {
        const s = Math.min(
            viewportW / (worldW + padding * 2),
            viewportH / (worldH + padding * 2),
        );
        nextScale = Math.max(minScale, Math.min(maxScale, s));
    }

    // Хотим, чтобы centerWorld попал в центр экрана:
    const nextPos = {
        x: viewportW / 2 - centerWorld.x * nextScale,
        y: viewportH / 2 - centerWorld.y * nextScale,
    };

    let rafId = 0;
    let pending = false;

    const pushScaleToStore = () => {
        pending = false;
        rafId = 0;
        useActionsStore.getState().setScale(stage.scaleX()); // если у тебя scale единый
    };

    const scheduleStoreSync = () => {
        if (pending) return;
        pending = true;
        rafId = requestAnimationFrame(pushScaleToStore);
    };

    stage.off(".flySync"); // на всякий
    stage.on("scaleXChange.flySync scaleYChange.flySync", scheduleStoreSync);

    scheduleStoreSync();

    const tween = new Konva.Tween({
        node: stage,
        duration,
        x: nextPos.x,
        y: nextPos.y,
        scaleX: nextScale,
        scaleY: nextScale,
        easing,
        onFinish: () => {
            useActionsStore.getState().setScale(nextScale);
            stage.off(".flySync");
            if (rafId) cancelAnimationFrame(rafId);

            tween.destroy();
            if (tweenRef) tweenRef.current = null;
        },
    });

    if (tweenRef) tweenRef.current = tween;
    tween.play();
}
