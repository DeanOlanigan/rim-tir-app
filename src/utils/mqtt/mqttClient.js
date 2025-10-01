import mqtt from "mqtt";

const MQTT_URL = import.meta.env.VITE_MQTT_URL; // ws://localhost:8081

const opts = {
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 5000,
    keepalive: 60,
    connectTimeout: 4000,
    // eslint-disable-next-line
    clientId: "mqtt_client" + Math.random().toString(16).slice(2),
};

export const mqttClient = mqtt.connect(MQTT_URL, opts);

mqttClient.on("connect", () => {
    console.log("[MQTT] connected");
});

mqttClient.on("reconnect", () => console.log("[MQTT] reconnect"));

mqttClient.on("close", () => {
    console.log("[MQTT] closed");
});

mqttClient.on("error", (error) => console.log("[MQTT] error", error));
