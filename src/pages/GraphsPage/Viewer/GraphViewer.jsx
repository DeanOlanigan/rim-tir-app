import { HStack, IconButton, Card, Icon } from "@chakra-ui/react";
import { LuArrowLeft, LuPause, LuPlay } from "react-icons/lu";
import { useGraphStore } from "../store/store";
import { ExampleChart } from "./TestChart";
import { useRef } from "react";
import { TIME_TYPE } from "../GraphSettings/graphSettingsConstants";
import { generateChartData } from "./useGeneratedChart";
import { createOptions } from "./chartOptions";
import { useChartController } from "../GraphSettings/hooks";

function GraphViewer() {
    const state = useGraphStore((state) => state);
    let data = { labels: [], datasets: [] };
    let options = {};
    if (state.type !== "badapple") {
        data = generateChartData(state);
        options = createOptions(state.type, state.startDate, state.endDate);
    }

    const graphRef = useRef(null);
    const { resetZoom } = useChartController(graphRef);

    const handleBack = () => {
        state.setShowGraph(false);
    };

    return (
        <Card.Root
            w={"100%"}
            shadow={"md"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Card.Header>
                <HStack>
                    <IconButton
                        size={"xs"}
                        shadow={"xs"}
                        variant={"outline"}
                        onClick={handleBack}
                    >
                        <LuArrowLeft />
                    </IconButton>
                    {state.type === TIME_TYPE.real && (
                        <PauseButton graphRef={graphRef} />
                    )}
                </HStack>
            </Card.Header>
            <Card.Body>
                <ExampleChart
                    graphRef={graphRef}
                    data={data}
                    type={state.type}
                    options={options}
                    onDoubleClick={resetZoom}
                />
            </Card.Body>
        </Card.Root>
    );
}

export default GraphViewer;

const PauseButton = ({ graphRef }) => {
    const { togglePause, paused } = useChartController(graphRef);

    return (
        <IconButton size={"xs"} onClick={togglePause}>
            <Icon as={paused ? LuPlay : LuPause} />
        </IconButton>
    );
};
