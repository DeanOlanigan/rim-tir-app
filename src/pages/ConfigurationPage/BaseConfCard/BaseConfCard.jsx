import { Card, IconButton, Stack } from "@chakra-ui/react";
import { ConfMenu } from "./ConfMenu";
import { ConfMiscInfo } from "./ConfMiscInfo";
import { RouterMenu } from "./RouterMenu";
import { ValidationErrorsContainer } from "../Validation/ValidationErrorsContainer";
import { LuFlipHorizontal2, LuFlipVertical2 } from "react-icons/lu";
import { useConfigStore } from "../stores";

export const BaseConfCard = () => {
    const { flip, setFlip } = useConfigStore((state) => state);
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
                            <IconButton
                                variant="subtle"
                                size="2xs"
                                rounded={"md"}
                                shadow={"md"}
                                onClick={() => setFlip()}
                            >
                                {flip === "vertical" ? (
                                    <LuFlipHorizontal2 />
                                ) : (
                                    <LuFlipVertical2 />
                                )}
                            </IconButton>
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
