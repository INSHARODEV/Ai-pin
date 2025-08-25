// file: realtime-one-paragraph-fixed.js
import mic from "mic";
import { spawn } from "child_process";
import fs from "fs";
import { AssemblyAI } from "assemblyai";

// ---------------- CONFIG ----------------
const CONFIG = {
  MIC_SAMPLE_RATE: 48000,         // your mic native sample rate (44.1kHz or 48kHz)
  TARGET_SAMPLE_RATE: 16000,      // required by AssemblyAI
  BYTES_PER_SAMPLE: 2,            // 16-bit PCM
  TARGET_CHUNK_MS: 50,            // 20–100ms frames
  AUTO_FLUSH_SILENCE_MS: 5000,    // flush after 5s silence
  END_OF_TURN_SILENCE_MS: 2000,   // end turn after 2s silence
  SHOW_PARTIALS: false,
  PCM_DUMP_PATH: "./debug_capture.pcm"
};

// ---------------- SETUP ----------------
const debugStream = fs.createWriteStream(CONFIG.PCM_DUMP_PATH);
const client = new AssemblyAI({
  apiKey:  '92d0012217dc4ecdb5db890545addfa0'
});

class RealtimeOneParagraph {
  constructor() {
    this.rt = null;
    this.micInstance = null;
    this.ready = false;
    this.audioBuffer = Buffer.alloc(0);
    this.targetChunkSize =
      (CONFIG.TARGET_SAMPLE_RATE * CONFIG.BYTES_PER_SAMPLE * CONFIG.TARGET_CHUNK_MS) / 1000;
    this.sessionBuffer = "";
    this.lastActivityAt = Date.now();
    this.flushTimer = null;
    this.isShuttingDown = false;
    this.bytesSentThisSecond = 0;
  }

  async connect() {
    console.log("🔌 Connecting to AssemblyAI...");
    this.rt = client.streaming.transcriber({
      sampleRate: CONFIG.TARGET_SAMPLE_RATE,
      format_text: true,
      end_of_turn_silence_threshold: CONFIG.END_OF_TURN_SILENCE_MS,
    });
    this.setupEventHandlers();
    await this.rt.connect();
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

    this.rt.on("turn", (turn) => {
      if (!turn) return;
      if (CONFIG.SHOW_PARTIALS && turn.transcript && !turn.end_of_turn) {
        process.stdout.write(`\r📝 ${turn.transcript.slice(0, 120)}   `);
      }
      if (turn.end_of_turn && turn.transcript) {
        if (CONFIG.SHOW_PARTIALS) process.stdout.write("\r" + " ".repeat(140) + "\r");
        this.sessionBuffer += (this.sessionBuffer ? " " : "") + turn.transcript.trim();
        this.lastActivityAt = Date.now();
        this.armFlushTimer();
      }
    });

    this.rt.on("error", (error) => {
      console.error("❌ Transcriber error:", error?.message || error);
      this.ready = false;
    });

    this.rt.on("close", (code, reason) => {
      console.log(`🔒 Connection closed: ${reason || code}`);
      this.ready = false;
    });
  }

  armFlushTimer() {
    if (!CONFIG.AUTO_FLUSH_SILENCE_MS || CONFIG.AUTO_FLUSH_SILENCE_MS <= 0) return;
    if (this.flushTimer) clearTimeout(this.flushTimer);
    this.flushTimer = setTimeout(() => {
      const idle = Date.now() - this.lastActivityAt;
      if (idle >= CONFIG.AUTO_FLUSH_SILENCE_MS) this.flushSessionParagraph();
    }, CONFIG.AUTO_FLUSH_SILENCE_MS + 50);
  }

  flushSessionParagraph() {
    const paragraph = this.sessionBuffer.trim();
    if (!paragraph) return;
    console.log("\n" + "─".repeat(60));
    console.log("📄 PARAGRAPH:");
    console.log(paragraph);
    console.log("─".repeat(60) + "\n");
    this.sessionBuffer = "";
  }

  startMicrophone() {
    if (this.micInstance) this.micInstance.stop();

    // Setup mic at native rate
    this.micInstance = mic({
      rate: String(CONFIG.MIC_SAMPLE_RATE),
      channels: "1",
      bitwidth: String(CONFIG.BYTES_PER_SAMPLE * 8),
      encoding: "signed-integer",
      endianness: "little",
      device: "default",
      debug: false,
      exitOnSilence: 0,
    });

    const micInputStream = this.micInstance.getAudioStream();

    // FFmpeg resampling pipeline
    const ffmpegProc = spawn("ffmpeg", [
      "-f", "s16le",
      "-ar", String(CONFIG.MIC_SAMPLE_RATE),
      "-ac", "1",
      "-i", "pipe:0",
      "-ar", String(CONFIG.TARGET_SAMPLE_RATE),
      "-f", "s16le",
      "pipe:1"
    ]);

    micInputStream.pipe(ffmpegProc.stdin);

    micInputStream.on("data", (chunk) => debugStream.write(chunk));

    ffmpegProc.stdout.on("data", (chunk) => {
      this.processAudioData(chunk);
    });

    micInputStream.on("error", (err) => console.error("❌ Microphone error:", err));

    console.log("🎙️ Microphone ready - speak now!");
    console.log(`💡 Pause ~${CONFIG.AUTO_FLUSH_SILENCE_MS / 1000}s for output`);

    this.micInstance.start();

    // Bytes per second diagnostic
    setInterval(() => {
      const kbps = (this.bytesSentThisSecond / 1024).toFixed(1);
      process.stdout.write(`\r📤 Uplink: ${kbps} KB/s   `);
      this.bytesSentThisSecond = 0;
    }, 1000);
  }

  processAudioData(chunk) {
    if (!this.ready || !this.rt) return;
    this.audioBuffer = Buffer.concat([this.audioBuffer, chunk]);
    while (this.audioBuffer.length >= this.targetChunkSize) {
      const sendChunk = this.audioBuffer.subarray(0, this.targetChunkSize);
      this.audioBuffer = this.audioBuffer.subarray(this.targetChunkSize);
      this.sendAudioSafely(sendChunk);
    }
  }

  sendAudioSafely(chunk) {
    try {
      if (this.rt && this.ready) {
        this.rt.sendAudio(chunk);
        this.bytesSentThisSecond += chunk.length;
      }
    } catch (error) {
      console.error("❌ Error sending audio:", error?.message || error);
      this.ready = false;
    }
  }

  async shutdown() {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;
    console.log("\n🛑 Shutting down...");
    this.flushSessionParagraph();
    this.ready = false;
    if (this.micInstance) try { this.micInstance.stop(); } catch {}
    if (this.rt) try { await this.rt.close(); } catch {}
    if (debugStream) try { debugStream.end(); } catch {}
    console.log("✅ Goodbye!");
    process.exit(0);
  }
}

 const transcriber = new RealtimeOneParagraph();

process.on("SIGINT", () => transcriber.shutdown());
process.on("SIGTERM", () => transcriber.shutdown());
process.on("uncaughtException", (e) => { console.error(e); transcriber.shutdown(); });
process.on("unhandledRejection", (r) => { console.error(r); transcriber.shutdown(); });

console.log("🎤 AssemblyAI Realtime → One Big Paragraph (finalized only)");
console.log("=".repeat(50));

transcriber.connect().catch(console.error);
