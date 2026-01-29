import {
    ColorPicker,
    Flex,
    Heading,
    HStack,
    parseColor,
    StackSeparator,
    VStack,
} from "@chakra-ui/react";
import { useNodeStore } from "./store/node-store";
import { useEffect, useState } from "react";

export const ProjectSettings = () => {
    return (
        <Flex
            bg={"bg"}
            w={"500px"}
            h={"100%"}
            p={2}
            borderRadius={"md"}
            shadow={"md"}
            direction={"column"}
            gap={2}
            pointerEvents={"auto"}
        >
            <Header />
            <VStack
                align={"start"}
                p={2}
                w={"100%"}
                separator={
                    <StackSeparator borderColor={"colorPalette.solid"} />
                }
            >
                <VStack align={"start"} w={"100%"}>
                    <Heading size={"md"}>Page background color</Heading>
                    <ColorComp param={"backgroundColor"} />
                </VStack>
                <VStack align={"start"} w={"100%"}>
                    <Heading size={"md"}>Variables</Heading>
                </VStack>
                <VStack align={"start"} w={"100%"}>
                    <Heading size={"md"}>Styles</Heading>
                </VStack>
            </VStack>
        </Flex>
    );
};

const Header = () => {
    const projectName = useNodeStore((state) => state.projectName);
    return (
        <HStack w={"100%"} justify={"space-between"} h={"32px"}>
            <Heading size={"md"} ms={2}>
                {projectName} settings
            </Heading>
        </HStack>
    );
};

const ColorComp = ({ param }) => {
    const activePageColor = useNodeStore(
        (state) => state.pages[state.activePageId][param],
    );
    const set = useNodeStore.getState().updatePage;
    const [color, setColor] = useState(parseColor(activePageColor));

    useEffect(() => {
        if (!activePageColor) return;
        setColor(parseColor(activePageColor));
    }, [activePageColor]);

    return (
        <ColorPicker.Root
            size={"xs"}
            value={color}
            onValueChange={(e) => setColor(e.value)}
            onValueChangeEnd={(e) =>
                set(useNodeStore.getState().activePageId, {
                    [param]: e.value.toString("hex"),
                })
            }
        >
            <ColorPicker.HiddenInput />
            <ColorPicker.Control>
                <ColorPicker.Trigger />
                <ColorPicker.Input />
            </ColorPicker.Control>
            <ColorPicker.Positioner>
                <ColorPicker.Content>
                    <ColorPicker.Area />
                    <ColorPicker.Sliders />
                </ColorPicker.Content>
            </ColorPicker.Positioner>
        </ColorPicker.Root>
    );
};
