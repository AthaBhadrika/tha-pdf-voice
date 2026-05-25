import { motion } from "framer-motion";
import {
  FileText, Brain, MessageSquare, Mic, Layers, Network,
  Trophy, Map, Target,
} from "lucide-react";

const features = [
  { icon: FileText, title: "PDF Analyzer", desc: "Upload materi PDF dan AI akan membaca seluruh isinya secara instan." },
  { icon: Brain, title: "AI Summary", desc: "Ringkasan otomatis per bab dengan highlight poin penting." },
  { icon: Target, title: "Quiz Generator", desc: "10+ soal pilihan ganda otomatis dengan pembahasan." },
  { icon: Layers, title: "Smart Flashcard", desc: "Flashcard dengan flip animation dan mode random." },
  { icon: Network, title: "Interactive Mindmap", desc: "Mindmap visual auto-generate, drag, zoom, dan export." },
  { icon: MessageSquare, title: "AI Chat Tutor", desc: "Tanya jawab kontekstual berdasarkan isi dokumen kamu." },
  { icon: Mic, title: "AI Voice Tutor", desc: "Materi dibacakan dengan suara natural, kontrol penuh." },
  { icon: Map, title: "Study Roadmap", desc: "Roadmap belajar personal berdasarkan materi & progress." },
  { icon: Trophy, title: "Gamifikasi XP", desc: "XP, badge, streak, dan leaderboard membuat belajar seru." },
];

export function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-block glass rounded-full px-3 py-1 text-xs text-primary mb-4">FITUR PREMIUM</div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Semua yang kamu butuhkan <br />
            untuk <span className="text-gradient">belajar pintar</span>
          </h2>
          <p className="text-muted-foreground">
            Satu platform, sembilan superpower AI yang membuat belajar terasa seperti masa depan.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.05, duration: 0.5 }}
              whileHover={{ y: -6 }}
              className="glass rounded-2xl p-6 group hover:shadow-glow transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-primary grid place-items-center mb-5 shadow-glow group-hover:scale-110 transition-transform">
                <f.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
