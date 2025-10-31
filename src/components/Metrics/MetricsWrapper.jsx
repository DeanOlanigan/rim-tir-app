import { Flex } from "@chakra-ui/react";
import { MqttTime } from "./MqttTime";
import { MqttCpu } from "./MqttCpu";
import { MqttRam } from "./MqttRam";
import { Connect } from "./Connect";
import { SoftwareVersion } from "./SoftwareVersion";

export const MetricsWrapper = () => {
    return (
        <Flex
            gap={"2"}
            justify={"end"}
            align={"center"}
            borderTop={"0.25rem solid"}
            borderColor={"colorPalette.subtle"}
            p={"1"}
        >
            <MqttTime />
            <MqttCpu />
            <MqttRam />
            <Connect />
            <SoftwareVersion />
        </Flex>
    );
};
