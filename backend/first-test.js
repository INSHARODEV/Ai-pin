import mic from "mic";
import { AssemblyAI } from "assemblyai";

const client = new AssemblyAI({
    apiKey: "92d0012217dc4ecdb5db890545addfa0", // replace with your AssemblyAI key
});

class ProductionStreamingTranscriber {
    constructor() {
        this.rt = null;
        this.micInstance = null;
        this.ready = false;
        this.audioBuffer = Buffer.alloc(0);
        this.isShuttingDown = false;
        
        // Audio configuration
        this.sampleRate = 16000;
        this.bytesPerSample = 2;
        this.targetChunkDurationMs = 50;
        this.targetChunkSize = (this.sampleRate * this.bytesPerSample * this.targetChunkDurationMs) / 1000;
        
        // Paragraph handling
        this.paragraphs = [];
        this.currentParagraph = '';
    }

    async connect() {
        try {
            console.log("🔌 Connecting to AssemblyAI...");
            this.rt = client.streaming.transcriber({
                sampleRate: this.sampleRate,
                format_text: false,
                end_of_turn_silence_threshold: 500, // (ms of silence before finalizing a turn)
            });
            this.setupEventHandlers();
            await this.rt.connect();
        } catch (error) {
            console.error("❌ Failed to connect:", error.message);
            throw error;
        }
    }

    setupEventHandlers() {
        this.rt.on("open", ({ id, expires_at }) => {
            console.log(`✅ Connected! Session: ${id.substring(0, 8)}...`);
            console.log(`⏰ Session expires: ${new Date(expires_at * 1000).toLocaleTimeString()}`);
            setTimeout(() => {
                this.ready = true;
                this.startMicrophone();
            }, 100);
        });

        this.rt.on("error", (error) => {
            console.error("❌ Transcriber error:", error.message);
            this.ready = false;
        });

        this.rt.on("close", (code, reason) => {
            console.log(`🔒 Connection closed: ${reason}`);
            this.ready = false;
        });

        this.rt.on("turn", (turn) => {
            if (turn.transcript) {
                // Add the current turn to the paragraph
                this.currentParagraph += ' ' + turn.transcript;
                
                // If it's the end of a turn, process the paragraph
                if (turn.end_of_turn) {
                    this.processParagraph(turn);
                }
            }
        });
    }

    processParagraph(turn) {
        // Clean up the paragraph
        let paragraph = this.currentParagraph.trim();
        
        // Only add if it's not empty
        if (paragraph) {
            this.paragraphs.push({
                text: paragraph,
                confidence: turn.end_of_turn_confidence,
                timestamp: new Date().toISOString()
            });
            this.currentParagraph = '';
            
            // Output the paragraph
            console.log('\n' + '─'.repeat(60));
            console.log(`📄 PARAGRAPH ${this.paragraphs.length}:`);
            console.log(paragraph);
            console.log(`📊 Confidence: ${(turn.end_of_turn_confidence * 100).toFixed(1)}%`);
            console.log('─'.repeat(60));
        }
    }

    getTranscription() {
        return this.paragraphs.map(p => p.text).join('\n\n');
    }

    startMicrophone() {
        if (this.micInstance) {
            this.micInstance.stop();
        }
        this.micInstance = mic({
            rate: this.sampleRate.toString(),
            channels: "1",
            bitwidth: "16",
            encoding: "signed-integer",
            device: "default",
            debug: false,
            exitOnSilence: 0,
        });

        const micInputStream = this.micInstance.getAudioStream();
        micInputStream.on("data", (chunk) => {
            this.processAudioData(chunk);
        });
        micInputStream.on("error", (err) => {
            console.error("❌ Microphone error:", err);
        });

        console.log("🎙️  Microphone ready - speak now!");
        console.log("💡 Tip: Speak clearly in short phrases for best results");
        console.log("⌨️  Press Ctrl+C to stop\n");
        this.micInstance.start();
    }

    processAudioData(newChunk) {
        if (!this.ready || !this.rt) return;
        this.audioBuffer = Buffer.concat([this.audioBuffer, newChunk]);
        while (this.audioBuffer.length >= this.targetChunkSize) {
            const chunkToSend = this.audioBuffer.subarray(0, this.targetChunkSize);
            this.audioBuffer = this.audioBuffer.subarray(this.targetChunkSize);
            this.sendAudioSafely(chunkToSend);
        }
    }

    sendAudioSafely(chunk) {
        try {
            if (this.rt && this.ready) {
                this.rt.sendAudio(chunk);
            }
        } catch (error) {
            console.error("❌ Error sending audio:", error.message);
            this.ready = false;
        }
    }

    async shutdown() {
        if (this.isShuttingDown) return;
        console.log("\n🛑 Shutting down...");
        this.isShuttingDown = true;
        this.ready = false;
        if (this.micInstance) {
            this.micInstance.stop();
        }
        if (this.rt) {
            try {
                await this.rt.close();
            } catch (error) {
                console.warn("⚠️ Error during shutdown:", error.message);
            }
        }
        console.log("✅ Goodbye!");
        process.exit(0);
    }
}

// Initialize and run
const transcriber = new ProductionStreamingTranscriber();

// Graceful shutdown
process.on("SIGINT", () => transcriber.shutdown());
process.on("SIGTERM", () => transcriber.shutdown());

// Error handling
process.on("uncaughtException", (error) => {
    console.error("💥 Uncaught exception:", error);
    transcriber.shutdown();
});

process.on("unhandledRejection", (reason) => {
    console.error("💥 Unhandled rejection:", reason);
    transcriber.shutdown();
});

// Welcome message
console.log("🎤 AssemblyAI Real-time Speech Transcription");
console.log("=" .repeat(50));

// Start the application
transcriber.connect().catch(console.error);