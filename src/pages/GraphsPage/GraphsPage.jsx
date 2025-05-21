/* ABANDONED */
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import GraphProvider from "@/providers/GraphProvider/GraphProvider";
import GraphSettings from "./GraphSettings/GraphSettings";
import GraphViewer from "./Viewer/GraphViewer";
import { useAtomValue } from "jotai";
import { wsMessageAtom } from "./atoms";
import { useEffect } from "react";

function GraphsPage() {
    //console.log("Render GraphsPage");
    const wsMessage = useAtomValue(wsMessageAtom);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Проверяем, есть ли у нас "настроенное" сообщение
        const hasGraphMessage = Boolean(
            wsMessage.graph && Object.keys(wsMessage.graph).length > 0
        );
        // Если пользователь уже настроил график, а сейчас находится на /graphs,
        // то автоматически переводим его на /graphs/viewer
        if (hasGraphMessage && location.pathname.endsWith("/graphs")) {
            navigate("viewer", { replace: true });
        }
        // Если пользователь пытается зайти на /graphs/viewer, но данных нет,
        // перенаправляем его назад на страницу настроек (корень /graphs)
        if (!hasGraphMessage && location.pathname.endsWith("/viewer")) {
            navigate(".", { replace: true });
        }
    }, [wsMessage]);

    return (
        <Container
            maxW={"6xl"}
            flex={"1"}
            display={"flex"}
            flexDirection={"column"}
            minH={"0"}
        >
            <GraphProvider>
                <Routes>
                    <Route index element={<GraphSettings />} />
                    <Route path="viewer" element={<GraphViewer />} />
                </Routes>
            </GraphProvider>
        </Container>
    );
}

export default GraphsPage;
