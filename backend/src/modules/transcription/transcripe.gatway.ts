
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
       await this.handleDisconnect(client)
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