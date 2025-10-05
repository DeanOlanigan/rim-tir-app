import { Card, Flex, Stack } from "@chakra-ui/react";
import { OffsetOrPeriodPicker } from "./OffsetOrPeriodPicker/OffsetOrPeriodPicker";
import { PointsCountChooser } from "./PointsCountChooser";
import { VariablesManager } from "./VariablesManager/VariablesManager";
import { ViewGraphButton } from "./ViewGraphButton";

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
            <ViewGraphButton />
        </Flex>
    );
}

export default GraphSettings;
