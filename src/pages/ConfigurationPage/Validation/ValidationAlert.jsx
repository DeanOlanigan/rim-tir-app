import { Alert, Box, Collapsible } from "@chakra-ui/react";
import { LuTriangleAlert } from "react-icons/lu";

export const ValidationAlert = ({ title, content }) => {
    return (
        <Alert.Root
            status={"error"}
            borderStartWidth={"3px"}
            borderEndWidth={"3px"}
            borderColor={"fg.error"}
            bg={"bg.error/40"}
            backdropFilter={"blur(4px)"}
            boxShadow={"xl"}
        >
            <Alert.Indicator>
                <LuTriangleAlert />
            </Alert.Indicator>
            <Alert.Content>
                <Collapsible.Root unmountOnExit lazyMount>
                    <Collapsible.Trigger>
                        <Alert.Title cursor={"button"}>{title}</Alert.Title>
                    </Collapsible.Trigger>
                    <Collapsible.Content>
                        <Box pt={"2"}>{content}</Box>
                    </Collapsible.Content>
                </Collapsible.Root>
            </Alert.Content>
        </Alert.Root>
    );
};
