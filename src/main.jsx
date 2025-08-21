import { createRoot } from "react-dom/client";
//import { StrictMode } from "react";
import App from "./App.jsx";
import "./index.css";

if (import.meta.env.MODE === "development") {
    import("./mocks/browser.js").then(({ worker }) => {
        worker.start({
            onUnhandledRequest: "bypass"
        });
    });
}

createRoot(document.getElementById("root")).render(
    //<StrictMode>
    <App />
    //</StrictMode>,
);

//TODO Изучить react-hook-form