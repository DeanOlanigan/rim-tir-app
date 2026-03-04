import { Group, Rect, Text } from "react-konva";
import { useActionsStore } from "../store/actions-store";
import { useNodeStore } from "../store/node-store";
import { useSelectionBounds } from "../store/interactive-store";

export const SelectionSize = () => {
    const scale = useActionsStore((state) => state.scale);
    const selectedIds = useNodeStore((state) => state.selectedIds);
    const dim = useSelectionBounds(selectedIds);

    if (!dim) return null;

    const safeScale = scale || 1;

    // размеры лейбла в "экранных" пикселях, компенсированные текущим zoom
    const fontSize = 12 / safeScale;
    const paddingX = 6 / safeScale;
    const paddingY = 3 / safeScale;
    const gap = 8 / safeScale;
    const radius = 4 / safeScale;

    const textValue = `${Math.round(dim.width)} × ${Math.round(dim.height)}`;

    // грубая оценка ширины текста без measureText
    const textWidth = textValue.length * fontSize * 0.62;
    const labelWidth = textWidth + paddingX * 2;
    const labelHeight = fontSize + paddingY * 2;

    const x = dim.x + dim.width / 2 - labelWidth / 2;
    const y = dim.y + dim.height + gap;

    return (
        <Group x={x} y={y} listening={false}>
            <Rect
                width={labelWidth}
                height={labelHeight}
                cornerRadius={radius}
                fill={"rgb(0, 161, 255)"}
                strokeScaleEnabled={false}
                listening={false}
            />
            <Text
                width={labelWidth}
                height={labelHeight}
                text={textValue}
                fontSize={fontSize}
                fill={"white"}
                align="center"
                verticalAlign="middle"
                fontStyle="bold"
                listening={false}
            />
        </Group>
    );
};
