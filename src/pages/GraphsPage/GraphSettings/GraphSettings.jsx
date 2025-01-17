import { useEffect, useState } from "react";
import { Card, Flex, Stack, Button } from "@chakra-ui/react";

import OffsetOrPeriodPicker from "./OffsetOrPeriodPicker/OffsetOrPeriodPicker";
import PointsCountChooser from "./PointsCountChooser";
import GraphVariable from "./GraphVariable";

const color = "#" + (Math.random().toString(16) + "000000").slice(2, 8).toUpperCase();

function GraphSettings() {
    console.log("Render GraphSettings");
    const [vars, setVars] = useState([]);

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
    }, [vars]);

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
                            <PointsCountChooser />
                            <OffsetOrPeriodPicker />
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
                            <Button
                                size={"xs"}
                                variant={"subtle"}
                                onClick={() => setVars(vars => [...vars, {color: color, variableName: "", variableMeasurement: ""}])}
                            >
                                Добавить переменную
                            </Button>
                        </Stack>
                    </Stack>
                </Card.Body>
            </Card.Root>
            <Button
                shadow={"xl"}
                mt={"4"}
                size={"xs"}
                data-state={"open"}
                animationDuration={"slow"}
                animationStyle={{"_open": "scale-fade-in"}}
            >
                Показать график
            </Button>
        </Flex>
    );
}

export default GraphSettings;