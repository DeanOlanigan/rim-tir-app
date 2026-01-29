import { Container } from "@chakra-ui/react";
import { SettingView } from "./SettingView";

function SettingsPage() {
    return (
        <Container overflow={"auto"} maxH={"100%"}>
            <SettingView />
        </Container>
    );
}

export default SettingsPage;
