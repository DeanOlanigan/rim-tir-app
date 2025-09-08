import { ScrollArea, Stack, Text } from "@chakra-ui/react";

export const DescriptionField = ({ setting, config, w, h }) => {
    const label = config.settings["description"]?.label;
    const value = setting["description"];
    return (
        <Stack w={w}>
            <Text fontWeight={"medium"}>{label}</Text>
            <ScrollArea.Root size={"xs"} height={h} variant={"hover"}>
                <ScrollArea.Viewport>
                    <ScrollArea.Content pe={"3"}>{value}</ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar />
            </ScrollArea.Root>
        </Stack>
    );
};
