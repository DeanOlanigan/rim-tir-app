import { Outlet } from "react-router-dom";
import { Container } from "@chakra-ui/react";

function GraphLayout() {
    console.log("Render GraphLayout");
    
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

export default GraphLayout;
