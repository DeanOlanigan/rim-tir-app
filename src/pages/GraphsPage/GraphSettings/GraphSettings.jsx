import { Box, Card, Flex, Icon, IconButton, Stack } from "@chakra-ui/react";
import { OffsetOrPeriodPicker } from "./OffsetOrPeriodPicker/OffsetOrPeriodPicker";
import { PointsCountChooser } from "./PointsCountChooser";
import { VariablesManager } from "./VariablesManager/VariablesManager";
import { ViewGraphButton } from "./ViewGraphButton";
import { LuApple } from "react-icons/lu";
import { useGraphStore } from "../store/store";

function GraphSettings() {
    return (
        <Card.Root
            shadow={"xl"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{ _open: "scale-fade-in" }}
        >
            <Card.Header>
                <Card.Title>Настройки отображения</Card.Title>
            </Card.Header>
            <Card.Body gap={"2"}>
                <PointsCountChooser />
                <Stack gap={"2"} direction={"row"} h={"xs"}>
                    <OffsetOrPeriodPicker />
                    <VariablesManager />
                </Stack>
            </Card.Body>
            <Card.Footer>
                <ViewGraphButton />
                <BadApple />
            </Card.Footer>
        </Card.Root>
    );
}

const BadApple = () => {
    const { setType, setShowGraph } = useGraphStore.getState();

    const handleClick = () => {
        setType("badapple");
        setShowGraph(true);
    };

    return (
        <IconButton size={"xs"} variant={"ghost"} onClick={handleClick}>
            <Icon as={LuApple} fill={"colorPalette.fg"} />
        </IconButton>
    );
};

export default GraphSettings;
