import { Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export const PageContainer = () => {
    return (
        <Container
            maxW={"6xl"}
            fluid
            data-state={"open"}
            animationDuration={"slow"}
            animationStyle={{
                _open: "scale-fade-in",
            }}
        >
            <Outlet />
        </Container>
    );
};
