import { DownloadTrigger } from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import JSZip from "jszip";
import { getWorkAreaSize } from "../utils";
import Konva from "konva";

function exportProject(state) {
    return {
        kind: "HMIEditorProject",
        schemaVersion: 2,
        projectName: state.projectName,
        activePageId: state.activePageId,
        pages: state.pages,
        nodes: state.nodes,
    };
}

/* const data = async () => {
    const state = useNodeStore.getState();
    const project = exportProject(state);
    return JSON.stringify(project, null, 2);
}; */

// Целевые размеры миниатюры
const TARGET_WIDTH = 256;
const TARGET_HEIGHT = 144;
const PADDING = 20; // Отступ от краев внутри миниатюры

function generateTumbnail(nodesLayer, nodesRef) {
    return new Promise((resolve) => {
        const workArea = getWorkAreaSize(nodesRef);
        const stage = nodesLayer.getStage();
        if (!workArea) {
            resolve(null);
            return;
        }

        // Доступное место для самой схемы (внутри паддинга)
        const contentWidth = TARGET_WIDTH - PADDING * 2;
        const contentHeight = TARGET_HEIGHT - PADDING * 2;

        // 2. Считаем масштаб (scale)
        // Нам нужно вписать workArea (W x H) в content (W x H)
        // Берем минимум, чтобы влезло по обеим сторонам (cover vs contain -> нам нужен contain)
        const scaleX = contentWidth / workArea.width;
        const scaleY = contentHeight / workArea.height;
        const scale = Math.min(scaleX, scaleY);

        // 3. Считаем позицию для центрирования
        // Размеры схемы ПОСЛЕ масштабирования
        const scaledWorkWidth = workArea.width * scale;
        const scaledWorkHeight = workArea.height * scale;

        // Центрируем внутри 256x144
        // (Ширина контейнера - Ширина контента) / 2 = отступ слева
        const offsetX = (TARGET_WIDTH - scaledWorkWidth) / 2;
        const offsetY = (TARGET_HEIGHT - scaledWorkHeight) / 2;

        // 4. Магия Konva: сохраняем текущее состояние
        const oldScale = stage.scale();
        const oldPos = stage.position();

        // 5. Применяем трансформацию к Stage для снимка
        // Мы хотим, чтобы workArea.x/y (левый верхний угол схемы)
        // оказался в точке (offsetX, offsetY) на итоговой картинке.
        // Формула: НоваяПозиция = СмещениеЦентра - (НачалоСхемы * Масштаб)
        stage.scale({ x: scale, y: scale });
        stage.position({
            x: offsetX - workArea.x * scale,
            y: offsetY - workArea.y * scale,
        });

        const bgRect = new Konva.Rect({
            x: workArea.x - 1000, // С запасом
            y: workArea.y - 1000,
            width: workArea.width + 2000,
            height: workArea.height + 2000,
            fill: "#ffffff", // Цвет фона миниатюры
            listening: false, // Чтобы не мешал событиям
        });
        nodesLayer.add(bgRect);
        bgRect.moveToBottom();

        nodesLayer.toBlob({
            callback: (blob) => resolve(blob),
            x: 0,
            y: 0,
            width: TARGET_WIDTH,
            height: TARGET_HEIGHT,
            pixelRatio: 1,
            mimeType: "image/png",
            quality: 0.8,
        });

        stage.scale(oldScale);
        stage.position(oldPos);
        bgRect.destroy();
    });
}

export const DownloadProject = ({ children, tools }) => {
    const generateZipData = async () => {
        const state = useNodeStore.getState();
        const project = exportProject(state);

        const zip = new JSZip();

        zip.file("project.json", JSON.stringify(project, null, 2));

        const nodesLayer = tools.api.getNodesLayer();
        const nodesRef = tools.nodesRef;
        if (nodesLayer && nodesRef) {
            try {
                const thumbBlob = await generateTumbnail(nodesLayer, nodesRef);

                if (thumbBlob) {
                    zip.file("thumbnail.png", thumbBlob);
                }
            } catch (e) {
                console.error(e);
            }
        }

        const content = await zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 6 },
        });

        return content;
    };

    return (
        <DownloadTrigger
            data={generateZipData}
            fileName={`${useNodeStore.getState().projectName || "project"}.tir-project`}
            mimeType="application/zip"
            asChild
        >
            {children}
        </DownloadTrigger>
    );
};
