import { Star } from "react-konva";
import { useActionsStore } from "../store/actions-store";

export const StartCoords = () => {
    const viewOnlyMode = useActionsStore((state) => state.viewOnlyMode);
    const showStartCoordMarker = useActionsStore(
        (state) => state.showStartCoordMarker,
    );
    return (
        showStartCoordMarker &&
        !viewOnlyMode && (
            <Star
                x={0}
                y={0}
                numPoints={4}
                innerRadius={1}
                stroke={"black"}
                strokeWidth={0.2}
            />
        )
    );
};
