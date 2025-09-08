import { DataList, ScrollArea, Stack, Text } from "@chakra-ui/react";
import { InfoField } from "./InfoField";

export const InfoBlock = ({ setting, config, h }) => {
    return (
        <Stack w={"100%"}>
            <Text fontWeight={"medium"}>Настройки</Text>
            <ScrollArea.Root size={"xs"} height={h} variant={"hover"}>
                <ScrollArea.Viewport>
                    <ScrollArea.Content pe={"3"}>
                        <DataList.Root
                            orientation={"horizontal"}
                            size={"sm"}
                            variant={"bold"}
                        >
                            {Object.entries(setting).map(([key, value]) => (
                                <InfoField
                                    key={key}
                                    value={value}
                                    param={key}
                                    config={config}
                                />
                            ))}
                        </DataList.Root>
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar />
            </ScrollArea.Root>
        </Stack>
    );
};
