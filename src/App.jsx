import { Provider } from "./components/ui/provider";
import WebSocketProvider from "./providers/WebSocketProvider";
import AppRoutes from "./routes/AppRoutes";
import "@radix-ui/themes/styles.css";
import "./App.css";

function App() {
    return (
        <Provider>
            <WebSocketProvider>
                <AppRoutes />  
            </WebSocketProvider>
        </Provider>
    );
}

export default App;
