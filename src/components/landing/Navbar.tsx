import { motion } from "framer-motion";
import { Brain, Menu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl"
    >
      <nav className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
            <Brain className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">
            ATHA<span className="text-gradient"> AI</span>
          </span>
        </a>
        <div className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition">Fitur</a>
          <a href="#stats" className="hover:text-foreground transition">Statistik</a>
          <a href="#testimoni" className="hover:text-foreground transition">Testimoni</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm" className="bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
            <Link to="/register">Mulai Gratis</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
        </div>
      </nav>
    </motion.header>
  );
}
