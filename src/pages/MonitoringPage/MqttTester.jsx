import { useMqttMock } from "@/utils/mqtt/publisher/useMqttMock";
import { Badge, HStack, Switch } from "@chakra-ui/react";
import { useState } from "react";

export const MqttTester = () => {
    const [on, setOn] = useState(false);

    useMqttMock({
        enabled: on,
        periodMs: 1500,
        topicBase: "test",
    });

    return (
        <HStack>
            <Switch.Root checked={on} onCheckedChange={(e) => setOn(e.checked)}>
                <Switch.HiddenInput />
                <Switch.Control>
                    <Switch.Thumb />
                </Switch.Control>
                <Switch.Label>MQTT Tester</Switch.Label>
            </Switch.Root>
            <Badge colorPalette={on ? "green" : "gray"}>
                {on ? "ON" : "OFF"}
            </Badge>
        </HStack>
    );
};
