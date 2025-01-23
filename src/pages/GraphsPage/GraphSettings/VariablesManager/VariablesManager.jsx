import { Flex, Button } from "@chakra-ui/react";
import { useAtom, useAtomValue } from "jotai";
import { variablesAtom, addVariableAtom } from "../../atoms";

import GraphVariable from "./GraphVariable";
//import { useGraphContext } from "../../../../providers/GraphProvider/GraphContext";

function VariablesManager() {
    console.log("Render VariablesManager");
    //const { variables, addVariable, removeVariable, updateVariable } = useGraphContext();

    const variables = useAtomValue(variablesAtom);
    const [, addVariable] = useAtom(addVariableAtom);
    
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
                            key={variable.id}
                            index={index}
                            variable={variable}
                            /* removeVariable={removeVariable}
                            updateVariable={updateVariable} */
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
