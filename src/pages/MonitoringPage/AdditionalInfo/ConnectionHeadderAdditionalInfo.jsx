import {
    Box,
    Field,
    IconButton,
    Popover,
    Portal,
    Stack,
    StackSeparator,
    Text,
} from "@chakra-ui/react";
import { LuInfo } from "react-icons/lu";
import { configuratorConfig } from "@/utils/configurationParser";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/api/queryKeys";
import { getConfiguration } from "@/api/configuration";

export const ConnectionHeadderAdditionalInfo = ({ id }) => {
    const {
        data: { setting, path },
    } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: (state) => state.settings[id],
    });

    if (!setting) return null;
    const config = configuratorConfig.nodePaths[path];

    return (
        <Popover.Root lazyMount unmountOnExit>
            <Popover.Trigger asChild>
                <IconButton size={"2xs"} variant={"subtle"}>
                    <LuInfo />
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Body>
                            <Stack gap={"1"} separator={<StackSeparator />}>
                                {Object.entries(setting).map(([key, value]) => {
                                    if (
                                        key === "usedIn" ||
                                        key === "variableId"
                                    )
                                        return null;
                                    return (
                                        <Field.Root key={key}>
                                            <Field.Label>
                                                {config.settings[key]?.label}
                                            </Field.Label>
                                            <Box
                                                maxH={"100px"}
                                                overflow={"auto"}
                                            >
                                                <Text
                                                    wordBreak={"break-all"}
                                                    fontSize={"sm"}
                                                >
                                                    {valueResolver(
                                                        config.settings[key],
                                                        value
                                                    )}
                                                </Text>
                                            </Box>
                                        </Field.Root>
                                    );
                                })}
                            </Stack>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
};

function valueResolver(context, value) {
    if (!context) return value;
    switch (context.type) {
        case "enum": {
            return context.enumValues.find(value).label;
        }
        case "boolean":
            return value ? "Да" : "Нет";
        default:
            return value;
    }
}
