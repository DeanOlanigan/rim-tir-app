import { Card, Flex, Stack, Group } from "@chakra-ui/react";
import OffsetOrPeriodPicker from "./OffsetOrPeriodPicker/OffsetOrPeriodPicker";
import PointsCountChooser from "./PointsCountChooser";
import VariablesManager from "./VariablesManager/VariablesManager";
import ViewGraphButton from "./ViewGraphButton";
//import { useGraphContext } from "@/providers/GraphProvider/GraphContext";

function GraphSettings() {
    console.log("Render GraphSettings");
    //const { createMessageForWS, variables } = useGraphContext();

    return (
        <Flex
            w={"2xl"}
            maxW={"2xl"}
            alignSelf={"center"}
            direction={"column"}
            gap={"2"}
        >
            <Card.Root
                shadow={"xl"}
                data-state={"open"}
                animationDuration={"slow"}
                animationStyle={{ _open: "scale-fade-in" }}
            >
                <Card.Header>
                    <Card.Title>Настройки отображения</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Stack h={"270px"} gap={"2"} direction={"row"}>
                        <Stack w={"30%"} h={"full"} p={"2"}>
                            <PointsCountChooser />
                            <OffsetOrPeriodPicker />
                        </Stack>
                        <Stack w={"70%"} h={"full"} p={"2"}>
                            <VariablesManager />
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card.Root>
            <Group grow>
                <ViewGraphButton />
            </Group>
        </Flex>
    );
}

export default GraphSettings;
