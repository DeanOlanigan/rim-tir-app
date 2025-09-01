import { ws } from "msw";

const apiWs = ws.link("ws://192.168.1.1:8800");

const stateByClient = new WeakMap();

function send(client, obj) {
    client.send(JSON.stringify(obj));
}
function makeStats() {
    return {
        time: Date.now(),
        // eslint-disable-next-line sonarjs/pseudo-random
        cpu: Math.round(5 + Math.random() * 30),
        // eslint-disable-next-line sonarjs/pseudo-random
        ram: Math.floor(30 + Math.random() * 40),
    };
}
function pushStats(client, st) {
    st.cursor += 1;
    send(client, {
        type: "event",
        action: "delta",
        channel: "server.stats",
        data: { ...makeStats() },
    });
}

function pushRnData(client, st) {
    st.cursor += 1;
    send(client, {
        type: "event",
        action: "delta",
        channel: "monitoring",
        data: rnData,
    });
}

const rnData = [
    {
        id: "0790c6ec-213d-4627-b72d-b7f99ad5371c",
        data: Math.floor(Math.random() * 100),
    },
    {
        id: "75b8bc2a-1f03-4026-a1e8-1857cba59253",
        data: Math.floor(Math.random() * 100),
    },
    {
        id: "6fb65076-8a6a-4256-9bc6-7aed8fdccd74",
        data: Math.floor(Math.random() * 100),
    },
    {
        id: "41584fe3-48b8-4edc-8743-f8ab6a678937",
        data: Math.floor(Math.random() * 100),
    },
];

const TOKEN = "token";

export const wsHandlers = [
    apiWs.addEventListener("connection", ({ client, server, info }) => {
        console.log("WebSocket client connected");
        console.log("Bearer token:", info.protocols[0], info.protocols[1]);
        const st = { timers: new Map(), cursor: 0 };

        const hdr = info.protocols[0];
        if (hdr === "bearer") {
            if (info.protocols[1] !== TOKEN) {
                try {
                    client.close(1008, "invalid token");
                } catch {}
                return;
            }
        }

        stateByClient.set(client, st);

        client.addEventListener("message", (event) => {
            let data;
            try {
                data = JSON.parse(event.data);
            } catch {
                data = { raw: event.data };
            }

            /* switch (data.action) {
                case "getTime":
                    client.send(
                        JSON.stringify([
                            { routerTime: new Date().toISOString() },
                        ])
                    );
                    break;
                case "getMonitoringData":
                    client.send(
                        JSON.stringify([
                            {
                                id: "0790c6ec-213d-4627-b72d-b7f99ad5371c",
                                data: Math.floor(Math.random() * 100),
                            },
                            {
                                id: "75b8bc2a-1f03-4026-a1e8-1857cba59253",
                                data: Math.floor(Math.random() * 100),
                            },
                            {
                                id: "6fb65076-8a6a-4256-9bc6-7aed8fdccd74",
                                data: Math.floor(Math.random() * 100),
                            },
                            {
                                id: "41584fe3-48b8-4edc-8743-f8ab6a678937",
                                data: Math.floor(Math.random() * 100),
                            },
                        ])
                    );
                    break;
                default:
                    break;
            } */

            if (data.type === "rpc" && data.action === "hello") {
                send(client, {
                    type: "ack",
                    action: "hello",
                    data: {
                        sessionId: "mock-session-id",
                        serverTime: Date.now(),
                        minIntervalsMs: 250,
                    },
                });
            }

            if (data.type === "rpc" && data.action === "ping") {
                send(client, {
                    type: "ack",
                    action: "ping",
                    reqId: data.reqId,
                    data: { rttMs: 100 },
                });
            }

            if (data.type === "rpc" && data.action === "set_sub_params") {
                const entry = st.timers.get(data.channel);
                const eff = Math.max(250, data.data?.intervalMs ?? 1000);
                if (entry) {
                    clearInterval(entry.id);
                    entry.id = setInterval(() => pushStats(client, st), eff);
                    st.timers.set(data.channel, entry);
                }
                send(client, {
                    type: "ack",
                    action: "set_sub_params",
                    channel: data.channel,
                    reqId: data.reqId,
                    data: {
                        effectiveIntervalMs: eff,
                    },
                });
            }

            if (data.type === "sub") {
                if (data.channel === "server.stats") {
                    const eff = Math.max(250, data.data?.intervalMs ?? 1000);
                    send(client, {
                        type: "ack",
                        action: "sub",
                        channel: data.channel,
                        data: {
                            effectiveIntervalMs: eff,
                        },
                    });
                    st.cursor += 1;
                    send(client, {
                        type: "event",
                        action: "snapshot",
                        channel: data.channel,
                        cursor: String(st.cursor),
                        data: makeStats(),
                    });
                    const id = setInterval(() => pushStats(client, st), eff);
                    st.timers.set(data.channel, { id, every: eff });
                } else if (data.channel === "monitoring") {
                    const eff = Math.max(250, data.data?.intervalMs ?? 1000);
                    send(client, {
                        type: "ack",
                        action: "sub",
                        channel: data.channel,
                        data: {
                            effectiveIntervalMs: eff,
                        },
                    });
                    st.cursor += 1;
                    send(client, {
                        type: "event",
                        action: "snapshot",
                        channel: data.channel,
                        cursor: String(st.cursor),
                        data: rnData,
                    });
                    const id = setInterval(() => pushRnData(client, st), eff);
                    st.timers.set(data.channel, { id, every: eff });
                } else {
                    send(client, {
                        type: "error",
                        action: "sub",
                        channel: data.channel,
                        error: "not implemented",
                    });
                }
            }

            if (data.type === "unsub") {
                const entry = st.timers.get(data.channel);
                if (entry) {
                    clearInterval(entry.id);
                    st.timers.delete(data.channel);
                }
                send(client, {
                    type: "ack",
                    action: "unsub",
                    channel: data.channel,
                });
            }
        });

        client.addEventListener("close", () => {
            console.log("WebSocket client disconnected", client, info, server);
            const s = stateByClient.get(client);
            if (s) {
                for (const entry of s.timers.values()) {
                    clearInterval(entry.id);
                }
            }
            stateByClient.delete(client);
        });
    }),
];
