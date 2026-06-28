import { motion } from "motion/react";
import { 
  TrendingUp, 
  ShieldCheck, 
  Fingerprint, 
  Cpu, 
  Activity, 
  Layers 
} from "lucide-react";

export default function ProtocolMetrics() {
  const stats = [
    {
      id: "opt_value",
      name: "Squeezed Contract Value",
      value: "$142,491,200",
      trend: "+14.8% optimized",
      trendType: "positive",
      icon: TrendingUp,
      color: "text-emerald-400 bg-emerald-500/10 bg-emerald-500/20",
      chartColor: "#3b82f6",
      chartData: [20, 34, 45, 62, 58, 75, 88, 92, 105, 114, 125, 142]
    },
    {
      id: "savings",
      name: "Total Buyer Savings",
      value: "$12,940,300",
      trend: "Zero-leakage secured",
      trendType: "neutral",
      icon: ShieldCheck,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      chartColor: "#10b981",
      chartData: [5, 12, 18, 25, 30, 42, 54, 61, 72, 85, 102, 115, 129]
    },
    {
      id: "nodes",
      name: "Validated Nodes Pool",
      value: "1,284 Active",
      trend: "14ms Avg consensus latency",
      trendType: "latency",
      icon: Cpu,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
      chartColor: "#6366f1",
      chartData: [95, 96, 94, 98, 99, 97, 100, 100, 102, 105, 105, 104, 108]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {stats.map((stat) => (
        <div 
          key={stat.id}
          className="bg-[#0F0F12] border border-slate-800/80 rounded-2xl p-6 flex flex-col gap-4 relative overflow-hidden group hover:border-slate-700/80 transition-all duration-300 shadow-xl"
        >
          {/* Subtle glow layer behind the icon */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-radial text-emerald-500/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold block">
                {stat.name}
              </span>
              <div className="text-2xl font-extrabold text-white tracking-tight font-sans">
                {stat.value}
              </div>
            </div>

            <div className={`p-2.5 rounded-xl border ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>

          {/* Mini Sparkline Chart utilizing pure SVG */}
          <div className="h-10 w-full relative">
            <svg className="w-full h-full overflow-visible opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <defs>
                <linearGradient id={`sparkGradient-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={stat.chartColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={stat.chartColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={stat.chartData.reduce((path, val, idx) => {
                  const x = (idx / (stat.chartData.length - 1)) * 240;
                  const maxVal = Math.max(...stat.chartData);
                  const minVal = Math.min(...stat.chartData);
                  const y = 35 - ((val - minVal) / (maxVal - minVal)) * 25;
                  return `${path}${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, "")}
                fill="none"
                stroke={stat.chartColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d={`${stat.chartData.reduce((path, val, idx) => {
                  const x = (idx / (stat.chartData.length - 1)) * 240;
                  const maxVal = Math.max(...stat.chartData);
                  const minVal = Math.min(...stat.chartData);
                  const y = 35 - ((val - minVal) / (maxVal - minVal)) * 25;
                  return `${path}${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }, "")} L 240 40 L 0 40 Z`}
                fill={`url(#sparkGradient-${stat.id})`}
              />
            </svg>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] font-mono">
            {stat.trendType === "positive" && (
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                ▲ {stat.trend}
              </span>
            )}
            {stat.trendType === "neutral" && (
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                ✔ {stat.trend}
              </span>
            )}
            {stat.trendType === "latency" && (
              <span className="text-indigo-400 font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded flex items-center gap-1">
                <Activity className="w-4 h-4 animate-pulse" /> {stat.trend}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
