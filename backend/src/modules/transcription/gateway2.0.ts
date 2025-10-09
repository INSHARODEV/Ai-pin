// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   ConnectedSocket,
//   MessageBody,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import * as WebSocket from 'ws';

// @WebSocketGateway({ cors: true })
// export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   private speechmaticsConnections: Map<string, WebSocket> = new Map();
  
//   // Replace with your Speechmatics API key
//   private readonly SPEECHMATICS_API_KEY = process.env.SPEACH_MATICS_API_KEY || 'your-api-key-here';
//   private readonly SPEECHMATICS_URL = 'wss://eu2.rt.speechmatics.com/v2';

//   async handleConnection(client: Socket) {
//     console.log(`⚡ Client connected: ${client.id}`);

//     try {
//       // Connect to Speechmatics WebSocket
//       const ws = new WebSocket(this.SPEECHMATICS_URL, {
//         headers: {
//           'Authorization': `Bearer ${this.SPEECHMATICS_API_KEY}`
//         }
//       });

//       ws.on('open', () => {
//         console.log(`✅ Speechmatics connected for client ${client.id}`);
        
//         // Send StartRecognition message
//         const startRecognitionMsg = {
//           message: 'StartRecognition',
//           audio_format: {
//             type: 'raw',
//             encoding: 'pcm_f32le',
//             sample_rate: 16000
//           },
//           transcription_config: {
//             language: 'en',
//             enable_partials: true,
//             max_delay: 2,
//             enable_entities: false,
//             diarization: 'none'
//           }
//         };
        
//         ws.send(JSON.stringify(startRecognitionMsg));
//         client.emit('status', { type: 'connected', message: 'Ready to transcribe' });
//       });

//       ws.on('message', (data: Buffer) => {
//         try {
//           const message = JSON.parse(data.toString());
          
//           // Handle different message types
//           switch (message.message) {
//             case 'RecognitionStarted':
//               console.log(`🎤 Recognition started for ${client.id}`);
//               client.emit('status', { type: 'recognition_started' });
//               break;
              
//             case 'AddPartialTranscript':
//               // Send partial transcripts for real-time feedback
//               const partialText = message.results
//                 ?.map((r: any) => r.alternatives?.[0]?.content || '')
//                 .join('');
//               if (partialText) {
//                 client.emit('partial_transcription', partialText);
//               }
//               break;
              
//             case 'AddTranscript':
//               // Send final transcripts
//               const finalText = message.results
//                 ?.map((r: any) => r.alternatives?.[0]?.content || '')
//                 .join('');
//               if (finalText) {
//                 client.emit('transcription', {
//                   text: finalText,
//                   metadata: message.metadata
//                 });
//               }
//               break;
              
//             case 'EndOfTranscript':
//               console.log(`✅ Transcription ended for ${client.id}`);
//               client.emit('status', { type: 'transcript_complete' });
//               break;
              
//             case 'AudioAdded':
//               // Audio chunk acknowledged
//               break;
              
//             case 'Info':
//               console.log(`ℹ️ Info for ${client.id}:`, message.type, message.reason);
//               break;
              
//             case 'Warning':
//               console.warn(`⚠️ Warning for ${client.id}:`, message.type, message.reason);
//               client.emit('warning', { type: message.type, reason: message.reason });
//               break;
              
//             case 'Error':
//               console.error(`❌ Error for ${client.id}:`, message.type, message.reason);
//               client.emit('error', { type: message.type, reason: message.reason });
//               break;
//           }
//         } catch (error) {
//           console.error(`Error parsing Speechmatics message:`, error);
//         }
//       });

//       ws.on('error', (error) => {
//         console.error(`❌ Speechmatics WebSocket error for ${client.id}:`, error);
//         client.emit('error', { message: 'Connection error' });
//       });

//       ws.on('close', (code, reason) => {
//         console.log(`🔌 Speechmatics disconnected for ${client.id}: ${code} - ${reason}`);
//         this.speechmaticsConnections.delete(client.id);
//         client.emit('status', { type: 'disconnected' });
//       });

//       this.speechmaticsConnections.set(client.id, ws);
//     } catch (error) {
//       console.error(`Failed to connect to Speechmatics for ${client.id}:`, error);
//       client.emit('error', { message: 'Failed to initialize transcription' });
//     }
//   }

//   async handleDisconnect(client: Socket) {
//     console.log(`❌ Client disconnected: ${client.id}`);
    
//     const ws = this.speechmaticsConnections.get(client.id);
//     if (ws) {
//       // Send EndOfStream message before closing
//       if (ws.readyState === WebSocket.OPEN) {
//         ws.send(JSON.stringify({ message: 'EndOfStream' }));
        
//         // Wait a bit for final transcripts
//         setTimeout(() => {
//           ws.close();
//         }, 500);
//       } else {
//         ws.close();
//       }
      
//       this.speechmaticsConnections.delete(client.id);
//     }
//   }

//   @SubscribeMessage('audio_chunk')
//   async handleAudio(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { chunk: string } // base64 encoded audio
//   ) {
//     const ws = this.speechmaticsConnections.get(client.id);
    
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       try {
//         // Convert base64 to binary and send
//         const audioBuffer = Buffer.from(data.chunk, 'base64');
//         ws.send(audioBuffer);
//       } catch (error) {
//         console.error(`Error sending audio for ${client.id}:`, error);
//       }
//     }
//   }

//   @SubscribeMessage('end_stream')
//   async handleEndStream(@ConnectedSocket() client: Socket) {
//     const ws = this.speechmaticsConnections.get(client.id);
    
//     if (ws && ws.readyState === WebSocket.OPEN) {
//       ws.send(JSON.stringify({ message: 'EndOfStream' }));
//       console.log(`📤 EndOfStream sent for ${client.id}`);
//     }
//   }
// }