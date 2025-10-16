import { Box, Tabs } from "@chakra-ui/react";
import { PeriodPicker } from "./PeriodPicker";
import { OffsetPicker } from "./OffsetPicker";
import { useGraphStore } from "../../store/store";
import { TIME_TYPE } from "../graphSettingsConstants";

export const OffsetOrPeriodPicker = () => {
    const type = useGraphStore((state) => state.type);
    const { setType } = useGraphStore.getState();

    return (
        <Tabs.Root
            lazyMount
            unmountOnExit
            size={"sm"}
            value={type}
            variant={"plain"}
            fitted
            onValueChange={(e) => setType(e.value)}
            w={"sm"}
            h={"100%"}
        >
            <Tabs.List bg={"bg.muted"} rounded={"l3"} p={"1"}>
                <Tabs.Trigger value={TIME_TYPE.real}>Текущие</Tabs.Trigger>
                <Tabs.Trigger value={TIME_TYPE.archive}>Период</Tabs.Trigger>
                <Tabs.Indicator rounded="l2" />
            </Tabs.List>
            <Box pos={"relative"} width={"full"} p={"2"}>
                <Tabs.Content
                    value="real"
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
                    value="archive"
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
};
