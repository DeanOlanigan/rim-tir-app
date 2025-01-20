import { Box, Tabs } from "@chakra-ui/react";

import PeriodPicker from "./PeriodPicker";
import OffsetPicker from "./OffsetPicker";

function OffsetOrPeriodPicker({settings, setSettings}) {
    return (
        <Tabs.Root
            defaultValue={"1"}
            variant={"enclosed"}
            size={"sm"}
            onValueChange={(value) => {
                console.log(value);
                setSettings({
                    ...settings,
                    isWsActive: value.value === "1"
                });
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
                    <OffsetPicker settings={settings} setOffset={setSettings} />
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
                    <PeriodPicker settings={settings} setSettings={setSettings}/>
                </Tabs.Content>
            </Box>
        </Tabs.Root>
    );
}

export default OffsetOrPeriodPicker;
