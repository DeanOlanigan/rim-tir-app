import { Box, Tabs } from "@chakra-ui/react";

import PeriodPicker from "./PeriodPicker";
import OffsetPicker from "./OffsetPicker";

function OffsetOrPeriodPicker() {
    return (
        <Tabs.Root
            defaultValue={"1"}
            variant={"enclosed"}
            size={"sm"}
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
