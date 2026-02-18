import Konva from "konva";
import { getWorkAreaSize } from "@/pages/HMIEditor/utils";
import {
    THUMBNAIL_PADDING,
    THUMBNAIL_TARGET_HEIGHT,
    THUMBNAIL_TARGET_WIDTH,
} from "../constants";

export async function generateThumbnail(nodesLayer, nodesRef, bgColor) {
    return new Promise((resolve) => {
        const workArea = getWorkAreaSize(nodesRef);
        const stage = nodesLayer?.getStage();

        if (
            !stage ||
            !workArea ||
            workArea.width <= 0 ||
            workArea.height <= 0
        ) {
            resolve(null);
            return;
        }

        // Доступное место для самой схемы (внутри паддинга)
        const contentWidth = THUMBNAIL_TARGET_WIDTH - THUMBNAIL_PADDING * 2;
        const contentHeight = THUMBNAIL_TARGET_HEIGHT - THUMBNAIL_PADDING * 2;

        // 2. Считаем масштаб (scale)
        // Нам нужно вписать workArea (W x H) в content (W x H)
        // Берем минимум, чтобы влезло по обеим сторонам (cover vs contain -> нам нужен contain)
        const scale = Math.min(
            contentWidth / workArea.width,
            contentHeight / workArea.height,
        );

        // 3. Считаем позицию для центрирования
        // Размеры схемы ПОСЛЕ масштабирования
        const scaledW = workArea.width * scale;
        const scaledH = workArea.height * scale;

        // Центрируем внутри 256x144
        // (Ширина контейнера - Ширина контента) / 2 = отступ слева
        const offsetX = (THUMBNAIL_TARGET_WIDTH - scaledW) / 2;
        const offsetY = (THUMBNAIL_TARGET_HEIGHT - scaledH) / 2;

        // 4. Магия Konva: сохраняем текущее состояние
        const oldScale = stage.scale();
        const oldPos = stage.position();

        const bgRect = new Konva.Rect({
            x: workArea.x - 1000,
            y: workArea.y - 1000,
            width: workArea.width + 2000,
            height: workArea.height + 2000,
            fill: bgColor,
            listening: false,
        });

        nodesLayer.add(bgRect);
        bgRect.moveToBottom();

        stage.scale({ x: scale, y: scale });
        stage.position({
            x: offsetX - workArea.x * scale,
            y: offsetY - workArea.y * scale,
        });

        nodesLayer.toBlob({
            callback: (blob) => {
                // restore строго после снимка
                stage.scale(oldScale);
                stage.position(oldPos);
                bgRect.destroy();

                resolve(blob ?? null);
            },
            x: 0,
            y: 0,
            width: THUMBNAIL_TARGET_WIDTH,
            height: THUMBNAIL_TARGET_HEIGHT,
            pixelRatio: 1,
            mimeType: "image/png",
            quality: 0.8,
        });
    });
}
