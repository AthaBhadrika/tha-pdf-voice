import { motion } from "framer-motion";

const stats = [
  { v: "50K+", l: "Pelajar Aktif" },
  { v: "1.2M", l: "PDF Dianalisis" },
  { v: "8.5M", l: "Quiz Diselesaikan" },
  { v: "98%", l: "Tingkat Kepuasan" },
];

export function Stats() {
  return (
    <section id="stats" className="py-16">
      <div className="container mx-auto px-4">
        <div className="glass rounded-3xl p-8 md:p-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-5xl font-bold text-gradient">{s.v}</div>
              <div className="text-sm text-muted-foreground mt-2">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
