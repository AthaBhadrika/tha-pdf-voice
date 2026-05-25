import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Apakah ATHA AI gratis?", a: "Ya, kamu bisa mulai gratis dengan kuota upload PDF dan generate AI yang cukup untuk pelajar." },
  { q: "PDF jenis apa yang didukung?", a: "Semua PDF teks (modul, buku, slide). PDF hasil scan juga didukung dengan OCR otomatis." },
  { q: "Apakah Voice Tutor mendukung Bahasa Indonesia?", a: "Tentu. Voice Tutor mendukung Indonesia & Inggris dengan kontrol kecepatan dan pitch." },
  { q: "Bagaimana keamanan dokumen saya?", a: "Dokumen disimpan terenkripsi dengan Row Level Security dan hanya bisa diakses oleh kamu." },
  { q: "Bisa pakai di HP?", a: "Bisa. Tampilan dioptimalkan untuk Mobile, Tablet, dan Desktop." },
];

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Pertanyaan <span className="text-gradient">populer</span>
          </h2>
        </div>
        <div className="glass rounded-2xl p-2 md:p-4">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`i${i}`} className="border-glass-border px-4">
                <AccordionTrigger className="text-left hover:no-underline">{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
