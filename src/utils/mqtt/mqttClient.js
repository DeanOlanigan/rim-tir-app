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

function getRandomLoad() {
    // eslint-disable-next-line
    return Math.round(5 + Math.random() * 30);
}

let pubTimer = null;

mqttClient.on("connect", () => {
    console.log("[MQTT] connected");
    if (pubTimer) return;
    pubTimer = setInterval(() => {
        mqttClient.publish("stats/cpu", JSON.stringify(getRandomLoad()), {
            qos: 0,
            retain: false,
        });
        mqttClient.publish("stats/ram", JSON.stringify(getRandomLoad()), {
            qos: 0,
            retain: false,
        });
        mqttClient.publish("stats/time", JSON.stringify(Date.now()), {
            qos: 0,
            retain: false,
        });
    }, 1000);
});
mqttClient.on("reconnect", () => console.log("[MQTT] reconnect"));
mqttClient.on("close", () => {
    console.log("[MQTT] closed");
    if (pubTimer) {
        clearInterval(pubTimer);
        pubTimer = null;
    }
});
mqttClient.on("error", (error) => console.log("[MQTT] error", error));
