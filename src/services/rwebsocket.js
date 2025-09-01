export class ReconnectingWebSocketBus {
    #url;
    #ws;
    #listeners = new Map();
    #backoff = 500;
    #maxBackoff = 5000;
    #heartbeatId;
    #sessionId;

    constructor(url) {
        this.#url = url;
        this.#connect();
    }

    #connect(sessionId) {
        this.#ws = new WebSocket(this.#url);
        this.#ws.onopen = () => {
            this.#backoff = 500;
            this.#send({ type: "rpc", action: "hello", sessionId });
            for (const ch of this.#listeners.keys())
                this.#send({ type: "sub", channel: ch });
            this.#heartbeatId = window.setInterval(
                () => this.#send({ type: "rpc", action: "ping" }),
                15000
            );
        };
        this.#ws.onmessage = (e) => {
            const msg = JSON.parse(e.data);
            console.log(msg);
            if (msg.channel && msg.type === "event") {
                const ls = this.#listeners.get(msg.channel);
                if (ls) for (const l of ls) l(msg.data);
            }
            if (msg.type === "rpc" && msg.action === "hello") {
                this.#sessionId = msg.data.sessionId;
            }
        };
        this.#ws.onclose = () => this.#sheculeReconnect();
        this.#ws.onerror = () => this.#sheculeReconnect();
    }

    #sheculeReconnect() {
        if (this.#heartbeatId) clearInterval(this.#heartbeatId);
        const delta =
            Math.min(this.#backoff, this.#maxBackoff) +
            Math.random() * 0.3 * this.#backoff;
        setTimeout(() => this.#connect(this.#sessionId), delta);
        this.#backoff = Math.min(this.#backoff * 2, this.#maxBackoff);
    }

    #send(msg) {
        try {
            this.#ws?.readyState === WebSocket.OPEN &&
                this.#ws.send(JSON.stringify(msg));
        } catch {}
    }

    sub(channel, handler) {
        if (!this.#listeners.has(channel)) {
            this.#listeners.set(channel, new Set());
            this.#send({ type: "sub", channel });
        }
        this.#listeners.get(channel).add(handler);
        return () => this.unsub(channel, handler);
    }

    unsub(channel, handler) {
        const set = this.#listeners.get(channel);
        if (!set) return;
        set.delete(handler);
        if (set.size === 0) {
            this.#listeners.delete(channel);
            this.#send({ type: "unsub", channel });
        }
    }
}

export const bus = new ReconnectingWebSocketBus("ws://192.168.1.1:8800");
