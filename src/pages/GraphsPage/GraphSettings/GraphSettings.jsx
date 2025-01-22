import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Flex, Stack, Button } from "@chakra-ui/react";

import OffsetOrPeriodPicker from "./OffsetOrPeriodPicker/OffsetOrPeriodPicker";
import PointsCountChooser from "./PointsCountChooser";
import VariablesManager from "./VariablesManager/VariablesManager";

import { useGraphContext } from "../../../providers/GraphProvider/GraphContext";

function GraphSettings() {
    console.log("Render GraphSettings");
    const navigate = useNavigate();
    const { createMessageForWS, variables } = useGraphContext();
    const [isViewerAllowed, setIsViewerAllowed] = useState(false);

    useEffect(() => {
        setIsViewerAllowed(
            variables.length > 0 &&
            variables.every(
                (variable) =>
                    variable.color &&
                    variable.variableMeasurement &&
                    variable.variableName
            )
        );
    }, [variables]);

    return (
        <Flex
            w={"2xl"}
            maxW={"2xl"}
            alignSelf={"center"}
            direction={"column"}
        >
            <Card.Root
                shadow={"xl"}
                data-state={"open"}
                animationDuration={"slow"}
                animationStyle={{"_open": "scale-fade-in"}}
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
            <Button
                disabled={!isViewerAllowed}
                shadow={"xl"}
                mt={"4"}
                size={"xs"}
                data-state={"open"}
                animationDuration={"slow"}
                animationStyle={{"_open": "scale-fade-in"}}
                onClick={() => {
                    console.log(createMessageForWS());
                    navigate("viewer");
                }}
            >
                Показать график
            </Button>
        </Flex>
    );
}

export default GraphSettings;
