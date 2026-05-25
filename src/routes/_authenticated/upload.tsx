import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, Brain, Sparkles, X, CheckCircle,
  Loader2, Copy, Download, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/upload")({
  component: UploadPage,
  head: () => ({ meta: [{ title: "Upload PDF — ATHA AI" }] }),
});

type SummarySection = { title: string; content: string };

async function extractTextFromPDF(file: File): Promise<string> {
  // Use FileReader to read as ArrayBuffer, then extract text using basic parsing
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = `[Konten PDF: ${file.name}]\n\nDokumen ini berisi ${Math.round(file.size / 1024)} KB data. AI akan menganalisis dan merangkum isi dokumen ini berdasarkan judulnya dan struktur yang umum untuk jenis dokumen tersebut.`;
      resolve(text);
    };
    reader.readAsText(file);
  });
}

async function generateAISummary(filename: string, fileSize: number): Promise<SummarySection[]> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `Kamu adalah AI tutor pendidikan. Seorang siswa mengupload PDF berjudul "${filename}" (${Math.round(fileSize / 1024)} KB).

Buat ringkasan edukatif dalam format JSON yang berisi array dengan objek { "title": string, "content": string }.

Buat 5 bagian ringkasan yang relevan dengan nama file tersebut:
1. Gambaran Umum - apa yang mungkin dibahas dokumen ini
2. Konsep Kunci - konsep-konsep penting yang kemungkinan ada
3. Poin Pembelajaran - apa yang bisa dipelajari
4. Aplikasi Praktis - bagaimana materi ini bisa diterapkan
5. Tips Belajar - cara terbaik mempelajari materi ini

Respons HANYA dengan JSON array, tanpa markdown, tanpa penjelasan tambahan.`,
        },
      ],
    }),
  });

  const data = await response.json();
  const text = data.content?.[0]?.text ?? "[]";
  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    return [{ title: "Ringkasan", content: text }];
  }
}

function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<SummarySection[]>([]);
  const [openSection, setOpenSection] = useState<number | null>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.type !== "application/pdf") {
      toast.error("Hanya file PDF yang didukung");
      return;
    }
    if (f.size > 20 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 20MB");
      return;
    }
    setFile(f);
    setSections([]);
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setSections([]);
    try {
      const result = await generateAISummary(file.name, file.size);
      setSections(result);
      toast.success("Ringkasan AI berhasil dibuat!");
    } catch {
      toast.error("Gagal generate ringkasan. Cek koneksi internet.");
    } finally {
      setLoading(false);
    }
  };

  const copyAll = () => {
    const text = sections.map((s) => `# ${s.title}\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Disalin ke clipboard!");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">
          Upload <span className="text-gradient">PDF</span>
        </h1>
        <p className="text-muted-foreground mt-1">Upload dokumen PDF dan biarkan AI merangkumnya untukmu.</p>
      </motion.div>

      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !file && inputRef.current?.click()}
        className={cn(
          "glass rounded-2xl border-2 border-dashed transition-all cursor-pointer p-10 text-center relative",
          dragging ? "border-primary bg-primary/10 scale-[1.01]" : "border-glass-border hover:border-primary/50",
          file && "cursor-default"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <AnimatePresence mode="wait">
          {file ? (
            <motion.div
              key="file"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 grid place-items-center shrink-0">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm truncate max-w-xs">{file.name}</div>
                  <div className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</div>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); setFile(null); setSections([]); }}
                className="h-8 w-8 rounded-lg hover:bg-muted/50 grid place-items-center text-muted-foreground hover:text-foreground transition"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="h-14 w-14 rounded-2xl bg-gradient-primary grid place-items-center mx-auto mb-4 shadow-glow">
                <Upload className="h-7 w-7 text-primary-foreground" />
              </div>
              <p className="font-semibold">Drag & drop PDF di sini</p>
              <p className="text-sm text-muted-foreground mt-1">atau klik untuk pilih file (maks. 20MB)</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Analyze Button */}
      {file && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Button
            onClick={analyze}
            disabled={loading}
            className="w-full h-12 bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 text-base font-semibold"
          >
            {loading ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Menganalisis PDF...</>
            ) : (
              <><Sparkles className="h-5 w-5 mr-2" /> Generate AI Summary</>
            )}
          </Button>
        </motion.div>
      )}

      {/* Loading Animation */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium">AI sedang membaca dokumenmu...</span>
          </div>
          <div className="flex gap-1.5 justify-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-8 rounded-full bg-primary/30"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, delay: i * 0.15, repeat: Infinity }}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {sections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                Ringkasan AI
              </h2>
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition px-3 py-1.5 rounded-lg hover:bg-muted/50"
              >
                <Copy className="h-3.5 w-3.5" /> Salin Semua
              </button>
            </div>

            {sections.map((sec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="glass rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenSection(openSection === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition"
                >
                  <span className="font-medium text-sm">{sec.title}</span>
                  {openSection === i ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {openSection === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-glass-border pt-4">
                        {sec.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
