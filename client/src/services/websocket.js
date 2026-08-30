// WebSocket Client Service with Auto-Reconnect & Heartbeat

export class WebSocketClient {
  constructor(onEvent, onStatusChange) {
    this.onEvent = onEvent;
    this.onStatusChange = onStatusChange;
    this.ws = null;
    this.pingInterval = null;
    this.reconnectTimeout = null;
    this.isExplicitlyClosed = false;
  }

  connect() {
    this.isExplicitlyClosed = false;

    // Detect protocol & host
    const isHttps = window.location.protocol === 'https:';
    const protocol = isHttps ? 'wss:' : 'ws:';
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        if (this.onStatusChange) this.onStatusChange(true);

        // Setup Ping Heartbeat every 20 seconds
        if (this.pingInterval) clearInterval(this.pingInterval);
        this.pingInterval = setInterval(() => {
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'PING' }));
          }
        }, 20000);
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'PONG') return;
          if (this.onEvent) this.onEvent(data);
        } catch (e) {
          console.error("Erro ao processar mensagem WebSocket:", e);
        }
      };

      this.ws.onclose = () => {
        if (this.onStatusChange) this.onStatusChange(false);
        this.cleanup();
        if (!this.isExplicitlyClosed) {
          // Reconnect in 3s
          this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
        }
      };

      this.ws.onerror = (err) => {
        if (this.onStatusChange) this.onStatusChange(false);
      };
    } catch (err) {
      if (this.onStatusChange) this.onStatusChange(false);
      if (!this.isExplicitlyClosed) {
        this.reconnectTimeout = setTimeout(() => this.connect(), 4000);
      }
    }
  }

  cleanup() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  close() {
    this.isExplicitlyClosed = true;
    this.cleanup();
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
