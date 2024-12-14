import "./App.css";
import { BrowserRouter as Router} from "react-router-dom";
import Header from "./components/Header/Header";
import AppRoutes from "./routes/AppRoutes";
import WebSocketProvider from "./providers/WebSocketProvider";
import { useState, useEffect, useRef } from "react";
import LoginForm from "./pages/LoginPage/LoginPage";
import { Toaster, toaster } from "./components/ui/toaster";
import {
    DialogBody,
    DialogCloseTrigger,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogActionTrigger
} from "./components/ui/dialog";
import { Button } from "@chakra-ui/react";

function Dialog(props) {
    return (
        <DialogRoot role="alertdialog" defaultOpen>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Session expired soon</DialogTitle>
                </DialogHeader>
                <DialogBody>
                    {props.children}
                </DialogBody>
                <DialogFooter>
                    <DialogActionTrigger asChild>
                        <Button variant='outline'>Cancel</Button>
                    </DialogActionTrigger>
                </DialogFooter>
                <DialogCloseTrigger/>
            </DialogContent>
        </DialogRoot>
    );
}

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const toastId = useRef();
    const [toasterReady, setToasterReady] = useState(false);

    useEffect(() => {
        const toasterTimeout = setTimeout(() => setToasterReady(true), 5000);

        const checkSession = () => {
            const currentTime = Math.floor(Date.now() / 1000);
            const sessionExpirationTime = localStorage.getItem("session_expiration_time");
            if (sessionExpirationTime && currentTime < parseInt(sessionExpirationTime, 10)) {
                const remainingTime = sessionExpirationTime - currentTime;
                console.log("Remaining time:", remainingTime);
                setIsAuth(true);

                if (toasterReady && remainingTime < 2680) {
                    console.log(toastId.current);
                    if (!toastId.current) {
                        toastId.current = toaster.create({
                            title: "Session expired soon",
                            description: `Your session will expire in ${remainingTime} seconds.`,
                            type: "warning",
                            duration: 60000,
                            action: {
                                label: "Extend session",
                                onClick: () => {
                                    localStorage.setItem("session_expiration_time", parseInt(sessionExpirationTime, 10) + 1440);
                                    toaster.dismiss(toastId.current);
                                    toastId.current = "";
                                }
                            }
                        });
                    } else {
                        toaster.update(toastId.current, {
                            description: `Your session will expire in ${remainingTime} seconds.`,
                        });
                    }
                }

            } else {
                setIsAuth(false);
                localStorage.removeItem("session_expiration_time");
                localStorage.removeItem("csrf");
                
                if (toastId.current) {
                    toaster.dismiss(toastId.current);
                    toastId.current = "";
                }
            }
        };
        checkSession();
        setLoading(false);
        const interval = setInterval(checkSession, 1000);
        return () => {
            clearTimeout(toasterTimeout); 
            clearInterval(interval);
        };
    }, [toasterReady]);

    const handleLogin = () => {
        setIsAuth(true);
    };

    if (loading) {
        return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "black" }}>Loading...</div>;
    }

    if (!isAuth) {
        return <LoginForm onLogin={handleLogin}/>;
    }

    return (
        <WebSocketProvider>
            <Router>
                <div style={{display: "flex", flexDirection: "column", height: "100vh"}}>
                    <Toaster />
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
