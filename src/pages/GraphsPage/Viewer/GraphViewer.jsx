import { HStack, IconButton, Card, Icon } from "@chakra-ui/react";
import { LuArrowLeft, LuPause, LuPlay } from "react-icons/lu";
import { useGraphStore } from "../store/store";
import { ExampleChart } from "./TestChart";
import { useRef, useState } from "react";
import { TIME_TYPE } from "../GraphSettings/graphSettingsConstants";

function GraphViewer() {
    const state = useGraphStore((state) => state);

    const graphRef = useRef(null);

    const handleBack = () => {
        useGraphStore.getState().setShowGraph(false);
    };

    return (
        <Card.Root
            w={"100%"}
            shadow={"xl"}
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
                    state={state}
                    graphRef={graphRef}
                    type={state.type}
                />
            </Card.Body>
        </Card.Root>
    );
}

export default GraphViewer;

const PauseButton = ({ graphRef }) => {
    const [isPaused, setIsPaused] = useState(false);
    const handlePause = () => {
        const realtTimeOps = graphRef.current.options.scales.x.realtime;
        realtTimeOps.pause = !realtTimeOps.pause;
        graphRef.current.update("none");
        setIsPaused((prev) => !prev);
    };

    return (
        <IconButton size={"xs"} onClick={handlePause}>
            <Icon as={isPaused ? LuPlay : LuPause} />
        </IconButton>
    );
};
