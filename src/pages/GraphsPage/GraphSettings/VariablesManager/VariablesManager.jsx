import { useEffect } from "react";
import { Flex, Button } from "@chakra-ui/react";

import GraphVariable from "./GraphVariable";
import { useGraphContext } from "../../../../providers/GraphProvider/GraphContext";

function VariablesManager() {
    console.log("Render VariablesManager");
    const { variables, addVariable, removeVariable, updateVariable } = useGraphContext();

    useEffect(() => {
        console.log(variables);
    }, [variables]);
    
    return (
        <>
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
                    variables.map((variable, index) => (
                        <GraphVariable 
                            key={index}
                            index={index}
                            variable={variable}
                            removeVariable={removeVariable}
                            updateVariable={updateVariable}
                        />
                    ))
                }
            </Flex>
            <Button
                size={"xs"}
                variant={"subtle"}
                onClick={() => addVariable()}
            >
                Добавить переменную
            </Button>
        </>
    );
};

export default VariablesManager;
