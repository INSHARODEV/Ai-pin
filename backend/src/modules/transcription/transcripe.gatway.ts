// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   MessageBody,
//   ConnectedSocket,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';

// @WebSocketGateway({ cors: true })
// export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   @WebSocketServer()
//   server: Server;

//   private clientMap = new Map<string, RealtimeTranscriber>();

//   async handleConnection(client: Socket) {
//     console.log(`🔗 Client connected: ${client.id}`);
//   }

//   async handleDisconnect(client: Socket) {
//     console.log(`🔌 Client disconnected: ${client.id}`);
//     const rt = this.clientMap.get(client.id);
//     if (rt) {
//       try {
//         await rt.close();
//       } catch {}
//       this.clientMap.delete(client.id);
//     }
//   }

//   /**
//    * Start transcription session for this client
//    */
//   @SubscribeMessage('start-transcription')
//   async handleStartTranscription(client: Socket) {
    
//     console.log(`🎙️ Starting transcription for ${client.id}`);

//     const aai = new AssemblyAI({ apiKey: '92d0012217dc4ecdb5db890545addfa0' });

//     const rt  = aai.streaming.transcriber({
//       sampleRate: 16000,
//       minEndOfTurnSilenceWhenConfident:500,
   
     
//     })as any;

//     this.clientMap.set(client.id, rt);

//     // attach event handlers
//     rt.on('open', ({ id, expires_at }) => {
//       console.log(`✅ AssemblyAI connected for ${client.id} (${id})`);
//       client.emit('transcription-ready', {
//         sessionId: id,
//         expiresAt: expires_at,
//       });
//     });

//     // rt.on('turn', (turn) => {
//     //   if (!turn) return;
//     //   if (turn.transcript && !turn.end_of_turn) {
//     //     client.emit('partial-transcript', turn.transcript);
//     //   }
//     //   if (turn.end_of_turn && turn.transcript) {
//     //     client.emit('final-transcript', {
//     //       text: turn.transcript,
//     //       confidence: turn.confidence,
//     //     });
//     //   }
//     // });
//     rt.on('turn', (turn) => {
//       console.log('🔄 Turn event received:', turn); // ADD THIS DEBUG LINE
      
//       if (!turn) return;
      
//       if (turn.transcript && !turn.end_of_turn) {
//         console.log('📝 Partial:', turn.transcript); // ADD DEBUG
//         client.emit('partial-transcript', turn.transcript);
//       }
      
//       if (turn.end_of_turn && turn.transcript) {
//         console.log('✅ Final:', turn.transcript); // ADD DEBUG
//         client.emit('final-transcript', {
//           text: turn.transcript,
//           confidence: turn.confidence,
//         });
//       }
//     });

//     rt.on('error', (err) => {
//       console.error('❌ AssemblyAI error:', err);
//       client.emit('error', 'AssemblyAI session error');
//     });

//     rt.on('close', () => {
//       console.log(`🔒 AssemblyAI closed for ${client.id}`);
//       client.emit('session-ended');
//     });

//     await rt.connect();
//   }

//   /**
//    * Receive audio data from frontend and forward to AssemblyAI
//    */
//   // @SubscribeMessage('audio-data')
//   // async handleAudioData(@ConnectedSocket() client: Socket, @MessageBody() buffer: ArrayBuffer) {
//   //   // console.log(client)
//   //   const rt = this.clientMap.get(client.id);
//   //   if (!rt  ) return;

//   //   // convert ArrayBuffer -> Buffer
//   //   const chunk = Buffer.from(buffer);

//   //   try {
//   //     rt.sendAudio(chunk as any);
//   //   } catch (err) {
//   //     console.error('⚠️ Failed to send audio:', err);
//   //   }
//   // }
//   @SubscribeMessage('audio-data')
// async handleAudioData(@ConnectedSocket() client: Socket, @MessageBody() buffer: ArrayBuffer) {
//   const rt = this.clientMap.get(client.id);
//   if (!rt) {
//     console.log('⚠️ No transcriber found');
//     return;
//   }

//   const chunk = Buffer.from(buffer);
//   console.log(`🎵 Received ${chunk.length} bytes from ${client.id}`); // ADD THIS LOG

//   try {
//     rt.sendAudio(chunk as any);
//   } catch (err) {
//     console.error('⚠️ Failed to send audio:', err);
//   }
// }

//   /**
//    * Stop transcription session
//    */
//   @SubscribeMessage('stop-transcription')
//   async handleStopTranscription(client: Socket) {
//     console.log(`🛑 Stopping transcription for ${client.id}`);
//     const rt = this.clientMap.get(client.id);
//     if (rt) {
//       try {
//         await rt.close();
//       } catch {}
//       this.clientMap.delete(client.id);
//     }
//     client.emit('session-ended');
//   }
// }
