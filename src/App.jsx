import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import WebSocketProvider from "./providers/WebSocketProvider";

function App() {
    return (
        <WebSocketProvider>
            <AppRoutes />  
        </WebSocketProvider>
    );
}

export default App;
