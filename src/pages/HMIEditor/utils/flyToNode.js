import Konva from "konva";
import { useActionsStore } from "../store/actions-store";
import { getWorkAreaSize } from ".";

/**
 * Плавно "подлетает" к ноде или набору нод: центрирует их во вьюпорте.
 * nodeOrNodes — либо Konva.Node, либо массив Konva.Node.
 * opts:
 *  - duration, padding, zoomToFit, minScale, maxScale, easing, tweenRef
 */
export function flyToNode(stage, target, opts) {
    const {
        duration = 0.35,
        padding = 250,
        zoomToFit = false,
        minScale = 0.1,
        maxScale = 30,
        easing = Konva.Easings.EaseInOut,
        tweenRef,
    } = opts ?? {};

    if (!stage || !target) return;

    // Остановить предыдущую анимацию, если была
    if (tweenRef?.current) {
        tweenRef.current.destroy?.();
        tweenRef.current = null;
    }

    let nodesRef;

    if (target.current?.size !== undefined) {
        // это уже nodesRef
        nodesRef = target;
    } else {
        // это node или node[]
        const set = new Set(Array.isArray(target) ? target : [target]);
        nodesRef = { current: set };
    }

    const rect = getWorkAreaSize({ nodesRef });
    if (!rect) return;

    const centerWorld = {
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
    };

    const viewportW = stage.width();
    const viewportH = stage.height();

    const currentScale = stage.scaleX(); // предполагаем uniform scale

    // Если нужен zoom-to-fit — оценим размеры ноды в world по текущему scale
    const worldW = rect.width;
    const worldH = rect.height;

    let nextScale = currentScale;
    if (zoomToFit) {
        const scaleW = (viewportW - padding * 2) / worldW;
        const scaleH = (viewportH - padding * 2) / worldH;
        const s = Math.min(scaleW, scaleH);
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

            tween.destroy?.();
            if (tweenRef) tweenRef.current = null;
        },
    });

    if (tweenRef) tweenRef.current = tween;
    tween.play();
}
