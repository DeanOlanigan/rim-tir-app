import {
    Box,
    ColorPicker,
    Flex,
    Heading,
    HStack,
    parseColor,
    StackSeparator,
    Text,
    VStack,
} from "@chakra-ui/react";
import { useNodeStore } from "../store/node-store";
import { useEffect, useState } from "react";
import { LOCALE } from "../constants";
import { LuCheck } from "react-icons/lu";

export const ProjectSettings = () => {
    return (
        <Flex
            bg={"bg.panel"}
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
                    <Heading size={"md"}>{LOCALE.pageBackground}</Heading>
                    <ColorComp param={"backgroundColor"} />
                </VStack>
                <VStack align={"start"} w={"100%"}>
                    <Heading size={"md"}>{LOCALE.variables}</Heading>
                    <InDev />
                </VStack>
                <VStack align={"start"} w={"100%"}>
                    <Heading size={"md"}>{LOCALE.styles}</Heading>
                    <InDev />
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
                {LOCALE.projectSettings}: {projectName}
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
            onOpenChange={(e) => {
                if (e.open) return;
                set(useNodeStore.getState().activePageId, {
                    [param]: color.toString("hex"),
                });
            }}
            lazyMount
            unmountOnExit
        >
            <ColorPicker.HiddenInput />
            <ColorPicker.Control>
                <ColorPicker.Trigger />
                <ColorPicker.Input />
            </ColorPicker.Control>
            <ColorPicker.Positioner>
                <ColorPicker.Content>
                    <ColorPicker.Area />
                    <ColorPicker.ChannelSlider channel={"hue"} />
                    <ColorPicker.SwatchGroup>
                        {swatches.map((swatch) => (
                            <ColorPicker.SwatchTrigger
                                key={swatch}
                                value={swatch}
                            >
                                <ColorPicker.Swatch value={swatch}>
                                    <ColorPicker.SwatchIndicator>
                                        <LuCheck />
                                    </ColorPicker.SwatchIndicator>
                                </ColorPicker.Swatch>
                            </ColorPicker.SwatchTrigger>
                        ))}
                    </ColorPicker.SwatchGroup>
                </ColorPicker.Content>
            </ColorPicker.Positioner>
        </ColorPicker.Root>
    );
};

const swatches = [
    "#F7F8FA",
    "#F5F7FB",
    "#FAF7F2",
    "#F3F6F4",
    "#121417",
    "#161A1F",
    "#11161C",
    "#1A1D22",
];

const InDev = () => {
    return (
        <Box
            w={"100%"}
            p={4}
            border="1px dashed"
            borderColor="border.emphasized"
            borderRadius="md"
            textAlign="center"
        >
            <Text fontSize="sm" color="gray.500">
                В разработке
            </Text>
        </Box>
    );
};
