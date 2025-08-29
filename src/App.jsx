import { Provider } from "@/components/ui/provider";
import AppRoutes from "@/routes/AppRoutes";
import "./App.css";
import { worker } from "./mocks/browser";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

//worker.start();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider>
                <AppRoutes />
            </Provider>
        </QueryClientProvider>
    );
}

export default App;
