import { connect } from "mqtt";

const MQTT_URL = import.meta.env.VITE_MQTT_URL;

const opts = {
    // eslint-disable-next-line
    clientId: "web_" + Math.random().toString(16).slice(2, 8).toUpperCase(),
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 4000,
    keepalive: 60,
    protocolVersion: 4,
};

export const mqttClient = connect(MQTT_URL, opts);

mqttClient.on("connect", () => console.log("[MQTT] connected"));
mqttClient.on("reconnect", () => console.log("[MQTT] reconnect"));
mqttClient.on("close", () => console.log("[MQTT] closed"));
mqttClient.on("error", (error) => console.log("[MQTT] error", error));
