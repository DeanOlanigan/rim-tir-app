import { useActionsStore } from "../../store/actions-store";
import { fitStageToWork, zoomPercent, zoomTo } from "./zoom";

function updateUiScale(scale) {
    useActionsStore.getState().setScale(scale);
}

export function zoomByPercent(stage, dir, pointer) {
    const nextScale = zoomPercent(stage, dir, pointer);
    updateUiScale(nextScale);
}

export function setZoom(stage, scale, pointer) {
    const nextScale = zoomTo(stage, scale, pointer);
    updateUiScale(nextScale);
}

export function fitToFrame(stage, workArea, viewportW, viewportH) {
    const nextScale = fitStageToWork(stage, workArea, viewportW, viewportH);
    updateUiScale(nextScale);
}
