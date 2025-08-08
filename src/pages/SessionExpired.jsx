import { Box, AbsoluteCenter, Card, Button } from "@chakra-ui/react";
import GradientBackground from "@/components/Background/GradientBackground/GradientBackground";
import { Link } from "react-router-dom";

export const SessionExpired = () => {
    return (
        <Box position={"relative"} h={"100vh"}>
            <GradientBackground />
            <AbsoluteCenter axis={"both"}>
                <Card.Root>
                    <Card.Body gap={"2"}>
                        <Card.Title>Сессия истекла</Card.Title>
                        <Card.Description>
                            Пожалуйста, авторизуйтесь заново
                        </Card.Description>
                    </Card.Body>
                    <Card.Footer>
                        <Button
                            variant={"solid"}
                            size={"xs"}
                            w={"100%"}
                            as={Link}
                            to={"/login"}
                        >
                            Авторизоваться
                        </Button>
                    </Card.Footer>
                </Card.Root>
            </AbsoluteCenter>
        </Box>
    );
};
