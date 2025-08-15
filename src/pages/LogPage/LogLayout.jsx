import { Outlet } from "react-router-dom";
import { Container } from "@chakra-ui/react";

function LogLayout() {
    console.log("Render LogLayout");

    return (
        <Container
            maxW={"6xl"}
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
        >
            {/* 
                Outlet - "место" для вложенных маршрутов:
                settings, viewer, или RootRedirect
            */}
            <Outlet />
        </Container>
    );
}

export default LogLayout;
