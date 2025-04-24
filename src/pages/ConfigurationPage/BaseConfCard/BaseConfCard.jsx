import { Card, Stack } from "@chakra-ui/react";
import { ConfMenu } from "./ConfMenu";
import { ConfMiscInfo } from "./ConfMiscInfo";
import { ConfInfoEdit } from "./ConfInfoEdit";
import { RouterMenu } from "./RouterMenu";

export const BaseConfCard = () => {
    return (
        <Card.Root>
            <Card.Body p={"2"}>
                <Card.Title>
                    <Stack
                        direction={"row"}
                        gap={"2"}
                        justify={"space-between"}
                        align={"center"}
                    >
                        <Stack direction={"row"} gap={"2"}>
                            <ConfMenu />
                            <RouterMenu />
                        </Stack>
                        <ConfInfoEdit />
                        <ConfMiscInfo />
                    </Stack>
                </Card.Title>
            </Card.Body>
        </Card.Root>
    );
};
