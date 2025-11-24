import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { useSettingStore } from "./Settings/SettingsStore/settings-store";
import { delay } from "msw";

export const SendButton = () => {
    const [loading, setLoading] = useState(false);
    const { Journals, Logs, WebServer } = useSettingStore();
    return (
        <Button
            loading={loading}
            onClick={() => SendSettings(Journals, Logs, WebServer, setLoading)}
        >
            Применить
        </Button>
    );
};

const SendSettings = async (Journals, Logs, WebServer, setLoading) => {
    setLoading(true);
    const settings = { Journals, Logs, WebServer };

    await delay(500);
    fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
    })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
    setLoading(false);
};
