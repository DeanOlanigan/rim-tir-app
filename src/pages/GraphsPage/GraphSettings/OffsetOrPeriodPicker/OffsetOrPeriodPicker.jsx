import { Box, Tabs } from "@chakra-ui/react";
import PeriodPicker from "./PeriodPicker";
import OffsetPicker from "./OffsetPicker";
import { useGraphStore } from "../../GraphStore";
//import { useGraphContext } from "@/providers/GraphProvider/GraphContext";

function OffsetOrPeriodPicker() {
    console.log("Render OffsetOrPeriodPicker");
    //const { isWsActive, setIsWsActive } = useGraphContext();
    const isWsActive = useGraphStore(state => state.isWsActiveZus);
    const setIsWsActive = useGraphStore(state => state.setIsWsActiveZus);

    return (
        <Tabs.Root
            value={isWsActive ? "1" : "2"}
            variant={"enclosed"}
            size={"sm"}
            onValueChange={(e) => {
                setIsWsActive(e.value === "1");
            }}
        >
            <Tabs.List w={"full"} justifyContent={"center"}>
                <Tabs.Trigger value="1">Текущие</Tabs.Trigger>
                <Tabs.Trigger value="2">Период</Tabs.Trigger>
            </Tabs.List>
            <Box pos="relative" width="full">
                <Tabs.Content
                    value="1"
                    position="absolute"
                    inset="0"
                    _open={{
                        animationName: "fade-in, scale-in",
                        animationDuration: "300ms",
                    }}
                    _closed={{
                        animationName: "fade-out, scale-out",
                        animationDuration: "120ms",
                    }}
                >
                    <OffsetPicker />
                </Tabs.Content>
                <Tabs.Content
                    value="2"
                    position="absolute"
                    inset="0"
                    _open={{
                        animationName: "fade-in, scale-in",
                        animationDuration: "300ms",
                    }}
                    _closed={{
                        animationName: "fade-out, scale-out",
                        animationDuration: "120ms",
                    }}
                >
                    <PeriodPicker />
                </Tabs.Content>
            </Box>
        </Tabs.Root>
    );
}

export default OffsetOrPeriodPicker;
