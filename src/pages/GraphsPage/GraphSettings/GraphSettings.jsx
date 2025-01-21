import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Flex, Stack, Button, HStack } from "@chakra-ui/react";

import OffsetOrPeriodPicker from "./OffsetOrPeriodPicker/OffsetOrPeriodPicker";
import PointsCountChooser from "./PointsCountChooser";
import GraphVariable from "./GraphVariable";

const startDate = new Date();
startDate.setDate(startDate.getDate() - 3);
startDate.setMinutes(Math.round(startDate.getMinutes() / 15) * 15);

const endDate = new Date();
endDate.setDate(endDate.getDate());
endDate.setMinutes(Math.round(endDate.getMinutes() / 15) * 15);

const getRandomColor = () => {
    return ("#" + (Math.random().toString(16) + "000000").slice(2, 8).toUpperCase());
};

function GraphSettings() {
    console.log("Render GraphSettings");
    const navigate = useNavigate();
    const [graphSettings, setGraphSettings] = useState({
        maxPointsCount: 100,
        isWsActive: true,
        offset: 120,
        startDate: startDate,
        endDate: endDate,
    });
    const [isViewerAllowed, setIsViewerAllowed] = useState(false);
    const [vars, setVars] = useState([]);

    const addVariable = () => {
        setVars((prevVars) => [...prevVars, { color: getRandomColor(), variableName: "", variableMeasurement: "" }]);
    };

    const updateVariable = (index, updatedVariable) => {
        setVars((prevVars) =>
            prevVars.map((variable, i) => (i === index ? updatedVariable : variable))
        );
    };
    
    const removeVariable = (index) => {
        setVars((prevVars) => prevVars.filter((_, i) => i !== index));
    };

    useEffect(() => {
        console.log(vars);
        setIsViewerAllowed(
            vars.length > 0 &&
                vars.every(
                    (variable) =>
                        variable.color &&
                        variable.variableMeasurement &&
                        variable.variableName
                )
        );
    }, [vars]);

    useEffect(() => {
        console.log(graphSettings);
    }, [graphSettings]);

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
                        <Stack
                            w={"30%"}
                            h={"full"}
                            p={"2"}
                        >
                            <PointsCountChooser
                                maxPointsCount={graphSettings.maxPointsCount}
                                onChange={(newValue) => setGraphSettings({
                                    ...graphSettings,
                                    maxPointsCount: newValue
                                })}
                            />
                            <OffsetOrPeriodPicker settings={graphSettings} setSettings={setGraphSettings} />
                        </Stack>
                        <Stack
                            w={"70%"}
                            h={"full"}
                            p={"2"}
                        >
                            <Flex
                                w={"100%"}
                                flex={"1"}
                                overflow={"auto"}
                                borderColor={"border"}
                                borderStyle={"solid"}
                                borderWidth={"1px"}
                                p={"2"}
                                rounded={"md"}
                                gap={"2"}
                                direction={"column"}
                            >
                                {
                                    vars.map((variable, index) => (
                                        <GraphVariable 
                                            key={index}
                                            variable={variable}
                                            updateVariable={updateVariable}
                                            removeVariable={removeVariable}
                                            index={index}
                                        />
                                    ))
                                }
                            </Flex>
                            {/* <AddGraphVariableMenu /> */}
                            <HStack>
                                <Button
                                    size={"xs"}
                                    variant={"subtle"}
                                    onClick={() => addVariable()}
                                >
                                    Добавить переменную
                                </Button>
                                <Button
                                    size={"xs"}
                                    onClick={() => {
                                        console.log(vars);
                                    }}
                                >
                                    test
                                </Button>
                            </HStack>
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
                    console.log({
                        ...graphSettings,
                        variables: vars
                    });
                    navigate("viewer");
                }}
            >
                Показать график
            </Button>
        </Flex>
    );
}

export default GraphSettings;
