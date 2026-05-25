import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, VolumeX, Brain, Loader2, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/voice")({
  component: VoicePage,
  head: () => ({ meta: [{ title: "Voice Tutor — ATHA AI" }] }),
});

type Transcript = { role: "user" | "ai"; text: string; time: string };

const SYSTEM_PROMPT = `Kamu adalah ATHA AI, tutor suara yang ramah dan edukatif. 
Berikan jawaban yang singkat, jelas, dan mudah dipahami karena ini adalah percakapan suara.
Maksimal 3-4 kalimat per respons. Gunakan bahasa Indonesia yang natural.
Selalu semangati siswa untuk terus belajar.`;

async function getAIResponse(question: string, history: Transcript[]): Promise<string> {
  const messages = [
    ...history.slice(-6).map((t) => ({
      role: t.role === "user" ? "user" : "assistant",
      content: t.text,
    })),
    { role: "user", content: question },
  ];

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text ?? "Maaf, aku tidak bisa menjawab saat ini.";
}

function speak(text: string, onEnd?: () => void) {
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = "id-ID";
  utter.rate = 0.95;
  utter.pitch = 1.05;
  const voices = window.speechSynthesis.getVoices();
  const id = voices.find((v) => v.lang.startsWith("id"));
  if (id) utter.voice = id;
  if (onEnd) utter.onend = onEnd;
  window.speechSynthesis.speak(utter);
}

const QUICK_TOPICS = [
  "Jelaskan fotosintesis",
  "Apa itu gravitasi?",
  "Bagaimana cara belajar efektif?",
  "Ceritakan tentang sistem peredaran darah",
];

export function VoicePage() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setSupported(false); return; }
    const rec = new SR();
    rec.lang = "id-ID";
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (e: any) => {
      const results = Array.from(e.results);
      const interim = results
        .filter((r: any) => !r.isFinal)
        .map((r: any) => r[0].transcript)
        .join("");
      const final = results
        .filter((r: any) => r.isFinal)
        .map((r: any) => r[0].transcript)
        .join("");
      setInterimText(interim);
      if (final) handleQuestion(final);
    };

    rec.onend = () => {
      setListening(false);
      setInterimText("");
    };

    rec.onerror = (e: any) => {
      setListening(false);
      setInterimText("");
      if (e.error !== "no-speech" && e.error !== "aborted") {
        toast.error("Mikrofon error: " + e.error);
      }
    };

    recognitionRef.current = rec;
  }, []);

  const handleQuestion = useCallback(async (text: string) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    const userEntry: Transcript = { role: "user", text, time: now };
    setTranscripts((prev) => [...prev, userEntry]);
    setLoading(true);

    try {
      const answer = await getAIResponse(text, [...transcripts, userEntry]);
      const aiEntry: Transcript = { role: "ai", text: answer, time: now };
      setTranscripts((prev) => [...prev, aiEntry]);

      if (!muted) {
        setSpeaking(true);
        speak(answer, () => setSpeaking(false));
      }
    } catch {
      toast.error("Gagal mendapat jawaban AI");
    } finally {
      setLoading(false);
    }
  }, [transcripts, muted]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        toast.error("Tidak bisa akses mikrofon");
      }
    }
  };

  const toggleMute = () => {
    if (!muted) window.speechSynthesis.cancel();
    setMuted(!muted);
    setSpeaking(false);
  };

  const reset = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis.cancel();
    setListening(false);
    setSpeaking(false);
    setLoading(false);
    setTranscripts([]);
    setInterimText("");
  };

  if (!supported) {
    return (
      <div className="max-w-xl mx-auto text-center py-20">
        <div className="h-14 w-14 rounded-2xl bg-muted grid place-items-center mx-auto mb-4">
          <MicOff className="h-7 w-7 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Browser Tidak Didukung</h2>
        <p className="text-muted-foreground text-sm">
          Voice Tutor memerlukan Web Speech API. Gunakan Chrome atau Edge terbaru.
        </p>
      </div>
    );
  }

  const isActive = listening || speaking || loading;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold tracking-tight">
          Voice <span className="text-gradient">Tutor</span>
        </h1>
        <p className="text-muted-foreground text-sm mt-0.5">Ngobrol langsung dengan AI tutor menggunakan suara</p>
      </motion.div>

      {/* Voice Orb */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-3xl p-8 text-center relative overflow-hidden"
      >
        <div className="glow-orb w-64 h-64 -bottom-20 -right-20 animate-pulse-glow opacity-40" />

        {/* Status */}
        <div className="relative">
          <div className="text-sm text-muted-foreground mb-6 h-5">
            {listening && <span className="text-primary font-medium animate-pulse">● Mendengarkan...</span>}
            {loading && !listening && <span className="text-amber-400 font-medium">⚡ AI sedang berpikir...</span>}
            {speaking && <span className="text-emerald-400 font-medium">🔊 AI sedang berbicara...</span>}
            {!isActive && <span>Tekan mikrofon untuk mulai berbicara</span>}
          </div>

          {/* Mic Button */}
          <div className="relative inline-block mb-6">
            {isActive && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/20"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full bg-primary/10"
                  animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 1.5, delay: 0.3, repeat: Infinity }}
                />
              </>
            )}
            <button
              onClick={toggleMic}
              disabled={loading}
              className={cn(
                "relative h-24 w-24 rounded-full grid place-items-center transition-all shadow-glow",
                listening
                  ? "bg-destructive hover:bg-destructive/90 scale-110"
                  : "bg-gradient-primary hover:opacity-90"
              )}
            >
              {loading ? (
                <Loader2 className="h-10 w-10 text-white animate-spin" />
              ) : listening ? (
                <MicOff className="h-10 w-10 text-white" />
              ) : (
                <Mic className="h-10 w-10 text-white" />
              )}
            </button>
          </div>

          {/* Interim text */}
          {interimText && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm italic text-muted-foreground mb-4"
            >
              "{interimText}"
            </motion.p>
          )}

          {/* Controls */}
          <div className="flex justify-center gap-3">
            <button
              onClick={toggleMute}
              className={cn(
                "flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl transition",
                muted
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              {muted ? "Suara Mati" : "Suara Aktif"}
            </button>
            {transcripts.length > 0 && (
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Topics */}
      {transcripts.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Topik populer:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => handleQuestion(t)}
                disabled={loading || listening}
                className="glass rounded-xl px-4 py-3 text-sm text-left hover:bg-muted/30 transition border border-glass-border disabled:opacity-50"
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Transcript */}
      <AnimatePresence>
        {transcripts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-muted-foreground">Riwayat Percakapan</h3>
            {transcripts.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: t.role === "user" ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "glass rounded-xl p-4 border border-glass-border",
                  t.role === "user" ? "ml-8" : "mr-8"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={cn(
                    "h-6 w-6 rounded-lg grid place-items-center",
                    t.role === "user" ? "bg-gradient-primary" : "bg-emerald-500/20"
                  )}>
                    {t.role === "user" ? (
                      <Mic className="h-3 w-3 text-white" />
                    ) : (
                      <Brain className="h-3 w-3 text-emerald-500" />
                    )}
                  </div>
                  <span className="text-xs font-medium">{t.role === "user" ? "Kamu" : "ATHA AI"}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{t.time}</span>
                </div>
                <p className="text-sm leading-relaxed">{t.text}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
