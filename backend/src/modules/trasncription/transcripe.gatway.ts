import { OnModuleInit } from "@nestjs/common";
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
  import { Server, Socket } from 'socket.io';
import { AssemblyAI, StreamingTranscriber } from 'assemblyai';
  @WebSocketGateway()
export class AssemblyAiGateway   {
    @WebSocketServer()
    server: Server;
    private client: AssemblyAI;
    private userTranscribers = new Map<string, StreamingTranscriber>();
    constructor(){
    
            this.client = new AssemblyAI({
              apiKey: process.env.ASSMBLEY_AI_API_KEY as string,
            });
     
    }

    
    
}