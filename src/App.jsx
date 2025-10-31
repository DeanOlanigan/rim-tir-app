import { Provider } from "@/components/ui/provider";
import { AppRouter } from "./routes";
import "./App.css";

function App() {
    return (
        <Provider>
            <AppRouter />
        </Provider>
    );
}

export default App;
