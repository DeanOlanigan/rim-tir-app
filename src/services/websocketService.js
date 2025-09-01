//TODO Реализовать с помощью rxjs/websocket
//TODO Добавить идентификацию хендлеров по типу

export class WebSocketService {
    constructor(url) {
        this.url = url;
        this.socket = null;
        this.reconnectInterval = 5000;
        this.messageHandlers = null;
        this.isConnected = false;
    }

    connect() {
        if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
            this.socket = new WebSocket(this.url);

            this.socket.onopen = () => {
                console.log("WebSocket connected");
                this.isConnected = true;
            };

            this.socket.onmessage = (event) => {
                if (!event.data) {
                    console.warn("Received empty message from WebSocket");
                    return;
                }

                try {
                    const message = JSON.parse(event.data);
                    this.messageHandlers(message);
                } catch {
                    //console.warn("Invalid JSON received:", event.data);
                    this.messageHandlers(event.data);
                }
            };

            this.socket.onclose = () => {
                console.log("WebSocket closed");
                this.isConnected = false;
            };

            this.socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                setTimeout(() => this.connect(), this.reconnectInterval);
            };
        }
    }

    sendMessage(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        } else {
            console.warn("WebSocket is not open");
            setTimeout(() => this.sendMessage(message), 500);
        }
    }

    addMessageHandler(handler) {
        this.messageHandlers = handler;
    }

    removeMessageHandler() {
        this.messageHandlers = null;
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}
