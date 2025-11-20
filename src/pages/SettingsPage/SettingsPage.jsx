import { Container } from "@chakra-ui/react";
import { SettingView } from "./SettingView";

export const SettingsPage = () => {
    return (
        <Container overflow={"auto"} maxH={"100%"}>
            <SettingView />
        </Container>
    );
};
