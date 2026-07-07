import { useRef, useState } from "react";

// Audio note hero — nút play viền tròn mảnh gold-accent + text.
// KHÔNG autoplay. AUDIO_SRC là placeholder: khi có file thật (45 giây),
// đặt vào public/ rồi điền đường dẫn — component tự hoạt động, không đổi layout.
const AUDIO_SRC = "";

export default function AudioNote() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const el = audioRef.current;
    if (!el || !AUDIO_SRC) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      el.play();
      setPlaying(true);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={toggle}
        aria-label="Nghe Kenji tâm tình — 45 giây"
        className="w-11 h-11 rounded-full border border-e26-gold flex items-center justify-center text-e26-gold-deep hover:bg-e26-gold hover:text-e26-black transition-colors duration-300 flex-shrink-0"
      >
        {playing ? (
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5" fill="currentColor" aria-hidden="true">
            <rect x="3" y="2" width="3.5" height="12" />
            <rect x="9.5" y="2" width="3.5" height="12" />
          </svg>
        ) : (
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 ml-0.5" fill="currentColor" aria-hidden="true">
            <path d="M4 2l10 6-10 6V2z" />
          </svg>
        )}
      </button>
      <span className="font-sans text-sm text-e26-text-2">Nghe Kenji tâm tình — 45 giây</span>
      {AUDIO_SRC && (
        <audio ref={audioRef} src={AUDIO_SRC} onEnded={() => setPlaying(false)} preload="none" />
      )}
    </div>
  );
}
