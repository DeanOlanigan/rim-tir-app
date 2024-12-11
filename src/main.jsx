import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { Provider } from "./components/ui/provider";
import App from "./App.jsx";
import "./index.css";

import "@radix-ui/themes/styles.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Provider>
            <App />
        </Provider>
    </StrictMode>,
);

//TODO Перенести интерфейс с radix ui на chakra
//TODO Изучить react-hook-form