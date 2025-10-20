import { Provider } from "@/components/ui/provider";
//import AppRoutes from "@/routes/AppRoutes";
//import "./App.css";
import { AppRouter } from "./routes";

function App() {
    return (
        <Provider>
            {/* <AppRoutes /> */}
            <AppRouter />
        </Provider>
    );
}

export default App;
