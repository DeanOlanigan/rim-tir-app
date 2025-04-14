import { Card, Stack } from "@chakra-ui/react";
import { useVariablesStore } from "../../../store/variables-store";
import { ConfMenu } from "./ConfMenu";
import { ConfMiscInfo } from "./ConfMiscInfo";
import { ConfInfoEdit } from "./ConfInfoEdit";
import { RouterMenu } from "./RouterMenu";

export const BaseConfCard = () => {
    const configInfo = useVariablesStore((state) => state.configInfo);

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
                        <Stack direction={"row"} gap={"0"}>
                            <ConfMenu />
                            <RouterMenu />
                        </Stack>
                        <ConfInfoEdit settings={configInfo} />
                        <ConfMiscInfo
                            date={configInfo?.date}
                            version={configInfo?.version}
                        />
                    </Stack>
                </Card.Title>
            </Card.Body>
        </Card.Root>
    );
};
