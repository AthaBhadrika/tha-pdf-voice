import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-glass-border py-12 mt-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary grid place-items-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold">ATHA<span className="text-gradient"> AI</span> STUDY HUB</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privasi</a>
            <a href="#" className="hover:text-foreground">Syarat</a>
            <a href="#" className="hover:text-foreground">Kontak</a>
          </div>
          <div className="text-xs text-muted-foreground">
            © 2026 ATHA AI. Dibuat untuk pelajar Indonesia.
          </div>
        </div>
      </div>
    </footer>
  );
}
