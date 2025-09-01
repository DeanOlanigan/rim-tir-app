import { memo } from "react";
import { Text, IconButton, HStack, Code, Menu, Portal } from "@chakra-ui/react";
import { NODE_TYPES } from "@/config/constants";
import { NodeValues } from "./NodeValues";
import { LuPencil } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { QK } from "@/api/queryKeys";
import { getConfiguration } from "@/api/configuration";
import { AdditionalInfoDrawer } from "../AdditionalInfoDrawer";

export const NodeContent = memo(function NodeContent({ id, type, name }) {
    return (
        <HStack justifyContent={"space-between"} w={"100%"} className="group">
            <HStack>
                {type === NODE_TYPES.dataObject ? (
                    <BindedVariable id={id} />
                ) : (
                    <Text truncate>{name}</Text>
                )}
                {type !== NODE_TYPES.folder && (
                    <>
                        <AdditionalInfoDrawer id={id} height={"10rem"} />
                        {/* <AdditionalInfoPopup id={id} height={"10rem"} />
                        <ConnectionHeadderAdditionalInfo id={id} /> */}
                    </>
                )}
            </HStack>
            <HStack>
                {type === NODE_TYPES.variable && (
                    <Menu.Root>
                        <Menu.Trigger asChild>
                            <IconButton
                                size={"2xs"}
                                variant={"subtle"}
                                display={{ base: "none", _groupHover: "flex" }}
                            >
                                <LuPencil />
                            </IconButton>
                        </Menu.Trigger>
                        <Portal>
                            <Menu.Positioner>
                                <Menu.Content></Menu.Content>
                            </Menu.Positioner>
                        </Portal>
                    </Menu.Root>
                )}
                {(type === NODE_TYPES.dataObject ||
                    type === NODE_TYPES.variable) && <NodeValues id={id} />}
            </HStack>
        </HStack>
    );
});

const BindedVariable = ({ id }) => {
    const { data: name } = useQuery({
        queryKey: QK.configuration,
        queryFn: getConfiguration,
        select: ({ state }) =>
            state.settings[state.settings[id]?.setting?.variableId]?.name,
    });

    return (
        <Code variant={"subtle"} colorPalette={"blue"}>
            {name ? name : "Нет переменной"}
        </Code>
    );
};
