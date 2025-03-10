import { Card, Stack } from "@chakra-ui/react";
import { useVariablesStore } from "../../../store/variables-store";
import { ConfMenu } from "./ConfMenu";
import { ConfMiscInfo } from "./ConfMiscInfo";
import { ConfInfoEdit } from "./ConfInfoEdit";
import { RouterMenu } from "./RouterMenu";

export const BaseConfCard = () => {
    const configInfo = useVariablesStore((state) => state.configInfo);
    const settings = useVariablesStore(
        (state) => state.settings[configInfo.id]
    );

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
                        <ConfInfoEdit settings={settings} />
                        <ConfMiscInfo
                            date={settings?.setting.date}
                            version={settings?.setting.version}
                        />
                    </Stack>
                </Card.Title>
            </Card.Body>
        </Card.Root>
    );
};
