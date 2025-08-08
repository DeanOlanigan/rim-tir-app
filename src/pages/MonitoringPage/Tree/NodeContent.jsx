import { memo } from "react";
import { useVariablesStore } from "@/store/variables-store";
import { Text, IconButton, HStack } from "@chakra-ui/react";
import { CONSTANT_VALUES } from "@/config/constants";
import { NodeValues } from "./NodeValues";
import { LuInfo, LuPencil } from "react-icons/lu";

export const NodeContent = memo(function NodeContent({ id, type, name }) {
    const variableName = useVariablesStore(
        (state) => state.settings[name]?.name
    );

    return (
        <HStack justifyContent={"space-between"} w={"100%"}>
            <HStack>
                <Text truncate>
                    {type === CONSTANT_VALUES.NODE_TYPES.dataObject
                        ? variableName
                        : name}
                </Text>
                {/* <ConnectionHeadderAdditionalInfo id={id} /> */}
            </HStack>
            <HStack>
                {type === "variable" && (
                    <IconButton size={"2xs"} variant={"subtle"}>
                        <LuPencil />
                    </IconButton>
                )}
                {(type === "dataObject" || type === "variable") && (
                    <NodeValues id={id} />
                )}
            </HStack>
        </HStack>
    );
});

// TODO Вынести в отдельный файл
import { Popover, Stack, Box, StackSeparator, Portal } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";

const ConnectionHeadderAdditionalInfo = ({ id }) => {
    const setting = useVariablesStore((state) => state.settings[id]?.setting);
    if (!setting) return null;
    return (
        <Popover.Root
            positioning={{ placement: "left-center" }}
            lazyMount
            unmountOnExit
        >
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
                                {Object.keys(setting).map((key) => {
                                    return (
                                        <Field key={key}>
                                            <Box
                                                maxH={"100px"}
                                                overflow={"auto"}
                                            >
                                                <Text
                                                    wordBreak={"break-all"}
                                                    fontSize={"sm"}
                                                >
                                                    {setting[key]}
                                                </Text>
                                            </Box>
                                        </Field>
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
