import { Box, Card, Flex, Icon, IconButton, Stack } from "@chakra-ui/react";
import { OffsetOrPeriodPicker } from "./OffsetOrPeriodPicker/OffsetOrPeriodPicker";
import { PointsCountChooser } from "./PointsCountChooser";
import { VariablesManager } from "./VariablesManager/VariablesManager";
import { ViewGraphButton } from "./ViewGraphButton";
import { LuApple } from "react-icons/lu";
import { useGraphStore } from "../store/store";
import { useNavigate } from "react-router-dom";

function GraphSettings() {
    return (
        <Flex
            direction={"column"}
            gap={"2"}
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{ _open: "scale-fade-in" }}
        >
            <Card.Root shadow={"xl"}>
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
            </Card.Root>
            <Stack w={"100%"} direction={"row"}>
                <Box w={"100%"}>
                    <ViewGraphButton />
                </Box>
                <BadApple />
            </Stack>
        </Flex>
    );
}

const BadApple = () => {
    const { setType, setShowGraph } = useGraphStore.getState();
    const navigate = useNavigate();

    const handleClick = () => {
        setType("badapple");
        setShowGraph(true);
        navigate("/graph/viewer");
    };

    return (
        <IconButton size={"xs"} variant={"ghost"} onClick={handleClick}>
            <Icon as={LuApple} fill={"colorPalette.fg"} />
        </IconButton>
    );
};

export default GraphSettings;
