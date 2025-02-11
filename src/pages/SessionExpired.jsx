import { Box, AbsoluteCenter, Card, Button } from "@chakra-ui/react";
import GradientBackground from "../components/GradientBackground/GradientBackground";

export const SessionExpired = () => {
    return (
        <Box position={"relative"} h={"100vh"}>
            <GradientBackground />
            <AbsoluteCenter axis={"both"}>
                <Card.Root>
                    <Card.Body>
                        <Card.Header>Сессия истекла</Card.Header>
                        <Card.Content>Пожалуйста, авторизуйтесь заново</Card.Content>
                        <Card.Footer>
                            <Button>Войти</Button>
                        </Card.Footer>
                    </Card.Body>
                </Card.Root>
            </AbsoluteCenter>
        </Box>
    );
};
