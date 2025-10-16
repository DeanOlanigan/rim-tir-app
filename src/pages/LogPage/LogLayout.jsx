import { Outlet } from "react-router-dom";
import { Container } from "@chakra-ui/react";

function LogLayout() {
    return (
        <Container
            maxW={"6xl"}
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
            p={"4"}
        >
            <Outlet />
        </Container>
    );
}

export default LogLayout;
