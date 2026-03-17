import { RADII_MAIN } from "@/config/constants";
import { Flex } from "@chakra-ui/react";
import { useRef } from "react";
import { Line } from "react-chartjs-2";
import { useBadApple } from "../GraphsPage/Viewer/fun";
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "chartjs-adapter-luxon";
import zoomPlugin from "chartjs-plugin-zoom";
import {
    RealTimeScale,
    StreamingPlugin,
} from "@robloche/chartjs-plugin-streaming";

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin,
    RealTimeScale,
    StreamingPlugin,
);

export const GraphBlock = () => {
    const graphRef = useRef(null);
    useBadApple(graphRef, "badapple");
    return (
        <Flex
            px={6}
            py={4}
            gap={4}
            bg={"bg.panel"}
            borderRadius={RADII_MAIN}
            shadow={"md"}
            w={"full"}
            flex={1}
            minH={0}
        >
            <Line ref={graphRef} data={{ labels: [], datasets: [] }} />
        </Flex>
    );
};
