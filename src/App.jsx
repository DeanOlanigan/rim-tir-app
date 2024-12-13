import "./App.css";
import { BrowserRouter as Router} from "react-router-dom";
import Header from "./components/Header/Header";
import AppRoutes from "./routes/AppRoutes";
import WebSocketProvider from "./providers/WebSocketProvider";
import { useState, useEffect } from "react";
import LoginForm from "./pages/LoginPage/LoginPage";

function App() {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const checkSession = () => {
            const currentTime = Math.floor(Date.now() / 1000);
            const sessionExpirationTime = localStorage.getItem("session_expiration_time");
            let timeLeft = sessionExpirationTime - currentTime;
            console.log(`checkSession: ${timeLeft}`);
            if (sessionExpirationTime && currentTime < parseInt(sessionExpirationTime, 10)) {
                setIsAuth(true);
            } else {
                setIsAuth(false);
                localStorage.removeItem("session_expiration_time");
                localStorage.removeItem("csrf");
            }
        };
        checkSession();
        const interval = setInterval(checkSession, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogin = () => {
        setIsAuth(true);
    };

    if (!isAuth) {
        return <LoginForm onLogin={handleLogin}/>;
    }

    return (
        <WebSocketProvider>
            <Router>
                <div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
                    <Header />
                    <main style={{ height: "100%", paddingTop: "1rem" }}>
                        <AppRoutes />
                    </main>
                </div>
            </Router>
        </WebSocketProvider>
    );
}

export default App;
