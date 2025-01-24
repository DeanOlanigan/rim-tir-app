import { Outlet } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import LogProvider from "../../providers/LogProvider/LogProvider";

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
            <LogProvider>
                {/* 
                    Outlet - "место" для вложенных маршрутов:
                    settings, viewer, или RootRedirect
                */}
                <Outlet />
            </LogProvider>
        </Container>
    );
}

export default LogLayout;
