import { Switch, Text } from "@chakra-ui/react";

export const VariableValueSwitch = () => {
    return (
        <Switch.Root size={"lg"}>
            <Switch.HiddenInput />
            <Switch.Control>
                <Switch.Thumb>
                    <Switch.ThumbIndicator
                        fallback={<Text fontWeight={"bold"}>0</Text>}
                    >
                        <Text fontWeight={"bold"}>1</Text>
                    </Switch.ThumbIndicator>
                </Switch.Thumb>
            </Switch.Control>
        </Switch.Root>
    );
};
