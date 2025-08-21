// import {
//     WebSocketGateway,
//     SubscribeMessage,
//     WebSocketServer,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
      
//   } from '@nestjs/websockets';
//   import { Server, Socket } from 'socket.io';
//   import { Logger, OnModuleDestroy } from '@nestjs/common';
//   import * as WebSocket from 'ws';
  
//   @WebSocketGateway({
//       cors: { origin: '*', methods: ['GET','POST'], credentials: true },
//       transports: ['websocket'],
//       namespace: '/',
//     })
//     export class TranscriptionGateway implements OnGatewayConnection, OnGatewayDisconnect, OnModuleDestroy {
//       private readonly logger = new Logger(TranscriptionGateway.name);
    
//       @WebSocketServer() server: Server;
    
//       private assemblyWS: WebSocket | null = null;
//       private reconnecting = false;
    
//       constructor() {
//         this.connectAssemblyAI();
//       }
  
//       // ✅ Clean up on application shutdown
//       onModuleDestroy() {
//         if (this.assemblyWS) {
//           this.assemblyWS.removeAllListeners();
//           this.assemblyWS.close();
//           this.assemblyWS = null;
//         }
//       }
    
//       private connectAssemblyAI() {
//         // ✅ Close existing connection before creating new one
//         if (this.assemblyWS) {
//           if (this.assemblyWS.readyState === 1) { // 1 = OPEN
//             this.logger.log('✅ AssemblyAI WebSocket already connected');
//             return;
//           }
//           // Clean up existing connection
//           this.assemblyWS.removeAllListeners();
//           if (this.assemblyWS.readyState === 0  ) {
//             // 0 = CONNECTING, 1 = OPEN
//             this.assemblyWS.close();
//           }
//         }
  
//         this.logger.log('🔗 Connecting to AssemblyAI Realtime...');
//         console.log(process.env.ASSMBLEY_AI_API_KEY);
        
//         this.assemblyWS = new WebSocket(
//           'wss://api.assemblyai.com/v3/realtime/ws?sample_rate=16000',
//           { headers: { Authorization: process.env.ASSMBLEY_AI_API_KEY || '' } } as any
//         );
    
//         this.assemblyWS.on('open', () => {
//           this.logger.log('✅ AssemblyAI WebSocket connected');
//           this.reconnecting = false;
//         });
    
//         this.assemblyWS.on('message', (msg) => {
//           try {
//             const data = JSON.parse(msg.toString());
//             this.logger.log(`📨 Received from AssemblyAI:`, data);
            
//             if (data.message_type === 'FinalTranscript' && data.text) {
//               this.logger.log(`📝 Final Transcript: ${data.text}`);
//               this.server.emit('transcript', { text: data.text, timestamp: new Date().toISOString(), final: true });
//             } else if (data.message_type === 'PartialTranscript' && data.text) {
//               this.logger.log(`📝 Partial Transcript: ${data.text}`);
//               this.server.emit('transcript', { text: data.text, timestamp: new Date().toISOString(), final: false });
//             }
//           } catch (err) {
//             this.logger.error('Error parsing AssemblyAI message:', err);
//           }
//         });
    
//         this.assemblyWS.on('close', (code, reason) => {
//           this.logger.warn(`❌ AssemblyAI WebSocket closed. Code: ${code}, Reason: ${reason.toString()}`);
          
//           // ✅ Handle "too many sessions" error differently
//           if (code === 1008) {
//             this.logger.error('🚫 Too many concurrent AssemblyAI sessions. Waiting longer before reconnect...');
//             if (!this.reconnecting) {
//               this.reconnecting = true;
//               // Wait longer for concurrent session limits
//               setTimeout(() => this.connectAssemblyAI(), 15000);
//             }
//           } else if (!this.reconnecting) {
//             this.reconnecting = true;
//             setTimeout(() => this.connectAssemblyAI(), 5000);
//           }
//         });
    
//         this.assemblyWS.on('error', (err) => {
//           this.logger.error('AssemblyAI WebSocket error:', err);
//         });
//       }
    
//       async handleConnection(client: Socket) {
//         this.logger.log(`👤 Client connected: ${client.id}`);
//         client.emit('connection_status', { status: 'connected' });
//       }
    
//       async handleDisconnect(client: Socket) {
//         this.logger.log(`❌ Client disconnected: ${client.id}`);
//       }
    
//       @SubscribeMessage('audio_chunk')
//       handleAudioChunk(client: Socket, payload: any) {
//         const audioData = payload?.data?.audio;
//         if (!audioData) {
//           this.logger.warn(`❌ Invalid audio payload from ${client.id}`);
//           return { success: false, message: 'Invalid payload' };
//         }
    
//         if (!this.assemblyWS || this.assemblyWS.readyState !== 1) { // 1 = OPEN
//           this.logger.warn('AssemblyAI connection not ready');
//           return { success: false, message: 'Transcription service not ready' };
//         }
    
//         try {
//           // Convert base64 to binary
//           const audioBuffer = Buffer.from(audioData, 'base64');
          
//           // Check if this looks like MP4 data
//           const audioString = audioBuffer.toString('ascii', 0, 20);
//           if (audioString.includes('ftyp') || audioString.includes('mp4') || audioString.includes('isom')) {
//             this.logger.warn('❌ MP4 format detected - converting to PCM16...');
//             return { success: false, message: 'MP4 conversion not implemented - please send PCM16 audio' };
//           }
          
//           // Send binary audio data directly
//           this.assemblyWS.send(audioBuffer);
//           this.logger.log(`📤 Sent ${audioBuffer.length} bytes of audio data`);
//           return { success: true, message: 'Audio chunk sent' };
//         } catch (err: any) {
//           this.logger.error(`Send failed: ${err.message}`);
//           return { success: false, message: 'Send failed' };
//         }
//       }
    
//       @SubscribeMessage('ping')
//       handlePing(client: Socket) {
//         client.emit('pong', { timestamp: new Date().toISOString() });
//         return { success: true };
//       }
//     }