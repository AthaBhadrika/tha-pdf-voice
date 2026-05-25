import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative glass rounded-3xl p-12 md:p-20 text-center overflow-hidden"
        >
          <div className="glow-orb w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse-glow" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
              Siap upgrade <span className="text-gradient">cara belajarmu?</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Gabung dengan 50.000+ pelajar yang sudah mempercepat belajar mereka dengan ATHA AI.
            </p>
            <Button size="lg" className="bg-gradient-primary text-primary-foreground shadow-glow h-12 px-8 hover:opacity-90 group">
              Mulai Gratis Sekarang
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
