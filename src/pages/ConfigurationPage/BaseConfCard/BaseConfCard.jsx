import { Card, Stack } from "@chakra-ui/react";
import { ConfMenu } from "./ConfMenu";
import { ConfMiscInfo } from "./ConfMiscInfo";
import { RouterMenu } from "./RouterMenu";
import { ValidationErrorsContainer } from "../Validation/ValidationErrorsContainer";

export const BaseConfCard = () => {
    return (
        <Card.Root border={"none"} bg={"transparent"}>
            <Card.Body p={"2"}>
                <Card.Title>
                    <Stack
                        direction={"row"}
                        gap={"2"}
                        justify={"space-between"}
                        align={"center"}
                        position={"relative"}
                    >
                        <Stack direction={"row"} gap={"2"}>
                            <ConfMenu />
                            <RouterMenu />
                            <ValidationErrorsContainer />
                        </Stack>
                        <ConfMiscInfo />
                    </Stack>
                </Card.Title>
            </Card.Body>
        </Card.Root>
    );
};
