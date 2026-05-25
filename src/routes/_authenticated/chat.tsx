import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Loader2, User, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/chat")({
  component: ChatPage,
  head: () => ({ meta: [{ title: "Chat Tutor — ATHA AI" }] }),
});

type Message = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Kamu adalah ATHA AI, tutor pintar yang membantu siswa belajar. 
Kamu ramah, sabar, dan menjelaskan konsep dengan bahasa yang mudah dipahami. 
Gunakan emoji sesekali agar lebih menyenangkan. 
Jika ada soal, bantu siswa memahami cara penyelesaiannya step by step.
Selalu dorong siswa untuk terus belajar.`;

const QUICK_PROMPTS = [
  "Jelaskan hukum Newton dengan contoh sederhana",
  "Bagaimana cara menghitung turunan fungsi?",
  "Apa perbedaan mitosis dan meiosis?",
  "Bantu aku memahami sistem tata surya",
];

async function sendToAI(messages: Message[]): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  const data = await response.json();
  return data.content?.[0]?.text ?? "Maaf, ada kesalahan. Coba lagi ya!";
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const reply = await sendToAI(updated);
      setMessages([...updated, { role: "assistant", content: reply }]);
    } catch {
      setMessages([...updated, { role: "assistant", content: "Maaf, terjadi kesalahan. Pastikan koneksi internetmu baik ya! 🙏" }]);
    } finally {
      setLoading(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const clearChat = () => setMessages([]);

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4 shrink-0"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Chat <span className="text-gradient">Tutor</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-0.5">Tanya apapun tentang pelajaranmu</p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition px-3 py-1.5 rounded-lg hover:bg-destructive/10"
          >
            <Trash2 className="h-3.5 w-3.5" /> Hapus Chat
          </button>
        )}
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-4 shadow-glow">
              <Brain className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Halo! Aku ATHA AI 👋</h3>
            <p className="text-muted-foreground text-sm mt-1 mb-6">Mau belajar apa hari ini? Tanya aja!</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => send(p)}
                  className="glass rounded-xl px-4 py-3 text-sm text-left hover:bg-muted/30 transition hover:border-primary/30 border border-glass-border"
                >
                  <Sparkles className="h-3.5 w-3.5 text-primary inline mr-1.5" />
                  {p}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              <div className={cn(
                "h-8 w-8 rounded-xl grid place-items-center shrink-0 mt-0.5",
                msg.role === "user"
                  ? "bg-gradient-primary shadow-glow"
                  : "glass border border-glass-border"
              )}>
                {msg.role === "user" ? (
                  <User className="h-4 w-4 text-primary-foreground" />
                ) : (
                  <Brain className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-gradient-primary text-primary-foreground rounded-tr-sm"
                  : "glass border border-glass-border rounded-tl-sm"
              )}>
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="h-8 w-8 rounded-xl glass border border-glass-border grid place-items-center shrink-0 mt-0.5">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div className="glass border border-glass-border rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="h-2 w-2 rounded-full bg-primary/50"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="glass rounded-2xl p-3 border border-glass-border shrink-0">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ketik pertanyaanmu... (Enter kirim, Shift+Enter baris baru)"
            className="resize-none bg-transparent border-0 focus-visible:ring-0 min-h-[44px] max-h-32 text-sm p-0"
            rows={1}
          />
          <Button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="h-10 w-10 p-0 shrink-0 bg-gradient-primary shadow-glow hover:opacity-90"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
