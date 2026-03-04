import { Container } from "@chakra-ui/react";
import { SettingView } from "./SettingView";

function SettingsPage() {
    return (
        <Container
            maxH={"100%"}
            minH={0}
            maxW={"6xl"}
            px={{ base: 4, md: 6 }}
            py={{ base: 4, md: 6 }}
        >
            <SettingView />
        </Container>
    );
}

export default SettingsPage;
