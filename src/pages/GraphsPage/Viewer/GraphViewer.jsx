import { HStack, IconButton, Card } from "@chakra-ui/react";
import { LuArrowLeft } from "react-icons/lu";
import { useGraphStore } from "../store/store";
import { useGeneratedChart } from "./useGeneratedChart";
import { LiveSimChart } from "./LiveSimChart";

function GraphViewer() {
    const state = useGraphStore((state) => state);
    const getData = {
        points: state.points,
        start: state.startDate,
        end: state.endDate,
        type: state.type,
        variables: Object.values(state.variables),
    };
    //const { chart } = useGeneratedChart(getData);

    const handleBack = () => {
        useGraphStore.getState().setShowGraph(false);
    };

    return (
        <>
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
                    </HStack>
                </Card.Header>
                <Card.Body>
                    <LiveSimChart config={getData} />
                </Card.Body>
            </Card.Root>
        </>
    );
}

export default GraphViewer;
