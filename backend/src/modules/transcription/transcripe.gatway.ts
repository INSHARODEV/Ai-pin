// // // // // // import {
// // // // // //   WebSocketGateway,
// // // // // //   WebSocketServer,
// // // // // //   SubscribeMessage,
// // // // // //   OnGatewayConnection,
// // // // // //   OnGatewayDisconnect,
// // // // // //   MessageBody,
// // // // // //   ConnectedSocket,
// // // // // // } from '@nestjs/websockets';
// // // // // // import { Server, Socket } from 'socket.io';
// // // // // // import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
// // // // // // import { ChatGpt } from './ChtGPT.servcie';

// // // // // // @WebSocketGateway({ cors: true })
// // // // // // export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
// // // // // //   constructor(private readonly ChatGpt:ChatGpt){}
// // // // // //   @WebSocketServer()
// // // // // //   server: Server;

// // // // // //   private clientMap = new Map<string, RealtimeTranscriber>();

// // // // // //   async handleConnection(client: Socket) {
// // // // // //     console.log(`🔗 Client connected: ${client.id}`);
// // // // // //   }

// // // // // //   async handleDisconnect(client: Socket) {
// // // // // //     console.log(`🔌 Client disconnected: ${client.id}`);
// // // // // //     const rt = this.clientMap.get(client.id);
// // // // // //     if (rt) {
// // // // // //       try {
// // // // // //         await rt.close();
// // // // // //       } catch {}
// // // // // //       this.clientMap.delete(client.id);
// // // // // //     }
// // // // // //   }

// // // // // //   /**
// // // // // //    * Start transcription session for this client
// // // // // //    */
// // // // // //   @SubscribeMessage('start-transcription')
// // // // // //   async handleStartTranscription(client: Socket) {
    
// // // // // //     console.log(`🎙️ Starting transcription for ${client.id}`);

// // // // // //     const aai = new AssemblyAI({ apiKey: '92d0012217dc4ecdb5db890545addfa0' });

// // // // // //     const rt  = aai.streaming.transcriber({
// // // // // //       sampleRate: 16000,
// // // // // //       minEndOfTurnSilenceWhenConfident:500,
   
     
// // // // // //     })as any;

// // // // // //     this.clientMap.set(client.id, rt);

// // // // // //     // attach event handlers
// // // // // //     rt.on('open', ({ id, expires_at }) => {
// // // // // //       console.log(`✅ AssemblyAI connected for ${client.id} (${id})`);
// // // // // //       client.emit('transcription-ready', {
// // // // // //         sessionId: id,
// // // // // //         expiresAt: expires_at,
// // // // // //       });
// // // // // //     });

// // // // // //     // rt.on('turn', (turn) => {
// // // // // //     //   if (!turn) return;
// // // // // //     //   if (turn.transcript && !turn.end_of_turn) {
// // // // // //     //     client.emit('partial-transcript', turn.transcript);
// // // // // //     //   }
// // // // // //     //   if (turn.end_of_turn && turn.transcript) {
// // // // // //     //     client.emit('final-transcript', {
// // // // // //     //       text: turn.transcript,
// // // // // //     //       confidence: turn.confidence,
// // // // // //     //     });
// // // // // //     //   }
// // // // // //     // });
// // // // // //     rt.on('turn', (turn) => {
// // // // // //       console.log('🔄 Turn event received:', turn); // ADD THIS DEBUG LINE
      
// // // // // //       if (!turn) return;
      
// // // // // //       if (turn.transcript && !turn.end_of_turn) {
// // // // // //         console.log('📝 Partial:', turn.transcript); // ADD DEBUG
// // // // // //         client.emit('partial-transcript', turn.transcript);
// // // // // //       }
      
// // // // // //       if (turn.end_of_turn && turn.transcript) {
// // // // // //         console.log('✅ Final:', turn.transcript); // ADD DEBUG
        
// // // // // //         client.emit('final-transcript', {
// // // // // //           text: turn.transcript,
// // // // // //           confidence: turn.confidence,
// // // // // //         });
// // // // // //       }
// // // // // //     });

// // // // // //     rt.on('error', (err) => {
// // // // // //       console.error('❌ AssemblyAI error:', err);
// // // // // //       client.emit('error', 'AssemblyAI session error');
// // // // // //     });

// // // // // //     rt.on('close', () => {
// // // // // //       console.log(`🔒 AssemblyAI closed for ${client.id}`);
// // // // // //       client.emit('session-ended');
// // // // // //     });

// // // // // //     await rt.connect();
// // // // // //   }

// // // // // //   /**
// // // // // //    * Receive audio data from frontend and forward to AssemblyAI
// // // // // //    */
// // // // // //   // @SubscribeMessage('audio-data')
// // // // // //   // async handleAudioData(@ConnectedSocket() client: Socket, @MessageBody() buffer: ArrayBuffer) {
// // // // // //   //   // console.log(client)
// // // // // //   //   const rt = this.clientMap.get(client.id);
// // // // // //   //   if (!rt  ) return;

// // // // // //   //   // convert ArrayBuffer -> Buffer
// // // // // //   //   const chunk = Buffer.from(buffer);

// // // // // //   //   try {
// // // // // //   //     rt.sendAudio(chunk as any);
// // // // // //   //   } catch (err) {
// // // // // //   //     console.error('⚠️ Failed to send audio:', err);
// // // // // //   //   }
// // // // // //   // }
// // // // // //   @SubscribeMessage('audio-data')
// // // // // // async handleAudioData(@ConnectedSocket() client: Socket, @MessageBody() buffer: ArrayBuffer) {
// // // // // //   const rt = this.clientMap.get(client.id);
// // // // // //   if (!rt) {
// // // // // //     console.log('⚠️ No transcriber found');
// // // // // //     return;
// // // // // //   }

// // // // // //   const chunk = Buffer.from(buffer);
// // // // // //   console.log(`🎵 Received ${chunk.length} bytes from ${client.id}`); // ADD THIS LOG

// // // // // //   try {
// // // // // //     rt.sendAudio(chunk as any);
// // // // // //   } catch (err) {
// // // // // //     console.error('⚠️ Failed to send audio:', err);
// // // // // //   }
// // // // // // }

// // // // // //   /**
// // // // // //    * Stop transcription session
// // // // // //    */
// // // // // //   @SubscribeMessage('stop-transcription')
// // // // // //   async handleStopTranscription(client: Socket) {
// // // // // //     console.log(`🛑 Stopping transcription for ${client.id}`);
// // // // // //     const rt = this.clientMap.get(client.id);
// // // // // //     if (rt) {
// // // // // //       try {
// // // // // //         await rt.close();
// // // // // //       } catch {}
// // // // // //       this.clientMap.delete(client.id);
// // // // // //     }
// // // // // //     client.emit('session-ended');
// // // // // //   }
// // // // // // }
// // // // // // import {
// // // // // //   WebSocketGateway,
// // // // // //   WebSocketServer,
// // // // // //   SubscribeMessage,
// // // // // //   OnGatewayConnection,
// // // // // //   OnGatewayDisconnect,
// // // // // //   ConnectedSocket,
// // // // // //   MessageBody,
// // // // // // } from '@nestjs/websockets';
// // // // // // import { Server, Socket } from 'socket.io';
// // // // // // import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
// // // // // // import { ChatGpt } from './ChtGPT.servcie';
// // // // // // import { Logger } from '@nestjs/common';

// // // // // // @WebSocketGateway({ cors: true })
// // // // // // export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
// // // // // //   private readonly logger = new Logger(AudioGateway.name);
  
// // // // // //   constructor(private readonly ChatGpt: ChatGpt) {}

// // // // // //   @WebSocketServer()
// // // // // //   server: Server;

// // // // // //   private clientMap = new Map<string, RealtimeTranscriber>();

// // // // // //   async handleConnection(client: Socket) {
// // // // // //     this.logger.log(`🔗 Client connected: ${client.id}`);
// // // // // //   }

// // // // // //   async handleDisconnect(client: Socket) {
// // // // // //     this.logger.log(`🔌 Client disconnected: ${client.id}`);
// // // // // //     const rt = this.clientMap.get(client.id);
// // // // // //     if (rt) {
// // // // // //       try {
// // // // // //         await rt.close();
// // // // // //       } catch (err) {
// // // // // //         this.logger.error('Error closing transcriber:', err);
// // // // // //       }
// // // // // //       this.clientMap.delete(client.id);
// // // // // //     }
// // // // // //   }

// // // // // //   @SubscribeMessage('start-transcription')
// // // // // //   async handleStartTranscription(@ConnectedSocket() client: Socket) {
// // // // // //     this.logger.log(`🎙️ Starting transcription for ${client.id}`);

// // // // // //     const aai = new AssemblyAI({ 
// // // // // //       apiKey: process.env.ASSEMBLY_AI_API_KEY || '92d0012217dc4ecdb5db890545addfa0'
// // // // // //     });

// // // // // //     const rt = aai.streaming.transcriber({
// // // // // //       sampleRate: 16000,
// // // // // //       encoding: 'pcm_s16le',
// // // // // //       minEndOfTurnSilenceWhenConfident: 500,
// // // // // //     }) as any;

// // // // // //     this.clientMap.set(client.id, rt);

// // // // // //     rt.on('open', ({ id, expires_at }) => {
// // // // // //       this.logger.log(`✅ AssemblyAI connected for ${client.id} (${id})`);
// // // // // //       client.emit('transcription-ready', {
// // // // // //         sessionId: id,
// // // // // //         expiresAt: expires_at,
// // // // // //       });
// // // // // //     });

// // // // // //     rt.on('turn', (turn) => {
// // // // // //       if (!turn) return;

// // // // // //       if (turn.transcript && !turn.end_of_turn) {
// // // // // //         this.logger.verbose(`📝 Partial transcript: ${turn.transcript}`);
// // // // // //         client.emit('partial-transcript', turn.transcript);
// // // // // //       }

// // // // // //       if (turn.end_of_turn && turn.transcript) {
// // // // // //         this.logger.log(`✅ Final transcript: ${turn.transcript}`);
// // // // // //         client.emit('final-transcript', {
// // // // // //           text: turn.transcript,
// // // // // //           confidence: turn.confidence,
// // // // // //         });
// // // // // //       }
// // // // // //     });

// // // // // //     rt.on('error', (err) => {
// // // // // //       this.logger.error('❌ AssemblyAI error:', err);
// // // // // //       client.emit('error', 'AssemblyAI session error');
// // // // // //     });

// // // // // //     rt.on('close', () => {
// // // // // //       this.logger.log(`🔒 AssemblyAI closed for ${client.id}`);
// // // // // //       client.emit('session-ended');
// // // // // //     });

// // // // // //     await rt.connect();
// // // // // //   }

// // // // // //   @SubscribeMessage('audio-data')
// // // // // //   async handleAudioData(
// // // // // //     @ConnectedSocket() client: Socket,
// // // // // //     @MessageBody() buffer: ArrayBuffer,
// // // // // //   ) {
// // // // // //     const rt = this.clientMap.get(client.id);
// // // // // //     if (!rt) {
// // // // // //       this.logger.warn('⚠️ No transcriber found for client:', client.id);
// // // // // //       return;
// // // // // //     }

// // // // // //     const chunk = Buffer.from(buffer);
    
// // // // // //     try {
// // // // // //       rt.sendAudio(chunk as any);
// // // // // //     } catch (err) {
// // // // // //       this.logger.error('⚠️ Failed to send audio:', err);
// // // // // //     }
// // // // // //   }

// // // // // //   @SubscribeMessage('stop-transcription')
// // // // // //   async handleStopTranscription(@ConnectedSocket() client: Socket) {
// // // // // //     this.logger.log(`🛑 Stopping transcription for ${client.id}`);
// // // // // //     const rt = this.clientMap.get(client.id);
// // // // // //     if (rt) {
// // // // // //       try {
// // // // // //         await rt.close();
// // // // // //       } catch (err) {
// // // // // //         this.logger.error('Error closing transcriber:', err);
// // // // // //       }
// // // // // //       this.clientMap.delete(client.id);
// // // // // //     }
// // // // // //     client.emit('session-ended');
// // // // // //   }
// // // // // // }
// // // // // import {
// // // // //   WebSocketGateway,
// // // // //   WebSocketServer,
// // // // //   SubscribeMessage,
// // // // //   OnGatewayConnection,
// // // // //   OnGatewayDisconnect,
// // // // //   ConnectedSocket,
// // // // //   MessageBody,
// // // // // } from '@nestjs/websockets';
// // // // // import { Server, Socket } from 'socket.io';
// // // // // import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
// // // // // import { ChatGpt } from './ChtGPT.servcie';
// // // // // import { Logger } from '@nestjs/common';

// // // // // @WebSocketGateway({ 
// // // // //   cors: {
// // // // //     origin: '*', // Update this to your frontend URL in production
// // // // //     credentials: true,
// // // // //   }
// // // // // })
// // // // // export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
// // // // //   private readonly logger = new Logger(AudioGateway.name);
  
// // // // //   constructor(private readonly ChatGpt: ChatGpt) {}

// // // // //   @WebSocketServer()
// // // // //   server: Server;

// // // // //   private clientMap = new Map<string, RealtimeTranscriber>();
// // // // //   private chunkCounters = new Map<string, number>();

// // // // //   async handleConnection(client: Socket) {
// // // // //     this.logger.log(`🔗 Client connected: ${client.id}`);
// // // // //     this.chunkCounters.set(client.id, 0);
    
// // // // //     client.emit('status', { 
// // // // //       type: 'connected', 
// // // // //       message: 'Connected to transcription server' 
// // // // //     });
// // // // //   }

// // // // //   async handleDisconnect(client: Socket) {
// // // // //     this.logger.log(`🔌 Client disconnected: ${client.id}`);
    
// // // // //     const rt = this.clientMap.get(client.id);
// // // // //     if (rt) {
// // // // //       try {
// // // // //         await rt.close();
// // // // //         this.logger.log(`✅ Transcriber closed for ${client.id}`);
// // // // //       } catch (err) {
// // // // //         this.logger.error('Error closing transcriber:', err);
// // // // //       }
// // // // //       this.clientMap.delete(client.id);
// // // // //     }
    
// // // // //     this.chunkCounters.delete(client.id);
// // // // //   }

// // // // //   @SubscribeMessage('start-transcription')
// // // // //   async handleStartTranscription(@ConnectedSocket() client: Socket) {
// // // // //     this.logger.log(`🎙️ Starting transcription for client: ${client.id}`);

// // // // //     try {
// // // // //       const apiKey = process.env.ASSEMBLY_AI_API_KEY || '92d0012217dc4ecdb5db890545addfa0';
// // // // //       this.logger.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
      
// // // // //       const aai = new AssemblyAI({ apiKey });

// // // // //       const rt = aai.streaming.transcriber({
// // // // //         sampleRate: 16000,
// // // // //         encoding: 'pcm_s16le',
// // // // //         minEndOfTurnSilenceWhenConfident: 500,
// // // // //       }) as any;

// // // // //       this.clientMap.set(client.id, rt);
// // // // //       this.logger.log(`✅ Transcriber created for ${client.id}`);

// // // // //       rt.on('open', ({ id, expires_at }) => {
// // // // //         this.logger.log(`✅ AssemblyAI session opened for ${client.id}`);
// // // // //         this.logger.log(`   Session ID: ${id}`);
// // // // //         this.logger.log(`   Expires at: ${expires_at}`);
        
// // // // //         client.emit('transcription-ready', {
// // // // //           sessionId: id,
// // // // //           expiresAt: expires_at,
// // // // //         });
        
// // // // //         client.emit('status', { 
// // // // //           type: 'recognition_started', 
// // // // //           message: 'Recognition started - speak now' 
// // // // //         });
// // // // //       });

// // // // //       rt.on('turn', (turn) => {
// // // // //         if (!turn) {
// // // // //           this.logger.warn(`⚠️ Received empty turn for ${client.id}`);
// // // // //           return;
// // // // //         }

// // // // //         this.logger.verbose(`🔄 Turn event for ${client.id}:`, {
// // // // //           transcript: turn.transcript?.substring(0, 50),
// // // // //           endOfTurn: turn.end_of_turn,
// // // // //           confidence: turn.confidence,
// // // // //         });

// // // // //         if (turn.transcript && !turn.end_of_turn) {
// // // // //           this.logger.log(`📝 Partial transcript (${client.id}): "${turn.transcript.substring(0, 50)}..."`);
// // // // //           client.emit('partial-transcript', turn.transcript);
          
// // // // //           client.emit('status', { 
// // // // //             type: 'partial_received', 
// // // // //             message: 'Processing speech...' 
// // // // //           });
// // // // //         }

// // // // //         if (turn.end_of_turn && turn.transcript) {
// // // // //           this.logger.log(`✅ Final transcript (${client.id}): "${turn.transcript}"`);
// // // // //           this.logger.log(`   Confidence: ${turn.confidence}`);
          
// // // // //           client.emit('final-transcript', {
// // // // //             text: turn.transcript,
// // // // //             confidence: turn.confidence,
// // // // //           });
          
// // // // //           client.emit('status', { 
// // // // //             type: 'transcript_complete', 
// // // // //             message: 'Transcription complete' 
// // // // //           });
// // // // //         }
// // // // //       });

// // // // //       rt.on('error', (err) => {
// // // // //         this.logger.error(`❌ AssemblyAI error for ${client.id}:`, err);
// // // // //         client.emit('error', { 
// // // // //           type: 'transcription_error',
// // // // //           reason: err.message || 'AssemblyAI session error' 
// // // // //         });
// // // // //       });

// // // // //       rt.on('close', (code, reason) => {
// // // // //         this.logger.log(`🔒 AssemblyAI closed for ${client.id}. Code: ${code}, Reason: ${reason}`);
// // // // //         client.emit('session-ended');
// // // // //         client.emit('status', { 
// // // // //           type: 'disconnected', 
// // // // //           message: 'Transcription session ended' 
// // // // //         });
// // // // //       });

// // // // //       this.logger.log(`📡 Connecting to AssemblyAI for ${client.id}...`);
// // // // //       await rt.connect();
// // // // //       this.logger.log(`✅ Connected to AssemblyAI for ${client.id}`);
      
// // // // //     } catch (error) {
// // // // //       this.logger.error(`❌ Failed to start transcription for ${client.id}:`, error);
// // // // //       client.emit('error', { 
// // // // //         type: 'initialization_error',
// // // // //         reason: error.message || 'Failed to initialize transcription' 
// // // // //       });
// // // // //     }
// // // // //   }

// // // // //   @SubscribeMessage('audio-data')
// // // // //   async handleAudioData(
// // // // //     @ConnectedSocket() client: Socket,
// // // // //     @MessageBody() buffer: ArrayBuffer,
// // // // //   ) {
// // // // //     const rt = this.clientMap.get(client.id);
// // // // //     if (!rt) {
// // // // //       this.logger.warn(`⚠️ No transcriber found for client: ${client.id}`);
// // // // //       return;
// // // // //     }

// // // // //     const chunk = Buffer.from(buffer);
    
// // // // //     // Update chunk counter
// // // // //     const count = (this.chunkCounters.get(client.id) || 0) + 1;
// // // // //     this.chunkCounters.set(client.id, count);
    
// // // // //     // Log every 50 chunks
// // // // //     if (count % 50 === 0) {
// // // // //       this.logger.log(`🎵 Received ${count} audio chunks from ${client.id} (${chunk.length} bytes each)`);
// // // // //     }
    
// // // // //     // Log first chunk to verify audio is being received
// // // // //     if (count === 1) {
// // // // //       this.logger.log(`🎵 First audio chunk received from ${client.id}: ${chunk.length} bytes`);
// // // // //       this.logger.log(`   Sample values: [${Array.from(chunk.slice(0, 10)).join(', ')}...]`);
// // // // //     }

// // // // //     try {
// // // // //       rt.sendAudio(chunk as any);
// // // // //     } catch (err) {
// // // // //       this.logger.error(`⚠️ Failed to send audio to AssemblyAI for ${client.id}:`, err);
// // // // //       client.emit('error', { 
// // // // //         type: 'audio_send_error',
// // // // //         reason: 'Failed to process audio chunk' 
// // // // //       });
// // // // //     }
// // // // //   }

// // // // //   @SubscribeMessage('end_stream')
// // // // //   async handleEndStream(@ConnectedSocket() client: Socket) {
// // // // //     this.logger.log(`🔚 End of stream signal received from ${client.id}`);
    
// // // // //     const rt = this.clientMap.get(client.id);
// // // // //     if (rt) {
// // // // //       try {
// // // // //         // Force flush any remaining audio
// // // // //         await rt.close();
// // // // //         this.logger.log(`✅ Stream ended and transcriber closed for ${client.id}`);
// // // // //       } catch (err) {
// // // // //         this.logger.error('Error ending stream:', err);
// // // // //       }
// // // // //     }
    
// // // // //     const totalChunks = this.chunkCounters.get(client.id) || 0;
// // // // //     this.logger.log(`📊 Total chunks processed: ${totalChunks}`);
// // // // //   }

// // // // //   @SubscribeMessage('stop-transcription')
// // // // //   async handleStopTranscription(@ConnectedSocket() client: Socket) {
// // // // //     this.logger.log(`🛑 Stop transcription requested for ${client.id}`);
    
// // // // //     const rt = this.clientMap.get(client.id);
// // // // //     if (rt) {
// // // // //       try {
// // // // //         await rt.close();
// // // // //         this.logger.log(`✅ Transcriber stopped for ${client.id}`);
// // // // //       } catch (err) {
// // // // //         this.logger.error('Error stopping transcriber:', err);
// // // // //       }
// // // // //       this.clientMap.delete(client.id);
// // // // //     }
    
// // // // //     const totalChunks = this.chunkCounters.get(client.id) || 0;
// // // // //     this.logger.log(`📊 Session ended. Total chunks: ${totalChunks}`);
// // // // //     this.chunkCounters.delete(client.id);
    
// // // // //     client.emit('session-ended');
// // // // //     client.emit('status', { 
// // // // //       type: 'stopped', 
// // // // //       message: 'Transcription stopped' 
// // // // //     });
// // // // //   }
// // // // // }

// // // // import {
// // // //   WebSocketGateway,
// // // //   WebSocketServer,
// // // //   SubscribeMessage,
// // // //   OnGatewayConnection,
// // // //   OnGatewayDisconnect,
// // // //   ConnectedSocket,
// // // //   MessageBody,
// // // // } from '@nestjs/websockets';
// // // // import { Server, Socket } from 'socket.io';
// // // // import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
// // // // import { ChatGpt } from './ChtGPT.servcie';
// // // // import { Logger } from '@nestjs/common';

// // // // @WebSocketGateway({ 
// // // //   cors: {
// // // //     origin: '*', // Update this to your frontend URL in production
// // // //     credentials: true,
// // // //   }
// // // // })
// // // // export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
// // // //   private readonly logger = new Logger(AudioGateway.name);
  
// // // //   constructor(private readonly ChatGpt: ChatGpt) {}

// // // //   @WebSocketServer()
// // // //   server: Server;

// // // //   private clientMap = new Map<string, RealtimeTranscriber>();
// // // //   private chunkCounters = new Map<string, number>();

// // // //   async handleConnection(client: Socket) {
// // // //     this.logger.log(`🔗 Client connected: ${client.id}`);
// // // //     this.chunkCounters.set(client.id, 0);
    
// // // //     client.emit('status', { 
// // // //       type: 'connected', 
// // // //       message: 'Connected to transcription server' 
// // // //     });
// // // //   }

// // // //   async handleDisconnect(client: Socket) {
// // // //     this.logger.log(`🔌 Client disconnected: ${client.id}`);
    
// // // //     const rt = this.clientMap.get(client.id);
// // // //     if (rt) {
// // // //       try {
// // // //         await rt.close();
// // // //         this.logger.log(`✅ Transcriber closed for ${client.id}`);
// // // //       } catch (err) {
// // // //         this.logger.error('Error closing transcriber:', err);
// // // //       }
// // // //       this.clientMap.delete(client.id);
// // // //     }
    
// // // //     this.chunkCounters.delete(client.id);
// // // //   }

// // // //   @SubscribeMessage('start-transcription')
// // // //   async handleStartTranscription(@ConnectedSocket() client: Socket) {
// // // //     this.logger.log(`🎙️ Starting transcription for client: ${client.id}`);

// // // //     try {
// // // //       const apiKey = process.env.ASSEMBLY_AI_API_KEY || '92d0012217dc4ecdb5db890545addfa0';
// // // //       this.logger.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
      
// // // //       const aai = new AssemblyAI({ apiKey });

// // // //       const rt = aai.streaming.transcriber({
// // // //         sampleRate: 16000,
// // // //         encoding: 'pcm_s16le',
// // // //         minEndOfTurnSilenceWhenConfident: 500,
// // // //       }) as any;

// // // //       this.clientMap.set(client.id, rt);
// // // //       this.logger.log(`✅ Transcriber created for ${client.id}`);

// // // //       rt.on('open', ({ id, expires_at }) => {
// // // //         this.logger.log(`✅ AssemblyAI session opened for ${client.id}`);
// // // //         this.logger.log(`   Session ID: ${id}`);
// // // //         this.logger.log(`   Expires at: ${expires_at}`);
        
// // // //         client.emit('transcription-ready', {
// // // //           sessionId: id,
// // // //           expiresAt: expires_at,
// // // //         });
        
// // // //         client.emit('status', { 
// // // //           type: 'recognition_started', 
// // // //           message: 'Recognition started - speak now' 
// // // //         });
// // // //       });

// // // //       rt.on('turn', (turn) => {
// // // //         if (!turn) {
// // // //           this.logger.warn(`⚠️ Received empty turn for ${client.id}`);
// // // //           return;
// // // //         }

// // // //         this.logger.verbose(`🔄 Turn event for ${client.id}:`, {
// // // //           transcript: turn.transcript?.substring(0, 50),
// // // //           endOfTurn: turn.end_of_turn,
// // // //           confidence: turn.confidence,
// // // //         });

// // // //         if (turn.transcript && !turn.end_of_turn) {
// // // //           this.logger.log(`📝 Partial transcript (${client.id}): "${turn.transcript.substring(0, 50)}..."`);
// // // //           client.emit('partial-transcript', turn.transcript);
          
// // // //           client.emit('status', { 
// // // //             type: 'partial_received', 
// // // //             message: 'Processing speech...' 
// // // //           });
// // // //         }

// // // //         if (turn.end_of_turn && turn.transcript) {
// // // //           this.logger.log(`✅ Final transcript (${client.id}): "${turn.transcript}"`);
// // // //           this.logger.log(`   Confidence: ${turn.confidence}`);
          
// // // //           client.emit('final-transcript', {
// // // //             text: turn.transcript,
// // // //             confidence: turn.confidence,
// // // //           });
          
// // // //           client.emit('status', { 
// // // //             type: 'transcript_complete', 
// // // //             message: 'Transcription complete' 
// // // //           });
// // // //         }
// // // //       });

// // // //       rt.on('error', (err) => {
// // // //         this.logger.error(`❌ AssemblyAI error for ${client.id}:`, err);
// // // //         client.emit('error', { 
// // // //           type: 'transcription_error',
// // // //           reason: err.message || 'AssemblyAI session error' 
// // // //         });
// // // //       });

// // // //       rt.on('close', (code, reason) => {
// // // //         this.logger.log(`🔒 AssemblyAI closed for ${client.id}. Code: ${code}, Reason: ${reason}`);
// // // //         client.emit('session-ended');
// // // //         client.emit('status', { 
// // // //           type: 'disconnected', 
// // // //           message: 'Transcription session ended' 
// // // //         });
// // // //       });

// // // //       this.logger.log(`📡 Connecting to AssemblyAI for ${client.id}...`);
// // // //       await rt.connect();
// // // //       this.logger.log(`✅ Connected to AssemblyAI for ${client.id}`);
      
// // // //     } catch (error) {
// // // //       this.logger.error(`❌ Failed to start transcription for ${client.id}:`, error);
// // // //       client.emit('error', { 
// // // //         type: 'initialization_error',
// // // //         reason: error.message || 'Failed to initialize transcription' 
// // // //       });
// // // //     }
// // // //   }

// // // //   @SubscribeMessage('audio_chunk')
// // // //   async handleAudioChunk(
// // // //     @ConnectedSocket() client: Socket,
// // // //     @MessageBody() data: { chunk: string },
// // // //   ) {
// // // //     const rt = this.clientMap.get(client.id);
// // // //     if (!rt) {
// // // //       this.logger.warn(`⚠️ No transcriber found for client: ${client.id}`);
// // // //       return;
// // // //     }

// // // //     try {
// // // //       // Decode base64 to buffer
// // // //       const audioBuffer = Buffer.from(data.chunk, 'base64');
      
// // // //       // Update chunk counter
// // // //       const count = (this.chunkCounters.get(client.id) || 0) + 1;
// // // //       this.chunkCounters.set(client.id, count);
      
// // // //       // Log every 50 chunks
// // // //       if (count % 50 === 0) {
// // // //         this.logger.log(`🎵 Received ${count} audio chunks from ${client.id} (${audioBuffer.length} bytes each)`);
// // // //       }
      
// // // //       // Log first chunk to verify audio is being received
// // // //       if (count === 1) {
// // // //         this.logger.log(`🎵 First audio chunk received from ${client.id}: ${audioBuffer.length} bytes`);
// // // //         this.logger.log(`   Base64 length: ${data.chunk.length}`);
// // // //       }

// // // //       // Send to AssemblyAI
// // // //       rt.sendAudio(audioBuffer as any);
      
// // // //     } catch (err) {
// // // //       this.logger.error(`⚠️ Failed to process audio chunk for ${client.id}:`, err);
// // // //       client.emit('error', { 
// // // //         type: 'audio_send_error',
// // // //         reason: 'Failed to process audio chunk' 
// // // //       });
// // // //     }
// // // //   }

// // // //   @SubscribeMessage('end_stream')
// // // //   async handleEndStream(@ConnectedSocket() client: Socket) {
// // // //     this.logger.log(`🔚 End of stream signal received from ${client.id}`);
    
// // // //     const rt = this.clientMap.get(client.id);
// // // //     if (rt) {
// // // //       try {
// // // //         // Force flush any remaining audio
// // // //         await rt.close();
// // // //         this.logger.log(`✅ Stream ended and transcriber closed for ${client.id}`);
// // // //       } catch (err) {
// // // //         this.logger.error('Error ending stream:', err);
// // // //       }
// // // //     }
    
// // // //     const totalChunks = this.chunkCounters.get(client.id) || 0;
// // // //     this.logger.log(`📊 Total chunks processed: ${totalChunks}`);
// // // //   }

// // // //   @SubscribeMessage('stop-transcription')
// // // //   async handleStopTranscription(@ConnectedSocket() client: Socket) {
// // // //     this.logger.log(`🛑 Stop transcription requested for ${client.id}`);
    
// // // //     const rt = this.clientMap.get(client.id);
// // // //     if (rt) {
// // // //       try {
// // // //         await rt.close();
// // // //         this.logger.log(`✅ Transcriber stopped for ${client.id}`);
// // // //       } catch (err) {
// // // //         this.logger.error('Error stopping transcriber:', err);
// // // //       }
// // // //       this.clientMap.delete(client.id);
// // // //     }
    
// // // //     const totalChunks = this.chunkCounters.get(client.id) || 0;
// // // //     this.logger.log(`📊 Session ended. Total chunks: ${totalChunks}`);
// // // //     this.chunkCounters.delete(client.id);
    
// // // //     client.emit('session-ended');
// // // //     client.emit('status', { 
// // // //       type: 'stopped', 
// // // //       message: 'Transcription stopped' 
// // // //     });
// // // //   }
// // // // }
// // // import {
// // //   WebSocketGateway,
// // //   WebSocketServer,
// // //   SubscribeMessage,
// // //   OnGatewayConnection,
// // //   OnGatewayDisconnect,
// // //   ConnectedSocket,
// // //   MessageBody,
// // // } from '@nestjs/websockets';
// // // import { Server, Socket } from 'socket.io';
// // // import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
// // // import { ChatGpt } from './ChtGPT.servcie';
// // // import { Logger } from '@nestjs/common';

// // // @WebSocketGateway({ 
// // //   cors: {
// // //     origin: '*', // Update this to your frontend URL in production
// // //     credentials: true,
// // //   }
// // // })
// // // export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
// // //   private readonly logger = new Logger(AudioGateway.name);
  
// // //   constructor(private readonly ChatGpt: ChatGpt) {}

// // //   @WebSocketServer()
// // //   server: Server;

// // //   private clientMap = new Map<string, RealtimeTranscriber>();
// // //   private chunkCounters = new Map<string, number>();

// // //   async handleConnection(client: Socket) {
// // //     this.logger.log(`🔗 Client connected: ${client.id}`);
// // //     this.chunkCounters.set(client.id, 0);
    
// // //     client.emit('status', { 
// // //       type: 'connected', 
// // //       message: 'Connected to transcription server' 
// // //     });
// // //   }

// // //   async handleDisconnect(client: Socket) {
// // //     this.logger.log(`🔌 Client disconnected: ${client.id}`);
    
// // //     const rt = this.clientMap.get(client.id);
// // //     if (rt) {
// // //       try {
// // //         this.logger.log(`🧹 Closing transcriber for ${client.id}...`);
// // //         await rt.close(false); // Don't wait for final transcript
// // //         this.logger.log(`✅ Transcriber closed for ${client.id}`);
// // //       } catch (err) {
// // //         this.logger.error(`Error closing transcriber for ${client.id}:`, err);
// // //       }
// // //       this.clientMap.delete(client.id);
// // //     }
    
// // //     this.chunkCounters.delete(client.id);
// // //   }

// // //   @SubscribeMessage('start-transcription')
// // //   async handleStartTranscription(@ConnectedSocket() client: Socket) {
// // //     this.logger.log(`🎙️ Starting transcription for client: ${client.id}`);

// // //     // Clean up any existing transcriber for this client
// // //     const existingRt = this.clientMap.get(client.id);
// // //     if (existingRt) {
// // //       this.logger.warn(`⚠️ Transcriber already exists for ${client.id}, closing it...`);
// // //       try {
// // //         await existingRt.close(false);
// // //       } catch (err) {
// // //         this.logger.error('Error closing existing transcriber:', err);
// // //       }
// // //       this.clientMap.delete(client.id);
// // //     }

// // //     try {
// // //       const apiKey = process.env.ASSEMBLY_AI_API_KEY || '92d0012217dc4ecdb5db890545addfa0';
// // //       this.logger.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
      
// // //       const aai = new AssemblyAI({ apiKey });

// // //       const rt = aai.streaming.transcriber({
// // //         sampleRate: 16000,
// // //         encoding: 'pcm_s16le', // 16-bit PCM little-endian
// // //         minEndOfTurnSilenceWhenConfident: 1000, // Increased to 1 second
// // //         // Remove language_code to use English by default
// // //         // Or specify: language_code: 'ar' for Arabic
// // //       }) as any;

// // //       this.clientMap.set(client.id, rt);
// // //       this.logger.log(`✅ Transcriber created and stored for ${client.id}`);

// // //       rt.on('open', ({ id, expires_at }) => {
// // //         this.logger.log(`✅ AssemblyAI session opened for ${client.id}`);
// // //         this.logger.log(`   Session ID: ${id}`);
// // //         this.logger.log(`   Expires at: ${expires_at}`);
        
// // //         client.emit('transcription-ready', {
// // //           sessionId: id,
// // //           expiresAt: expires_at,
// // //         });
        
// // //         client.emit('status', { 
// // //           type: 'recognition_started', 
// // //           message: 'Recognition started - speak now' 
// // //         });
// // //       });

// // //       rt.on('turn', (turn) => {
// // //         if (!turn) {
// // //           this.logger.warn(`⚠️ Received empty turn for ${client.id}`);
// // //           return;
// // //         }

// // //         // Log ALL turn data for debugging
// // //         this.logger.log(`🔄 Turn event for ${client.id}:`, JSON.stringify({
// // //           hasTranscript: !!turn.transcript,
// // //           transcriptLength: turn.transcript?.length,
// // //           transcriptPreview: turn.transcript?.substring(0, 100),
// // //           endOfTurn: turn.end_of_turn,
// // //           confidence: turn.confidence,
// // //         }));

// // //         if (turn.transcript && !turn.end_of_turn) {
// // //           this.logger.log(`📝 Partial transcript (${client.id}): "${turn.transcript}"`);
// // //           client.emit('partial-transcript', turn.transcript);
          
// // //           client.emit('status', { 
// // //             type: 'partial_received', 
// // //             message: 'Processing speech...' 
// // //           });
// // //         }

// // //         if (turn.end_of_turn && turn.transcript) {
// // //           this.logger.log(`✅ Final transcript (${client.id}): "${turn.transcript}"`);
// // //           this.logger.log(`   Confidence: ${turn.confidence}`);
          
// // //           client.emit('final-transcript', {
// // //             text: turn.transcript,
// // //             confidence: turn.confidence,
// // //           });
          
// // //           client.emit('status', { 
// // //             type: 'transcript_complete', 
// // //             message: 'Transcription complete' 
// // //           });
// // //         }
        
// // //         // Log if we got a turn but no transcript
// // //         if (!turn.transcript && turn.end_of_turn) {
// // //           this.logger.warn(`⚠️ Turn ended without transcript for ${client.id}`);
// // //         }
// // //       });

// // //       rt.on('error', (err) => {
// // //         this.logger.error(`❌ AssemblyAI error for ${client.id}:`, err);
// // //         client.emit('error', { 
// // //           type: 'transcription_error',
// // //           reason: err.message || 'AssemblyAI session error' 
// // //         });
// // //       });

// // //       rt.on('close', (code, reason) => {
// // //         this.logger.log(`🔒 AssemblyAI closed for ${client.id}. Code: ${code}, Reason: ${reason}`);
// // //         client.emit('session-ended');
// // //         client.emit('status', { 
// // //           type: 'disconnected', 
// // //           message: 'Transcription session ended' 
// // //         });
// // //       });

// // //       this.logger.log(`📡 Connecting to AssemblyAI for ${client.id}...`);
// // //       await rt.connect();
// // //       this.logger.log(`✅ Connected to AssemblyAI for ${client.id}`);
      
// // //     } catch (error) {
// // //       this.logger.error(`❌ Failed to start transcription for ${client.id}:`, error);
// // //       client.emit('error', { 
// // //         type: 'initialization_error',
// // //         reason: error.message || 'Failed to initialize transcription' 
// // //       });
// // //     }
// // //   }

// // //   @SubscribeMessage('audio_chunk')
// // //   async handleAudioChunk(
// // //     @ConnectedSocket() client: Socket,
// // //     @MessageBody() data: { chunk: string },
// // //   ) {
// // //     const rt = this.clientMap.get(client.id);
// // //     if (!rt) {
// // //       // Only warn occasionally to avoid log spam
// // //       const count = this.chunkCounters.get(client.id) || 0;
// // //       if (count % 100 === 0) {
// // //         this.logger.warn(`⚠️ No transcriber found for client: ${client.id}`);
// // //         this.logger.warn(`   Available clients: ${Array.from(this.clientMap.keys()).join(', ')}`);
// // //       }
// // //       return;
// // //     }

// // //     try {
// // //       // Decode base64 to buffer (Int16 PCM audio)
// // //       const audioBuffer = Buffer.from(data.chunk, 'base64');
      
// // //       // Update chunk counter
// // //       const count = (this.chunkCounters.get(client.id) || 0) + 1;
// // //       this.chunkCounters.set(client.id, count);
      
// // //       // Log every 50 chunks
// // //       if (count % 50 === 0) {
// // //         this.logger.log(`🎵 Received ${count} audio chunks from ${client.id} (${audioBuffer.length} bytes each)`);
// // //       }
      
// // //       // Log first chunk with detailed info
// // //       if (count === 1) {
// // //         this.logger.log(`🎵 First audio chunk received from ${client.id}:`);
// // //         this.logger.log(`   Buffer size: ${audioBuffer.length} bytes`);
// // //         this.logger.log(`   Base64 length: ${data.chunk.length} chars`);
// // //         this.logger.log(`   Expected: Int16 PCM audio at 16kHz`);
        
// // //         // Check audio level
// // //         const int16View = new Int16Array(audioBuffer.buffer, audioBuffer.byteOffset, audioBuffer.length / 2);
// // //         const maxAmplitude = Math.max(...Array.from(int16View).map(Math.abs));
// // //         const normalized = maxAmplitude / 32768;
// // //         this.logger.log(`   Max amplitude: ${normalized.toFixed(4)} (should be > 0.01)`);
        
// // //         if (normalized < 0.001) {
// // //           this.logger.warn(`   ⚠️ Audio level very low - check microphone!`);
// // //         }
// // //       }

// // //       // Send to AssemblyAI
// // //       rt.sendAudio(audioBuffer as any);
      
// // //     } catch (err) {
// // //       this.logger.error(`⚠️ Failed to process audio chunk for ${client.id}:`, err);
// // //       client.emit('error', { 
// // //         type: 'audio_send_error',
// // //         reason: 'Failed to process audio chunk' 
// // //       });
// // //     }
// // //   }

// // //   @SubscribeMessage('end_stream')
// // //   async handleEndStream(@ConnectedSocket() client: Socket) {
// // //     this.logger.log(`🔚 End of stream signal received from ${client.id}`);
    
// // //     const rt = this.clientMap.get(client.id);
// // //     if (rt) {
// // //       try {
// // //         // Force flush any remaining audio
// // //         await rt.close();
// // //         this.logger.log(`✅ Stream ended and transcriber closed for ${client.id}`);
// // //       } catch (err) {
// // //         this.logger.error('Error ending stream:', err);
// // //       }
// // //     }
    
// // //     const totalChunks = this.chunkCounters.get(client.id) || 0;
// // //     this.logger.log(`📊 Total chunks processed: ${totalChunks}`);
// // //   }

// // //   @SubscribeMessage('stop-transcription')
// // //   async handleStopTranscription(@ConnectedSocket() client: Socket) {
// // //     this.logger.log(`🛑 Stop transcription requested for ${client.id}`);
    
// // //     const rt = this.clientMap.get(client.id);
// // //     if (rt) {
// // //       try {
// // //         this.logger.log(`🧹 Closing transcriber for ${client.id}...`);
// // //         await rt.close(false); // Don't wait for final transcript
// // //         this.logger.log(`✅ Transcriber stopped for ${client.id}`);
// // //       } catch (err) {
// // //         this.logger.error(`Error stopping transcriber for ${client.id}:`, err);
// // //       }
// // //       this.clientMap.delete(client.id);
// // //     } else {
// // //       this.logger.warn(`⚠️ No transcriber found for ${client.id}`);
// // //     }
    
// // //     const totalChunks = this.chunkCounters.get(client.id) || 0;
// // //     this.logger.log(`📊 Session ended. Total chunks: ${totalChunks}`);
// // //     this.chunkCounters.delete(client.id);
    
// // //     client.emit('session-ended');
// // //     client.emit('status', { 
// // //       type: 'stopped', 
// // //       message: 'Transcription stopped' 
// // //     });
// // //   }
// // // }
// // import {
// //   WebSocketGateway,
// //   WebSocketServer,
// //   SubscribeMessage,
// //   OnGatewayConnection,
// //   OnGatewayDisconnect,
// //   ConnectedSocket,
// //   MessageBody,
// // } from '@nestjs/websockets';
// // import { Server, Socket } from 'socket.io';
// // import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
// // import { ChatGpt } from './ChtGPT.servcie';
// // import { Logger } from '@nestjs/common';

// // @WebSocketGateway({ 
// //   cors: {
// //     origin: '*', // Update this to your frontend URL in production
// //     credentials: true,
// //   }
// // })
// // export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
// //   private readonly logger = new Logger(AudioGateway.name);
  
// //   constructor(private readonly ChatGpt: ChatGpt) {}

// //   @WebSocketServer()
// //   server: Server;

// //   private clientMap = new Map<string, RealtimeTranscriber>();
// //   private chunkCounters = new Map<string, number>();

// //   async handleConnection(client: Socket) {
// //     this.logger.log(`🔗 Client connected: ${client.id}`);
// //     this.chunkCounters.set(client.id, 0);
    
// //     client.emit('status', { 
// //       type: 'connected', 
// //       message: 'Connected to transcription server' 
// //     });
// //   }

// //   async handleDisconnect(client: Socket) {
// //     this.logger.log(`🔌 Client disconnected: ${client.id}`);
    
// //     const rt = this.clientMap.get(client.id);
// //     if (rt) {
// //       try {
// //         this.logger.log(`🧹 Closing transcriber for ${client.id}...`);
// //         await rt.close(false); // Don't wait for final transcript
// //         this.logger.log(`✅ Transcriber closed for ${client.id}`);
// //       } catch (err) {
// //         this.logger.error(`Error closing transcriber for ${client.id}:`, err);
// //       }
// //       this.clientMap.delete(client.id);
// //     }
    
// //     this.chunkCounters.delete(client.id);
// //   }

// //   @SubscribeMessage('start-transcription')
// //   async handleStartTranscription(@ConnectedSocket() client: Socket) {
// //     this.logger.log(`🎙️ Starting transcription for client: ${client.id}`);

// //     // Clean up any existing transcriber for this client
// //     const existingRt = this.clientMap.get(client.id);
// //     if (existingRt) {
// //       this.logger.warn(`⚠️ Transcriber already exists for ${client.id}, closing it...`);
// //       try {
// //         await existingRt.close(false);
// //       } catch (err) {
// //         this.logger.error('Error closing existing transcriber:', err);
// //       }
// //       this.clientMap.delete(client.id);
// //     }

// //     try {
// //       const apiKey = process.env.ASSEMBLY_AI_API_KEY || '92d0012217dc4ecdb5db890545addfa0';
// //       this.logger.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
      
// //       const aai = new AssemblyAI({ apiKey });

// //       const rt = aai.streaming.transcriber({
// //         sampleRate: 16000,
// //         minEndOfTurnSilenceWhenConfident: 500,
// //         // DON'T specify encoding - let AssemblyAI auto-detect
// //       }) as any;

// //       this.clientMap.set(client.id, rt);
// //       this.logger.log(`✅ Transcriber created and stored for ${client.id}`);

// //       rt.on('open', ({ id, expires_at }) => {
// //         this.logger.log(`✅ AssemblyAI session opened for ${client.id}`);
// //         this.logger.log(`   Session ID: ${id}`);
// //         this.logger.log(`   Expires at: ${expires_at}`);
// //         this.logger.log(`   ⚠️ READY TO RECEIVE AUDIO - Speak now!`);
        
// //         client.emit('transcription-ready', {
// //           sessionId: id,
// //           expiresAt: expires_at,
// //         });
        
// //         client.emit('status', { 
// //           type: 'recognition_started', 
// //           message: 'Recognition started - speak now' 
// //         });
// //       });

// //       // Listen to ALL possible events for debugging
// //       rt.on('transcript', (transcript) => {
// //         this.logger.log(`📄 Transcript event for ${client.id}:`, transcript);
// //       });

// //       rt.on('transcript.partial', (transcript) => {
// //         this.logger.log(`📝 Partial transcript event for ${client.id}:`, transcript);
// //       });

// //       rt.on('transcript.final', (transcript) => {
// //         this.logger.log(`✅ Final transcript event for ${client.id}:`, transcript);
// //       });

// //       rt.on('turn', (turn) => {
// //         this.logger.log(`🔄 Turn event received for ${client.id}:`, turn); // Log FULL turn object
        
// //         if (!turn) {
// //           this.logger.warn(`⚠️ Received empty turn for ${client.id}`);
// //           return;
// //         }

// //         // Log ALL turn data for debugging
// //         this.logger.log(`🔄 Turn details:`, {
// //           hasTranscript: !!turn.transcript,
// //           transcriptLength: turn.transcript?.length,
// //           transcriptText: turn.transcript,
// //           endOfTurn: turn.end_of_turn,
// //           confidence: turn.confidence,
// //         });

// //         if (turn.transcript && !turn.end_of_turn) {
// //           this.logger.log(`📝 Partial transcript (${client.id}): "${turn.transcript}"`);
// //           client.emit('partial-transcript', turn.transcript);
          
// //           client.emit('status', { 
// //             type: 'partial_received', 
// //             message: 'Processing speech...' 
// //           });
// //         }

// //         if (turn.end_of_turn && turn.transcript) {
// //           this.logger.log(`✅ Final transcript (${client.id}): "${turn.transcript}"`);
// //           this.logger.log(`   Confidence: ${turn.confidence}`);
          
// //           client.emit('final-transcript', {
// //             text: turn.transcript,
// //             confidence: turn.confidence,
// //           });
          
// //           client.emit('status', { 
// //             type: 'transcript_complete', 
// //             message: 'Transcription complete' 
// //           });
// //         }
        
// //         // Log if we got a turn but no transcript
// //         if (!turn.transcript && turn.end_of_turn) {
// //           this.logger.warn(`⚠️ Turn ended without transcript for ${client.id}`);
// //         }
// //       });

// //       rt.on('error', (err) => {
// //         this.logger.error(`❌ AssemblyAI error for ${client.id}:`, err);
// //         client.emit('error', { 
// //           type: 'transcription_error',
// //           reason: err.message || 'AssemblyAI session error' 
// //         });
// //       });

// //       rt.on('close', (code, reason) => {
// //         this.logger.log(`🔒 AssemblyAI closed for ${client.id}. Code: ${code}, Reason: ${reason}`);
// //         client.emit('session-ended');
// //         client.emit('status', { 
// //           type: 'disconnected', 
// //           message: 'Transcription session ended' 
// //         });
// //       });

// //       this.logger.log(`📡 Connecting to AssemblyAI for ${client.id}...`);
// //       await rt.connect();
// //       this.logger.log(`✅ Connected to AssemblyAI for ${client.id}`);
      
// //     } catch (error) {
// //       this.logger.error(`❌ Failed to start transcription for ${client.id}:`, error);
// //       client.emit('error', { 
// //         type: 'initialization_error',
// //         reason: error.message || 'Failed to initialize transcription' 
// //       });
// //     }
// //   }

// //   @SubscribeMessage('audio_chunk')
// //   async handleAudioChunk(
// //     @ConnectedSocket() client: Socket,
// //     @MessageBody() data: { chunk: string },
// //   ) {
// //     const rt = this.clientMap.get(client.id);
// //     if (!rt) {
// //       // Only warn occasionally to avoid log spam
// //       const count = this.chunkCounters.get(client.id) || 0;
// //       if (count % 100 === 0) {
// //         this.logger.warn(`⚠️ No transcriber found for client: ${client.id}`);
// //         this.logger.warn(`   Available clients: ${Array.from(this.clientMap.keys()).join(', ')}`);
// //       }
// //       return;
// //     }

// //     try {
// //       // Decode base64 to buffer (Int16 PCM audio)
// //       const audioBuffer = Buffer.from(data.chunk, 'base64');
      
// //       // Update chunk counter
// //       const count = (this.chunkCounters.get(client.id) || 0) + 1;
// //       this.chunkCounters.set(client.id, count);
      
// //       // Log every 50 chunks
// //       if (count % 50 === 0) {
// //         this.logger.log(`🎵 Received ${count} audio chunks from ${client.id} (${audioBuffer.length} bytes each)`);
// //       }
      
// //       // Log first chunk with detailed info
// //       if (count === 1) {
// //         this.logger.log(`🎵 First audio chunk received from ${client.id}:`);
// //         this.logger.log(`   Buffer size: ${audioBuffer.length} bytes`);
// //         this.logger.log(`   Base64 length: ${data.chunk.length} chars`);
// //         this.logger.log(`   Expected: Int16 PCM audio at 16kHz`);
        
// //         // Check audio level
// //         const int16View = new Int16Array(audioBuffer.buffer, audioBuffer.byteOffset, audioBuffer.length / 2);
// //         const maxAmplitude = Math.max(...Array.from(int16View).map(Math.abs));
// //         const normalized = maxAmplitude / 32768;
// //         this.logger.log(`   Max amplitude: ${normalized.toFixed(4)} (should be > 0.01)`);
        
// //         if (normalized < 0.001) {
// //           this.logger.warn(`   ⚠️ Audio level very low - check microphone!`);
// //         }
// //       }

// //       // Send to AssemblyAI
// //       rt.sendAudio(audioBuffer as any);
      
// //     } catch (err) {
// //       this.logger.error(`⚠️ Failed to process audio chunk for ${client.id}:`, err);
// //       client.emit('error', { 
// //         type: 'audio_send_error',
// //         reason: 'Failed to process audio chunk' 
// //       });
// //     }
// //   }

// //   @SubscribeMessage('end_stream')
// //   async handleEndStream(@ConnectedSocket() client: Socket) {
// //     this.logger.log(`🔚 End of stream signal received from ${client.id}`);
    
// //     const rt = this.clientMap.get(client.id);
// //     if (rt) {
// //       try {
// //         // Force flush any remaining audio
// //         await rt.close();
// //         this.logger.log(`✅ Stream ended and transcriber closed for ${client.id}`);
// //       } catch (err) {
// //         this.logger.error('Error ending stream:', err);
// //       }
// //     }
    
// //     const totalChunks = this.chunkCounters.get(client.id) || 0;
// //     this.logger.log(`📊 Total chunks processed: ${totalChunks}`);
// //   }

// //   @SubscribeMessage('stop-transcription')
// //   async handleStopTranscription(@ConnectedSocket() client: Socket) {
// //     this.logger.log(`🛑 Stop transcription requested for ${client.id}`);
    
// //     const rt = this.clientMap.get(client.id);
// //     if (rt) {
// //       try {
// //         this.logger.log(`🧹 Closing transcriber for ${client.id}...`);
// //         await rt.close(false); // Don't wait for final transcript
// //         this.logger.log(`✅ Transcriber stopped for ${client.id}`);
// //       } catch (err) {
// //         this.logger.error(`Error stopping transcriber for ${client.id}:`, err);
// //       }
// //       this.clientMap.delete(client.id);
// //     } else {
// //       this.logger.warn(`⚠️ No transcriber found for ${client.id}`);
// //     }
    
// //     const totalChunks = this.chunkCounters.get(client.id) || 0;
// //     this.logger.log(`📊 Session ended. Total chunks: ${totalChunks}`);
// //     this.chunkCounters.delete(client.id);
    
// //     client.emit('session-ended');
// //     client.emit('status', { 
// //       type: 'stopped', 
// //       message: 'Transcription stopped' 
// //     });
// //   }
// // }
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   SubscribeMessage,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
//   ConnectedSocket,
//   MessageBody,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
// import { ChatGpt } from './ChtGPT.servcie';
// import { Logger } from '@nestjs/common';

// @WebSocketGateway({ 
//   cors: {
//     origin: '*', // Update this to your frontend URL in production
//     credentials: true,
//   }
// })
// export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   private readonly logger = new Logger(AudioGateway.name);
  
//   constructor(private readonly ChatGpt: ChatGpt) {}

//   @WebSocketServer()
//   server: Server;

//   private clientMap = new Map<string, RealtimeTranscriber>();
//   private chunkCounters = new Map<string, number>();

//   async handleConnection(client: Socket) {
//     this.logger.log(`🔗 Client connected: ${client.id}`);
//     this.chunkCounters.set(client.id, 0);
    
//     client.emit('status', { 
//       type: 'connected', 
//       message: 'Connected to transcription server' 
//     });
//   }

//   async handleDisconnect(client: Socket) {
//     this.logger.log(`🔌 Client disconnected: ${client.id}`);
    
//     const rt = this.clientMap.get(client.id);
//     if (rt) {
//       try {
//         this.logger.log(`🧹 Closing transcriber for ${client.id}...`);
//         await rt.close(false); // Don't wait for final transcript
//         this.logger.log(`✅ Transcriber closed for ${client.id}`);
//       } catch (err) {
//         this.logger.error(`Error closing transcriber for ${client.id}:`, err);
//       }
//       this.clientMap.delete(client.id);
//     }
    
//     this.chunkCounters.delete(client.id);
//   }

//   @SubscribeMessage('start-transcription')
//   async handleStartTranscription(@ConnectedSocket() client: Socket) {
//     this.logger.log(`🎙️ Starting transcription for client: ${client.id}`);

//     // Clean up any existing transcriber for this client
//     const existingRt = this.clientMap.get(client.id);
//     if (existingRt) {
//       this.logger.warn(`⚠️ Transcriber already exists for ${client.id}, closing it...`);
//       try {
//         await existingRt.close(false);
//       } catch (err) {
//         this.logger.error('Error closing existing transcriber:', err);
//       }
//       this.clientMap.delete(client.id);
//     }

//     try {
//       const apiKey = process.env.ASSEMBLY_AI_API_KEY || '92d0012217dc4ecdb5db890545addfa0';
//       this.logger.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
      
//       const aai = new AssemblyAI({ apiKey });

//       const rt = aai.streaming.transcriber({
//         sampleRate: 16000,
//         minEndOfTurnSilenceWhenConfident: 500,
//         // DON'T specify encoding - let AssemblyAI auto-detect
//       }) as any;

//       this.clientMap.set(client.id, rt);
//       this.logger.log(`✅ Transcriber created and stored for ${client.id}`);

//       rt.on('open', ({ id, expires_at }) => {
//         this.logger.log(`✅ AssemblyAI session opened for ${client.id}`);
//         this.logger.log(`   Session ID: ${id}`);
//         this.logger.log(`   Expires at: ${expires_at}`);
//         this.logger.log(`   ⚠️ READY TO RECEIVE AUDIO - Speak now!`);
        
//         client.emit('transcription-ready', {
//           sessionId: id,
//           expiresAt: expires_at,
//         });
        
//         client.emit('status', { 
//           type: 'recognition_started', 
//           message: 'Recognition started - speak now' 
//         });
//       });

//       // Listen to ALL possible events for debugging
//       rt.on('transcript', (transcript) => {
//         this.logger.log(`📄 Transcript event for ${client.id}:`, transcript);
//       });

//       rt.on('transcript.partial', (transcript) => {
//         this.logger.log(`📝 Partial transcript event for ${client.id}:`, transcript);
//       });

//       rt.on('transcript.final', (transcript) => {
//         this.logger.log(`✅ Final transcript event for ${client.id}:`, transcript);
//       });

//       rt.on('turn', (turn) => {
//         this.logger.log(`🔄 Turn event received for ${client.id}:`, turn); // Log FULL turn object
        
//         if (!turn) {
//           this.logger.warn(`⚠️ Received empty turn for ${client.id}`);
//           return;
//         }

//         // Log ALL turn data for debugging
//         this.logger.log(`🔄 Turn details:`, {
//           hasTranscript: !!turn.transcript,
//           transcriptLength: turn.transcript?.length,
//           transcriptText: turn.transcript,
//           endOfTurn: turn.end_of_turn,
//           confidence: turn.confidence,
//         });

//         if (turn.transcript && !turn.end_of_turn) {
//           this.logger.log(`📝 Partial transcript (${client.id}): "${turn.transcript}"`);
//           client.emit('partial-transcript', turn.transcript);
          
//           client.emit('status', { 
//             type: 'partial_received', 
//             message: 'Processing speech...' 
//           });
//         }

//         if (turn.end_of_turn && turn.transcript) {
//           this.logger.log(`✅ Final transcript (${client.id}): "${turn.transcript}"`);
//           this.logger.log(`   Confidence: ${turn.confidence}`);
          
//           client.emit('final-transcript', {
//             text: turn.transcript,
//             confidence: turn.confidence,
//           });
          
//           client.emit('status', { 
//             type: 'transcript_complete', 
//             message: 'Transcription complete' 
//           });
//         }
        
//         // Log if we got a turn but no transcript
//         if (!turn.transcript && turn.end_of_turn) {
//           this.logger.warn(`⚠️ Turn ended without transcript for ${client.id}`);
//         }
//       });

//       rt.on('error', (err) => {
//         this.logger.error(`❌ AssemblyAI error for ${client.id}:`, err);
//         client.emit('error', { 
//           type: 'transcription_error',
//           reason: err.message || 'AssemblyAI session error' 
//         });
//       });

//       rt.on('close', (code, reason) => {
//         this.logger.log(`🔒 AssemblyAI closed for ${client.id}. Code: ${code}, Reason: ${reason}`);
//         client.emit('session-ended');
//         client.emit('status', { 
//           type: 'disconnected', 
//           message: 'Transcription session ended' 
//         });
//       });

//       this.logger.log(`📡 Connecting to AssemblyAI for ${client.id}...`);
//       await rt.connect();
//       this.logger.log(`✅ Connected to AssemblyAI for ${client.id}`);
      
//     } catch (error) {
//       this.logger.error(`❌ Failed to start transcription for ${client.id}:`, error);
//       client.emit('error', { 
//         type: 'initialization_error',
//         reason: error.message || 'Failed to initialize transcription' 
//       });
//     }
//   }

//   @SubscribeMessage('audio_chunk')
//   async handleAudioChunk(
//     @ConnectedSocket() client: Socket,
//     @MessageBody() data: { chunk: string },
//   ) {
//     const rt = this.clientMap.get(client.id);
//     if (!rt) {
//       // Only warn occasionally to avoid log spam
//       const count = this.chunkCounters.get(client.id) || 0;
//       if (count % 100 === 0) {
//         this.logger.warn(`⚠️ No transcriber found for client: ${client.id}`);
//         this.logger.warn(`   Available clients: ${Array.from(this.clientMap.keys()).join(', ')}`);
//       }
//       return;
//     }

//     try {
//       // Decode base64 to buffer (Float32 audio from frontend)
//       const audioBuffer = Buffer.from(data.chunk, 'base64');
      
//       // Convert Float32 to Int16 PCM for AssemblyAI
//       const float32Array = new Float32Array(
//         audioBuffer.buffer,
//         audioBuffer.byteOffset,
//         audioBuffer.length / 4
//       );
      
//       const int16Array = new Int16Array(float32Array.length);
//       for (let i = 0; i < float32Array.length; i++) {
//         const s = Math.max(-1, Math.min(1, float32Array[i]));
//         int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
//       }
      
//       const pcmBuffer = Buffer.from(int16Array.buffer);
      
//       // Update chunk counter
//       const count = (this.chunkCounters.get(client.id) || 0) + 1;
//       this.chunkCounters.set(client.id, count);
      
//       // Log every 50 chunks
//       if (count % 50 === 0) {
//         this.logger.log(`🎵 Received ${count} audio chunks from ${client.id} (${pcmBuffer.length} bytes PCM)`);
//       }
      
//       // Log first chunk with detailed info
//       if (count === 1) {
//         this.logger.log(`🎵 First audio chunk received from ${client.id}:`);
//         this.logger.log(`   Original buffer size: ${audioBuffer.length} bytes (Float32)`);
//         this.logger.log(`   Converted buffer size: ${pcmBuffer.length} bytes (Int16 PCM)`);
//         this.logger.log(`   Sample count: ${float32Array.length}`);
        
//         // Check audio level
//         const maxAmplitude = Math.max(...Array.from(float32Array).map(Math.abs));
//         this.logger.log(`   Max amplitude: ${maxAmplitude.toFixed(4)} (should be > 0.01)`);
        
//         if (maxAmplitude < 0.001) {
//           this.logger.warn(`   ⚠️ Audio level very low - check microphone!`);
//         }
//       }

//       // Send PCM audio to AssemblyAI
//       rt.sendAudio(pcmBuffer as any);
      
//     } catch (err) {
//       this.logger.error(`⚠️ Failed to process audio chunk for ${client.id}:`, err);
//       client.emit('error', { 
//         type: 'audio_send_error',
//         reason: 'Failed to process audio chunk' 
//       });
//     }
//   }

//   @SubscribeMessage('end_stream')
//   async handleEndStream(@ConnectedSocket() client: Socket) {
//     this.logger.log(`🔚 End of stream signal received from ${client.id}`);
    
//     const rt = this.clientMap.get(client.id);
//     if (rt) {
//       try {
//         // Force flush any remaining audio
//         await rt.close();
//         this.logger.log(`✅ Stream ended and transcriber closed for ${client.id}`);
//       } catch (err) {
//         this.logger.error('Error ending stream:', err);
//       }
//     }
    
//     const totalChunks = this.chunkCounters.get(client.id) || 0;
//     this.logger.log(`📊 Total chunks processed: ${totalChunks}`);
//   }

//   @SubscribeMessage('stop-transcription')
//   async handleStopTranscription(@ConnectedSocket() client: Socket) {
//     this.logger.log(`🛑 Stop transcription requested for ${client.id}`);
    
//     const rt = this.clientMap.get(client.id);
//     if (rt) {
//       try {
//         this.logger.log(`🧹 Closing transcriber for ${client.id}...`);
//         await rt.close(false); // Don't wait for final transcript
//         this.logger.log(`✅ Transcriber stopped for ${client.id}`);
//       } catch (err) {
//         this.logger.error(`Error stopping transcriber for ${client.id}:`, err);
//       }
//       this.clientMap.delete(client.id);
//     } else {
//       this.logger.warn(`⚠️ No transcriber found for ${client.id}`);
//     }
    
//     const totalChunks = this.chunkCounters.get(client.id) || 0;
//     this.logger.log(`📊 Session ended. Total chunks: ${totalChunks}`);
//     this.chunkCounters.delete(client.id);
    
//     client.emit('session-ended');
//     client.emit('status', { 
//       type: 'stopped', 
//       message: 'Transcription stopped' 
//     });
//   }
// }
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AssemblyAI, RealtimeTranscriber } from 'assemblyai';
import { ChatGpt } from './ChtGPT.servcie';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ 
  cors: {
    origin: '*', // Update this to your frontend URL in production
    credentials: true,
  }
})
export class AudioGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(AudioGateway.name);
  
  constructor(private readonly ChatGpt: ChatGpt) {}

  @WebSocketServer()
  server: Server;

  private clientMap = new Map<string, RealtimeTranscriber>();
  private chunkCounters = new Map<string, number>();
  private connectionReady = new Map<string, boolean>(); // Track if connection is ready

  async handleConnection(client: Socket) {
    this.logger.log(`🔗 Client connected: ${client.id}`);
    this.chunkCounters.set(client.id, 0);
    
    client.emit('status', { 
      type: 'connected', 
      message: 'Connected to transcription server' 
    });
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`🔌 Client disconnected: ${client.id}`);
    
    const rt = this.clientMap.get(client.id);
    if (rt) {
      try {
        this.logger.log(`🧹 Closing transcriber for ${client.id}...`);
        await rt.close(false); // Don't wait for final transcript
        this.logger.log(`✅ Transcriber closed for ${client.id}`);
      } catch (err) {
        this.logger.error(`Error closing transcriber for ${client.id}:`, err);
      }
      this.clientMap.delete(client.id);
    }
    
    this.chunkCounters.delete(client.id);
  }

  @SubscribeMessage('start-transcription')
  async handleStartTranscription(@ConnectedSocket() client: Socket) {
    this.logger.log(`🎙️ Starting transcription for client: ${client.id}`);

    // Clean up any existing transcriber for this client
    const existingRt = this.clientMap.get(client.id);
    if (existingRt) {
      this.logger.warn(`⚠️ Transcriber already exists for ${client.id}, closing it...`);
      try {
        await existingRt.close(false);
      } catch (err) {
        this.logger.error('Error closing existing transcriber:', err);
      }
      this.clientMap.delete(client.id);
    }

    try {
      const apiKey = process.env.ASSEMBLY_AI_API_KEY || '92d0012217dc4ecdb5db890545addfa0';
      this.logger.log(`🔑 Using API key: ${apiKey.substring(0, 10)}...`);
      
      const aai = new AssemblyAI({ apiKey });

      const rt = aai.streaming.transcriber({
        sampleRate: 16000,
        minEndOfTurnSilenceWhenConfident: 500,
        // DON'T specify encoding - let AssemblyAI auto-detect
      }) as any;

      this.clientMap.set(client.id, rt);
      this.logger.log(`✅ Transcriber created and stored for ${client.id}`);

      rt.on('open', ({ id, expires_at }) => {
        this.logger.log(`✅ AssemblyAI session opened for ${client.id}`);
        this.logger.log(`   Session ID: ${id}`);
        this.logger.log(`   Expires at: ${expires_at}`);
        this.logger.log(`   ⚠️ READY TO RECEIVE AUDIO - Speak now!`);
        
        client.emit('transcription-ready', {
          sessionId: id,
          expiresAt: expires_at,
        });
        
        client.emit('status', { 
          type: 'recognition_started', 
          message: 'Recognition started - speak now' 
        });
      });

      // Listen to ALL possible events for debugging
      rt.on('transcript', (transcript) => {
        this.logger.log(`📄 Transcript event for ${client.id}:`, transcript);
      });

      rt.on('transcript.partial', (transcript) => {
        this.logger.log(`📝 Partial transcript event for ${client.id}:`, transcript);
      });

      rt.on('transcript.final', (transcript) => {
        this.logger.log(`✅ Final transcript event for ${client.id}:`, transcript);
      });

      rt.on('turn', (turn) => {
        this.logger.log(`🔄 Turn event received for ${client.id}:`, turn); // Log FULL turn object
        
        if (!turn) {
          this.logger.warn(`⚠️ Received empty turn for ${client.id}`);
          return;
        }

        // Log ALL turn data for debugging
        this.logger.log(`🔄 Turn details:`, {
          hasTranscript: !!turn.transcript,
          transcriptLength: turn.transcript?.length,
          transcriptText: turn.transcript,
          endOfTurn: turn.end_of_turn,
          confidence: turn.confidence,
        });

        if (turn.transcript && !turn.end_of_turn) {
          this.logger.log(`📝 Partial transcript (${client.id}): "${turn.transcript}"`);
          client.emit('partial-transcript', turn.transcript);
          
          client.emit('status', { 
            type: 'partial_received', 
            message: 'Processing speech...' 
          });
        }

        if (turn.end_of_turn && turn.transcript) {
          this.logger.log(`✅ Final transcript (${client.id}): "${turn.transcript}"`);
          this.logger.log(`   Confidence: ${turn.confidence}`);
          
          client.emit('final-transcript', {
            text: turn.transcript,
            confidence: turn.confidence,
          });
          
          client.emit('status', { 
            type: 'transcript_complete', 
            message: 'Transcription complete' 
          });
        }
        
        // Log if we got a turn but no transcript
        if (!turn.transcript && turn.end_of_turn) {
          this.logger.warn(`⚠️ Turn ended without transcript for ${client.id}`);
        }
      });

      rt.on('error', (err) => {
        this.logger.error(`❌ AssemblyAI error for ${client.id}:`, err);
        client.emit('error', { 
          type: 'transcription_error',
          reason: err.message || 'AssemblyAI session error' 
        });
      });

      rt.on('close', (code, reason) => {
        this.logger.log(`🔒 AssemblyAI closed for ${client.id}. Code: ${code}, Reason: ${reason}`);
        client.emit('session-ended');
        client.emit('status', { 
          type: 'disconnected', 
          message: 'Transcription session ended' 
        });
      });

      this.logger.log(`📡 Connecting to AssemblyAI for ${client.id}...`);
      await rt.connect();
      this.logger.log(`✅ Connected to AssemblyAI for ${client.id}`);
      
    } catch (error) {
      this.logger.error(`❌ Failed to start transcription for ${client.id}:`, error);
      client.emit('error', { 
        type: 'initialization_error',
        reason: error.message || 'Failed to initialize transcription' 
      });
    }
  }

  @SubscribeMessage('audio_chunk')
  async handleAudioChunk(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chunk: string },
  ) {
    const rt = this.clientMap.get(client.id);
    if (!rt) {
      // Only warn occasionally to avoid log spam
      const count = this.chunkCounters.get(client.id) || 0;
      if (count % 100 === 0) {
        this.logger.warn(`⚠️ No transcriber found for client: ${client.id}`);
        this.logger.warn(`   Available clients: ${Array.from(this.clientMap.keys()).join(', ')}`);
      }
      return;
    }

    try {
      // Decode base64 to buffer (Float32 audio from frontend)
      const audioBuffer = Buffer.from(data.chunk, 'base64');
      
      // Convert Float32 to Int16 PCM for AssemblyAI
      const float32Array = new Float32Array(
        audioBuffer.buffer,
        audioBuffer.byteOffset,
        audioBuffer.length / 4
      );
      
      const int16Array = new Int16Array(float32Array.length);
      for (let i = 0; i < float32Array.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }
      
      const pcmBuffer = Buffer.from(int16Array.buffer);
      
      // Update chunk counter
      const count = (this.chunkCounters.get(client.id) || 0) + 1;
      this.chunkCounters.set(client.id, count);
      
      // Log every 50 chunks
      if (count % 50 === 0) {
        this.logger.log(`🎵 Received ${count} audio chunks from ${client.id} (${pcmBuffer.length} bytes PCM)`);
      }
      
      // Log first chunk with detailed info
      if (count === 1) {
        this.logger.log(`🎵 First audio chunk received from ${client.id}:`);
        this.logger.log(`   Original buffer size: ${audioBuffer.length} bytes (Float32)`);
        this.logger.log(`   Converted buffer size: ${pcmBuffer.length} bytes (Int16 PCM)`);
        this.logger.log(`   Sample count: ${float32Array.length}`);
        
        // Check audio level
        const maxAmplitude = Math.max(...Array.from(float32Array).map(Math.abs));
        this.logger.log(`   Max amplitude: ${maxAmplitude.toFixed(4)} (should be > 0.01)`);
        
        if (maxAmplitude < 0.001) {
          this.logger.warn(`   ⚠️ Audio level very low - check microphone!`);
        }
      }

      // Send PCM audio to AssemblyAI
      rt.sendAudio(pcmBuffer as any);
      
    } catch (err) {
      this.logger.error(`⚠️ Failed to process audio chunk for ${client.id}:`, err);
      client.emit('error', { 
        type: 'audio_send_error',
        reason: 'Failed to process audio chunk' 
      });
    }
  }

  @SubscribeMessage('end_stream')
  async handleEndStream(@ConnectedSocket() client: Socket) {
    this.logger.log(`🔚 End of stream signal received from ${client.id}`);
    
    const rt = this.clientMap.get(client.id);
    if (rt) {
      try {
        // Force flush any remaining audio
        await rt.close();
        this.logger.log(`✅ Stream ended and transcriber closed for ${client.id}`);
      } catch (err) {
        this.logger.error('Error ending stream:', err);
      }
    }
    
    const totalChunks = this.chunkCounters.get(client.id) || 0;
    this.logger.log(`📊 Total chunks processed: ${totalChunks}`);
  }

  @SubscribeMessage('stop-transcription')
  async handleStopTranscription(@ConnectedSocket() client: Socket) {
    this.logger.log(`🛑 Stop transcription requested for ${client.id}`);
    
    const rt = this.clientMap.get(client.id);
    if (rt) {
      try {
        this.logger.log(`🧹 Closing transcriber for ${client.id}...`);
        await rt.close(false); // Don't wait for final transcript
        this.logger.log(`✅ Transcriber stopped for ${client.id}`);
      } catch (err) {
        this.logger.error(`Error stopping transcriber for ${client.id}:`, err);
      }
      this.clientMap.delete(client.id);
    } else {
      this.logger.warn(`⚠️ No transcriber found for ${client.id}`);
    }
    
    const totalChunks = this.chunkCounters.get(client.id) || 0;
    this.logger.log(`📊 Session ended. Total chunks: ${totalChunks}`);
    this.chunkCounters.delete(client.id);
    
    client.emit('session-ended');
    client.emit('status', { 
      type: 'stopped', 
      message: 'Transcription stopped' 
    });
  }
}