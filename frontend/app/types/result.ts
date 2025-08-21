import { Turn } from "./turns";

export type Result = {
    _id: string;
    createdAt: string;
     updatedAt: string;
    turns: Turn[];
    raw_transcript: string;
    summary: string;
    audio_url?: string;
    audio_urls?: string[];
    status?: string;
    chunk_count?: number;
  };