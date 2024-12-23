//TODO Реализовать с помощью rxjs/websocket (или нет, я ебу) PS: Сделано на винилле
//TODO Добавить идентификацию хендлеров по типу

class WebSocketService {
    static instance;

    constructor(url) {
        if (WebSocketService.instance) {
            return WebSocketService.instance;
        }

        this.url = url;
        this.socket = null;
        this.reconnectInterval = 5000;
        this.messageHandlers = [];
        this.isConnected = false;

        WebSocketService.instance = this;
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
                    this.messageHandlers.forEach((handler) => handler(message));
                } catch {
                    console.warn("Invalid JSON received:", event.data);
                }
            };

            this.socket.onclose = () => {
                console.log("WebSocket closed");
                this.isConnected = false;
                setTimeout(() => this.connect(), this.reconnectInterval);
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
        }
    }

    addMessageHandler(handler) {
        this.messageHandlers.push(handler);
    }

    removeMessageHandler(handler) {
        this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    }

    close() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }
}

export default new WebSocketService("ws://192.168.1.1:8800");
