import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      <div className="glow-orb w-[500px] h-[500px] -top-40 -left-40 animate-pulse-glow" />
      <div className="glow-orb w-[400px] h-[400px] top-40 -right-32 animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs mb-6"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Platform Belajar AI #1 untuk Pelajar Indonesia</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
            Belajar Lebih Cepat <br />
            dengan <span className="text-gradient">AI Study Hub</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Upload PDF materi, dapatkan ringkasan otomatis, quiz interaktif, flashcard,
            mindmap, AI Chat Tutor, dan AI Voice Tutor — semua dalam satu dashboard premium.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow text-base h-12 px-7 hover:opacity-90 group">
              Mulai Belajar
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="glass text-base h-12 px-7 border-glass-border">
              <Play className="mr-1 h-4 w-4" /> Lihat Demo
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="glass rounded-3xl p-2 shadow-elegant">
            <div className="rounded-2xl w-full h-96 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
              <div className="text-center">
                <div className="h-16 w-16 rounded-2xl bg-gradient-primary mx-auto mb-4 grid place-items-center shadow-glow">
                  <Sparkles className="h-8 w-8 text-primary-foreground" />
                </div>
                <p className="text-muted-foreground">Dashboard Preview</p>
              </div>
            </div>
          </div>
          <div className="absolute -inset-4 bg-gradient-primary opacity-20 blur-3xl -z-10 rounded-full" />
        </motion.div>
      </div>
    </section>
  );
}