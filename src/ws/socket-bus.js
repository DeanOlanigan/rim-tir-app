import ReconnectingWebSocket from "reconnecting-websocket";

const DEFAULT_URL = "ws://localhost:8800";
const TOKEN = "token";

function jsonSend(ws, obj) {
    if (ws && ws.readyState === 1) ws.send(JSON.stringify(obj));
}

export class SocketBus {
    constructor(opts = {}) {
        this.url = opts?.url ?? DEFAULT_URL;
        this.heartBeatMs = opts?.heartBeatMs ?? 15000;
        this.protocolVersion = opts?.protocolVersion ?? 1;

        this.ws = null;
        this.sessionId = null;
        this.lastPongAt = 0;

        /** @type {Map<string, Set<Function>>} */
        this.subscribers = new Map();
        /** @type {Map<string, Object>} */
        this.subParams = new Map();

        this._onOpen = this._onOpen.bind(this);
        this._onMessage = this._onMessage.bind(this);
        this._onClose = this._onClose.bind(this);

        this._heartBeatTimer = null;

        this.connect();
    }

    connect() {
        this.ws = new ReconnectingWebSocket(this.url, ["bearer", TOKEN], {
            maxReconnectionDelay: 30000,
            minReconnectionDelay: 1000,
            reconnectionDelayGrowFactor: 2,
            connectionTimeout: 10000,
            maxRetries: Infinity,
        });

        this.ws.addEventListener("open", this._onOpen);
        this.ws.addEventListener("message", this._onMessage);
        this.ws.addEventListener("close", this._onClose);
    }

    _onOpen() {
        /* jsonSend(this.ws, {
            type: "rpc",
            action: "hello",
            protocolVersion: this.protocolVersion,
            sessionId: this.sessionId,
            ts: Date.now(),
        }); */

        for (const [ch, params] of this.subParams.entries()) {
            jsonSend(this.ws, {
                type: "sub",
                channel: ch,
                data: params,
                ts: Date.now(),
            });
        }

        this._startHeartBeat();
    }

    _onClose(e) {
        this._stopHeartBeat();
        console.log("close", e);
    }

    _startHeartBeat() {
        this._stopHeartBeat();
        this._heartBeatTimer = setInterval(() => {
            const reqId = `ping-${Date.now()}`;
            jsonSend(this.ws, {
                type: "rpc",
                action: "ping",
                reqId,
                ts: Date.now(),
            });
        }, this.heartBeatMs);
    }

    _stopHeartBeat() {
        if (this._heartBeatTimer) clearInterval(this._heartBeatTimer);
        this._heartBeatTimer = null;
    }

    _onMessage(ev) {
        let msg;
        try {
            msg = JSON.parse(ev.data);
        } catch {
            return;
        }

        if (
            msg.type === "ack" &&
            msg.action === "hello" &&
            msg.data?.sessionId
        ) {
            this.sessionId = msg.data.sessionId;
            console.log("ack hello", this.sessionId);
        }

        if (msg.type === "ack" && msg.action === "ping") {
            this.lastPongAt = Date.now();
            console.log("ack ping", this.lastPongAt);
        }

        if (msg.type === "event" && msg.channel) {
            const listeners = this.subscribers.get(msg.channel);
            if (listeners && listeners.size) {
                for (const cb of listeners) {
                    try {
                        cb(msg.data, msg);
                    } catch {}
                }
            }
        }
    }

    on(channel, listener, params = undefined) {
        if (!this.subscribers.has(channel)) {
            this.subscribers.set(channel, new Set());
            this.subParams.set(channel, params || {});
            jsonSend(this.ws, {
                type: "sub",
                channel,
                data: params || {},
                ts: Date.now(),
            });
        } else if (params) {
            const next = { ...(this.subParams.get(channel) || {}), ...params };
            this.subParams.set(channel, next);
            jsonSend(this.ws, {
                type: "rpc",
                action: "set_sub_params",
                channel,
                data: params,
                ts: Date.now(),
            });
        }
        this.subscribers.get(channel).add(listener);
        return () => this.off(channel, listener);
    }

    off(channel, listener) {
        const set = this.subscribers.get(channel);
        if (!set) return;
        set.delete(listener);
        if (set.size === 0) {
            this.subscribers.delete(channel);
            this.subParams.delete(channel);
            jsonSend(this.ws, {
                type: "unsub",
                channel,
                ts: Date.now(),
            });
        }
    }

    setSubParams(channel, params) {
        const next = { ...(this.subParams.get(channel) || {}), ...params };
        this.subParams.set(channel, next);
        jsonSend(this.ws, {
            type: "rpc",
            action: "set_sub_params",
            channel,
            data: params,
            ts: Date.now(),
        });
    }

    rpc(action, data = {}, channel = undefined, timeoutMs = 1000) {
        const reqId = `${action}-${Math.random().toString(36).slice(2)}`;
        return new Promise((resolve, reject) => {
            const onAck = (e) => {
                let m;
                try {
                    m = JSON.parse(e.data);
                } catch {
                    return;
                }
                const ok =
                    (m.type === "ack" || m.type === "error") &&
                    m.action === action &&
                    m.reqId === reqId;
                if (!ok) return;

                this.ws.removeEventListener("message", onAck);
                clearTimeout(t);
                if (m.type === "ack") resolve(m.data);
                else reject(m.error);
            };
            const t = setTimeout(() => {
                this.ws.removeEventListener("message", onAck);
                reject({ code: "TIMEOUT", message: `RPC ${action} timeout` });
            }, timeoutMs);
            this.ws.addEventListener("message", onAck);
            jsonSend(this.ws, {
                type: "rpc",
                action,
                channel,
                reqId,
                data,
                ts: Date.now(),
            });
        });
    }
}

export const bus = new SocketBus({ url: "ws://192.168.1.1:8800" });
