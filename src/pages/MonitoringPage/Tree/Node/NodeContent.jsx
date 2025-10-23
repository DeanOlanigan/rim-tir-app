import { memo } from "react";
import { Text, HStack, Code } from "@chakra-ui/react";
import { NODE_TYPES } from "@/config/constants";
import { useSettingsFromCache } from "../../useSettingsFromCache";
import { NodeValues } from "./NodeValues";
import { NodeAttributes } from "./NodeAttributes";
import { Sparkline } from "./Sparkline";
import { useMonitoringLive } from "../../store/mqtt-stream-store";

export const NodeContent = memo(function NodeContent({ id }) {
    const settings = useSettingsFromCache();
    const nameSwitch = useMonitoringLive((s) => s.nameSwitch);
    const type = settings[id]?.type;

    const isVariable = type === NODE_TYPES.variable;
    const isDataObject = type === NODE_TYPES.dataObject;

    const isGraph =
        type === NODE_TYPES.variable && settings[id]?.setting?.graph;

    const description = settings[id]?.setting?.description;
    const name = settings[id]?.name;

    let viewName = name;
    if (nameSwitch) {
        viewName = description ? description : name;
    }

    return (
        <HStack justifyContent={"space-between"} w={"100%"}>
            <HStack>
                {isDataObject ? (
                    <BindedVariable id={id} />
                ) : (
                    <Text truncate maxW={"20ch"}>
                        {viewName}
                    </Text>
                )}
            </HStack>
            <HStack>
                {(isDataObject || isVariable) && <NodeAttributes id={id} />}
                {isGraph && <Sparkline id={id} />}
                {(isDataObject || isVariable) && <NodeValues id={id} />}
            </HStack>
        </HStack>
    );
});

const BindedVariable = memo(function BindedVariable({ id }) {
    const settings = useSettingsFromCache();
    const nameSwitch = useMonitoringLive((s) => s.nameSwitch);
    const name = settings[settings[id]?.setting?.variableId]?.name;
    const description =
        settings[settings[id]?.setting?.variableId]?.setting?.description;

    let viewName = name;
    if (nameSwitch) {
        viewName = description ? description : name;
    }

    return (
        <Code variant={"subtle"} colorPalette={"blue"} maxW={"20ch"}>
            <Text truncate>{viewName ? viewName : "Нет переменной"}</Text>
        </Code>
    );
});
