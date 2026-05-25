import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Brain, Layers, Flame, Trophy, TrendingUp, Zap, Award,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid,
  AreaChart, Area,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — ATHA AI" }] }),
});

const weekData = [
  { d: "Sen", xp: 120, time: 45 },
  { d: "Sel", xp: 180, time: 65 },
  { d: "Rab", xp: 90, time: 30 },
  { d: "Kam: ", xp: 240, time: 80 },
  { d: "Jum", xp: 200, time: 70 },
  { d: "Sab", xp: 320, time: 110 },
  { d: "Min", xp: 280, time: 95 },
];

const activities = [
  { icon: FileText, title: "Selesai ringkasan: Bab 3 - Hukum Newton", time: "5 menit lalu", color: "from-blue-500 to-cyan-500" },
  { icon: Brain, title: "Quiz Fisika selesai: skor 92/100", time: "1 jam lalu", color: "from-green-500 to-emerald-500" },
  { icon: Layers, title: "10 flashcard baru di-generate", time: "3 jam lalu", color: "from-purple-500 to-pink-500" },
  { icon: Trophy, title: "Achievement baru: Quick Learner", time: "Kemarin", color: "from-orange-500 to-red-500" },
];

function StatCard({ icon: Icon, label, value, trend, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass rounded-2xl p-5 group hover:shadow-glow transition-shadow"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-primary grid place-items-center shadow-glow">
          <Icon className="h-5 w-5 text-primary-foreground" />
        </div>
        {trend && <span className="text-xs text-emerald-500 font-medium flex items-center gap-0.5"><TrendingUp className="h-3 w-3" />{trend}</span>}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

function Dashboard() {
  const [profile, setProfile] = useState<{ fullname: string | null; xp: number; level: number; streak: number } | null>(null);

  useEffect(() => {
    supabase.from("profiles").select("fullname,xp,level,streak").maybeSingle().then(({ data }) => {
      if (data) setProfile(data);
    });
  }, []);

  const name = profile?.fullname ?? "Pelajar";
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const streak = profile?.streak ?? 0;
  const nextLevelXp = level * 500;
  const progress = Math.min(100, (xp % 500) / 5);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Halo, <span className="text-gradient">{name}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Mari lanjutkan perjalanan belajarmu hari ini.</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Materi Dipelajari" value="12" trend="+3" delay={0.05} />
        <StatCard icon={Brain} label="Quiz Selesai" value="48" trend="+8" delay={0.1} />
        <StatCard icon={Layers} label="Total Flashcard" value="234" trend="+24" delay={0.15} />
        <StatCard icon={Flame} label="Streak Hari" value={`${streak || 7} 🔥`} delay={0.2} />
      </div>

      {/* Level + Chart */}
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-6 relative overflow-hidden"
        >
          <div className="glow-orb w-64 h-64 -bottom-20 -right-20 animate-pulse-glow" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Level kamu</div>
                <div className="text-2xl font-bold">Level {level}</div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mb-1.5 flex justify-between">
              <span>{xp} XP</span>
              <span>{nextLevelXp} XP</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {Math.max(0, nextLevelXp - (xp % 500))} XP lagi ke Level {level + 1}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-6 lg:col-span-2"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Progress Mingguan</h3>
            <span className="text-xs text-muted-foreground">XP per hari</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekData}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.74 0.2 50)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.74 0.2 50)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="d" stroke="oklch(0.7 0.02 270)" fontSize={11} />
                <YAxis stroke="oklch(0.7 0.02 270)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.22 0.018 270 / 0.95)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 12,
                    backdropFilter: "blur(10px)",
                  }}
                />
                <Area type="monotone" dataKey="xp" stroke="oklch(0.74 0.2 50)" strokeWidth={2.5} fill="url(#g)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold flex items-center gap-2"><Award className="h-4 w-4 text-primary" /> Aktivitas Terakhir</h3>
        </div>
        <div className="space-y-3">
          {activities.map((a, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.05 }}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/30 transition"
            >
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${a.color} grid place-items-center shrink-0`}>
                <a.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.time}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
