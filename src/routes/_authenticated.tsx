import { createFileRoute, Outlet, redirect, Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Upload, FileText, Brain, Layers, Network,
  MessageSquare, Mic, Map, Trophy, Settings, LogOut, Menu, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/login", search: { redirect: location.href } as never });
    }
  },
  component: AuthLayout,
});

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", active: true },
  { to: "/upload", icon: Upload, label: "Upload PDF", active: true },
  { to: "/chat", icon: MessageSquare, label: "Chat Tutor", active: true },
  { to: "/voice", icon: Mic, label: "Voice Tutor", active: true },
  { to: "/summary", icon: FileText, label: "AI Summary", active: false },
  { to: "/quiz", icon: Brain, label: "Quiz", active: false },
  { to: "/flashcards", icon: Layers, label: "Flashcards", active: false },
  { to: "/mindmap", icon: Network, label: "Mindmap", active: false },
  { to: "/roadmap", icon: Map, label: "Roadmap", active: false },
  { to: "/achievements", icon: Trophy, label: "Achievements", active: false },
];

function AuthLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? ""));
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    toast.success("Berhasil keluar");
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:sticky top-0 left-0 z-40 h-screen w-64 p-4 transition-transform lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="glass rounded-2xl h-full flex flex-col p-4">
          <Link to="/dashboard" className="flex items-center gap-2 px-2 py-2 mb-6">
            <div className="h-9 w-9 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold">ATHA<span className="text-gradient"> AI</span></span>
          </Link>

          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = path === item.to;
              if (!item.active) {
                return (
                  <div
                    key={item.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground/50 cursor-default"
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                    <span className="ml-auto text-[10px] bg-muted/50 text-muted-foreground/60 px-1.5 py-0.5 rounded-md">soon</span>
                  </div>
                );
              }
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                    active
                      ? "bg-gradient-primary text-primary-foreground shadow-glow font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-glass-border space-y-1">
            <div className="px-3 py-2 text-xs text-muted-foreground truncate">{email}</div>
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition">
              <LogOut className="h-4 w-4" /> Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/50 z-30 lg:hidden" />}

      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-20 glass rounded-b-2xl px-4 py-3 flex items-center justify-between mb-4">
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <span className="font-bold text-sm">ATHA<span className="text-gradient"> AI</span></span>
          <div className="w-9" />
        </header>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
