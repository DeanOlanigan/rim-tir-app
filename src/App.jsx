import { Provider } from "./components/ui/provider";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
    return (
        <Provider>
            <AppRoutes />  
        </Provider>
    );
}

export default App;
