import Image from "next/image";
import { useRef, useState } from "react";

export function AudioPlayer({ transcription }: { transcription: any }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    console.log(transcription.audio_url)
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Failed to play audio:", err);
        });
    }
  };

  if (!transcription?.audio_url) {
    return (
      <section className="mb-6 shadow-custom rounded-2xl bg-card">
        <div className="p-4 text-sm text-gray-500">No audio available</div>
      </section>
    );
  }

  return (
    <section className="mb-6 shadow-custom rounded-2xl bg-card">
      <div className="p-4 flex items-center gap-3">
        {/* Custom play/pause button */}
        <button
          onClick={togglePlay}
          className="p-1.5 rounded-full bg-[#0D70C81A] hover:bg-[#0D70C82A]"
        >
          <Image
            alt={isPlaying ? "Pause" : "Play"}
            src={isPlaying ? "/pause.svg" : "/pause.svg"}
            width={19}
            height={19}
          />
        </button>

        {/* Audio element with ref */}
        <audio
          ref={audioRef} // 👈 now the ref is actually connected
          className="hidden"
          onEnded={() => setIsPlaying(false)}
        >
          <source src={transcription.audio_url}      type="audio/webm"  />
          Your browser does not support the audio element.
        </audio>

        {/* Label */}
        <span className="text-sm font-medium">Conversation Recording</span>
      </div>
    </section>
  );
}
