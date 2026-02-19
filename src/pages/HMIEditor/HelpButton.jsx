import { IconButton, Kbd, Text } from "@chakra-ui/react";
import { FaQuestion } from "react-icons/fa6";
import { HELP_DIALOG_ID, helpDialog } from "./helpDialog";
import { Tooltip } from "@/components/ui/tooltip";

export const HelpButton = () => {
    return (
        <Tooltip
            showArrow
            content={
                <Text>
                    Справка <Kbd variant={"plain"}>?</Kbd>
                </Text>
            }
        >
            <IconButton
                position={"absolute"}
                bottom={4}
                right={4}
                size={"sm"}
                p={2}
                as={FaQuestion}
                variant={"subtle"}
                rounded={"full"}
                shadow={"md"}
                onClick={() => helpDialog.open(HELP_DIALOG_ID)}
            />
        </Tooltip>
    );
};
