import { ws } from "msw";

const apiMqtt = ws.link("ws://localhost:8081");

export const mqttPassThrough = [
    apiMqtt.addEventListener("connection", ({ server }) => {
        server.connect();
    }),
];
