// import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';

// // Use dynamic import to avoid TypeScript issues
// let ioClient: any;

// interface ClientConnection {
//   id: string;
//   socket: any;
//   onTranscript: (text: string) => void;
//   isReady: boolean;
//   isConnecting: boolean;
// }

// @Injectable()
// export class TranscriptionService implements OnModuleDestroy {
//   private readonly logger = new Logger(TranscriptionService.name);
//   private clients: Map<string, ClientConnection> = new Map();

//   async addClient(clientId: string, onTranscript: (text: string) => void): Promise<void> {
//     // CRITICAL: Check if client already exists
//     const existingClient = this.clients.get(clientId);
//     if (existingClient) {
//       if (existingClient.isConnecting || existingClient.isReady) {
//         this.logger.warn(`Client ${clientId} already exists and is connected/connecting. Skipping.`);
//         return;
//       }
//     }

//     // Clean up any existing connection before creating new one
//     this.removeClient(clientId);

//     // Dynamic import to avoid TypeScript issues
//     if (!ioClient) {
//       ioClient = require('socket.io-client');
//     }

//     this.logger.log(`🔄 Creating new connection for client ${clientId}`);

//     const socket = ioClient("http://localhost:8000", {
//       transports: ["websocket"],
//       autoConnect: true,
//       forceNew: true, // Force new connection
//       reconnection: false, // Disable auto-reconnection to prevent leaks
//     });

//     const clientConnection: ClientConnection = {
//       id: clientId,
//       socket,
//       onTranscript,
//       isReady: false,
//       isConnecting: true,
//     };

//     this.clients.set(clientId, clientConnection);

//     return new Promise((resolve, reject) => {
//       const cleanup = () => {
//         clientConnection.isConnecting = false;
//       };

//       socket.on("connect", () => {
//         this.logger.log(`✅ Connected for client ${clientId}`);
//         clientConnection.isReady = true;
//         clientConnection.isConnecting = false;
//         resolve();
//       });

//       socket.on("connect_error", (error: Error) => {
//         this.logger.error(`❌ Connection error for client ${clientId}:`, error.message);
//         cleanup();
//         this.removeClient(clientId);
//         reject(error);
//       });

//       socket.on("disconnect", (reason: string) => {
//         this.logger.log(`❌ Disconnected for client ${clientId}:`, reason);
//         clientConnection.isReady = false;
//         clientConnection.isConnecting = false;
//         // Don't automatically remove on disconnect - let the gateway handle it
//       });

//       socket.on("transcript", (msg: any) => {
//         this.logger.log(`📝 Transcript for ${clientId}:`, msg);
//         try {
//           onTranscript(msg.text || msg);
//         } catch (error) {
//           this.logger.error(`Error processing transcript for ${clientId}:`, error);
//         }
//       });

//       socket.on("error", (error: Error) => {
//         this.logger.error(`Socket error for client ${clientId}:`, error.message);
//         cleanup();
//       });

//       // Set timeout for connection
//       const timeoutId = setTimeout(() => {
//         if (clientConnection.isConnecting) {
//           cleanup();
//           this.removeClient(clientId);
//           reject(new Error(`Connection timeout for client ${clientId}`));
//         }
//       }, 10000);

//       // Clear timeout when connection succeeds
//       socket.once('connect', () => {
//         clearTimeout(timeoutId);
//       });
//     });
//   }

//   sendAudioChunk(clientId: string, base64Audio: string): boolean {
//     const clientConnection = this.clients.get(clientId);
//     if (!clientConnection) {
//       this.logger.error(`No client connection for ${clientId}`);
//       return false;
//     }

//     if (!clientConnection.isReady || !clientConnection.socket.connected) {
//       this.logger.error(`Client ${clientId} is not ready or disconnected`);
//       return false;
//     }

//     try {
//       clientConnection.socket.emit("audio_chunk", {
//         event: "audio_chunk",
//         data: { audio: base64Audio },
//       });
//       return true;
//     } catch (error) {
//       this.logger.error(`Error sending audio chunk for client ${clientId}:`, error);
//       return false;
//     }
//   }

//   removeClient(clientId: string): void {
//     const clientConnection = this.clients.get(clientId);
//     if (clientConnection) {
//       this.logger.log(`🗑️ Removing client ${clientId}`);
//       try {
//         // Remove all listeners to prevent memory leaks
//         if (clientConnection.socket) {
//           clientConnection.socket.removeAllListeners();
//           clientConnection.socket.disconnect();
//         }
//       } catch (error) {
//         this.logger.error(`Error disconnecting client ${clientId}:`, error);
//       }
//       this.clients.delete(clientId);
//     }
//   }

//   onModuleDestroy() {
//     this.logger.log('🧹 Cleaning up transcription service...');
//     const clientIds = Array.from(this.clients.keys());
//     for (const clientId of clientIds) {
//       this.removeClient(clientId);
//     }
//     this.clients.clear();
//   }

//   getClientStatus(clientId: string): { exists: boolean; connected: boolean; ready: boolean; connecting: boolean } {
//     const clientConnection = this.clients.get(clientId);
//     if (!clientConnection) {
//       return { exists: false, connected: false, ready: false, connecting: false };
//     }
//     return {
//       exists: true,
//       connected: clientConnection.socket?.connected || false,
//       ready: clientConnection.isReady,
//       connecting: clientConnection.isConnecting,
//     };
//   }

//   // Add method to get connection stats
//   getConnectionStats(): { total: number; ready: number; connecting: number } {
//     let ready = 0;
//     let connecting = 0;
    
//     for (const client of this.clients.values()) {
//       if (client.isReady) ready++;
//       if (client.isConnecting) connecting++;
//     }
    
//     return {
//       total: this.clients.size,
//       ready,
//       connecting,
//     };
//   }
// }
