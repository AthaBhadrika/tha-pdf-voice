import { motion } from "framer-motion";
import { Star } from "lucide-react";

const items = [
  { name: "Aisyah R.", role: "Mahasiswa Kedokteran", text: "Voice Tutor-nya gila sih. Aku bisa belajar anatomi sambil treadmill. Game changer banget." },
  { name: "Rizky Pratama", role: "Siswa SMA", text: "Upload PDF Fisika, langsung jadi quiz + flashcard. Nilai try out naik dari 70 ke 92." },
  { name: "Dewi Lestari", role: "Guru Biologi", text: "Saya pakai untuk siapkan materi kelas. Mindmap-nya rapi, siswa lebih engaged." },
];

export function Testimonials() {
  return (
    <section id="testimoni" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Dicintai oleh <span className="text-gradient">ribuan pelajar</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {items.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground font-semibold">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
