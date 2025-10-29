import { Box, Flex, NumberInput } from "@chakra-ui/react";
import { useState } from "react";
import { Canvas } from "./canvas/Canvas";

function TestPage() {
    const [size, setSize] = useState({ width: 800, height: 600 });

    return (
        <Box flex={1} h={"100%"} minH={0} bg={"gray.200"} position={"relative"}>
            <Canvas width={size.width} height={size.height} />

            <Flex
                position={"absolute"}
                top={1}
                right={0}
                w={"200px"}
                h={"300px"}
                border={"1px solid green"}
                bg={"green.300"}
                gap={"2"}
                direction={"column"}
                p={"2"}
            >
                <NumberInput.Root
                    value={size.height}
                    onValueChange={(e) =>
                        setSize((prev) => ({
                            ...prev,
                            height: parseInt(e.value, 10) || e.value,
                        }))
                    }
                >
                    <NumberInput.Control />
                    <NumberInput.Input />
                </NumberInput.Root>
                <NumberInput.Root
                    value={size.width}
                    onValueChange={(e) =>
                        setSize((prev) => ({
                            ...prev,
                            width: parseInt(e.value, 10) || e.value,
                        }))
                    }
                >
                    <NumberInput.Control />
                    <NumberInput.Input />
                </NumberInput.Root>
            </Flex>
        </Box>
    );
}
export default TestPage;
