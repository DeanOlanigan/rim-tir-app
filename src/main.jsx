import { createRoot } from "react-dom/client";
//import { StrictMode } from "react";
import App from "./App.jsx";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MqttProvider } from "@/utils/mqtt/mqtt-provider.jsx";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        },
    },
});

// This code is for all users
window.__TANSTACK_QUERY_CLIENT__ = queryClient;

/* async function enableMocking() {
    const { worker } = await import("./mocks/browser.js");
    return worker.start({ quiet: true });
}

enableMocking().then(() => {
}); */
createRoot(document.getElementById("root")).render(
    <MqttProvider
        url={import.meta.env.VITE_MQTT_URL}
        opt={{
            reconnectPeriod: 5000,
            connectTimeout: 4000,
        }}
    >
        <QueryClientProvider client={queryClient}>
            {/* <StrictMode> */}
            <App />
            {/* </StrictMode> */}
        </QueryClientProvider>
    </MqttProvider>,
);
