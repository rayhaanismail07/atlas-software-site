"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  Search,
  Target,
  Zap,
  BarChart2,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  LineChart,
  Users,
  DollarSign,
  MousePointerClick,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const marketingPillars = [
  {
    id: "seo",
    icon: Search,
    title: "Technical SEO & Search Engineering",
    badge: "Organic Dominance",
    description:
      "Algorithmic search engine optimization, lightning-fast Core Web Vitals, structured schema data, and high-intent keyword strategies to dominate Google search results.",
    stats: { label: "Organic Search Growth", value: "+380%", tag: "Top 1% PageSpeed" },
    deliverables: [
      "Core Web Vitals & Speed Optimization",
      "Semantic Schema Markup & Rich Snippets",
      "Algorithmic Content Architecture",
      "Competitive Keyword Dominance",
    ],
    accent: "#00f5b8",
    colorName: "emerald",
    activeClass: "border-emerald-400/70 bg-gradient-to-r from-emerald-950/60 via-slate-900/90 to-slate-900/90 shadow-[0_0_35px_rgba(0,245,184,0.18)]",
    iconBg: "bg-emerald-500/20 border-emerald-400/50 text-emerald-300",
    badgeBg: "bg-emerald-500/15 border-emerald-400/40 text-emerald-200",
    glowGradient: "rgba(0,245,184,0.15)",
  },
  {
    id: "paid",
    icon: Target,
    title: "Performance Paid Acquisition",
    badge: "High ROAS",
    description:
      "Data-backed ad campaigns across Google Ads, Meta (Instagram & Facebook), and LinkedIn with algorithmic budget allocation and retargeting conversion funnels.",
    stats: { label: "Average Campaign ROAS", value: "3.8x", tag: "Precision Targeting" },
    deliverables: [
      "Multi-Channel Paid Ad Campaigns",
      "Algorithmic Bid & Budget Optimization",
      "Dynamic Retargeting Funnels",
      "Ad Creative & Copy Testing",
    ],
    accent: "#a78bfa",
    colorName: "violet",
    activeClass: "border-purple-400/70 bg-gradient-to-r from-purple-950/60 via-slate-900/90 to-slate-900/90 shadow-[0_0_35px_rgba(167,139,250,0.18)]",
    iconBg: "bg-purple-500/20 border-purple-400/50 text-purple-300",
    badgeBg: "bg-purple-500/15 border-purple-400/40 text-purple-200",
    glowGradient: "rgba(167,139,250,0.15)",
  },
  {
    id: "cro",
    icon: Zap,
    title: "Conversion Rate Optimization (CRO)",
    badge: "Lead Acceleration",
    description:
      "Turn passive website traffic into high-converting revenue. Frictionless landing page engineering, behavioral heatmaps, and A/B split testing.",
    stats: { label: "Conversion Rate Increase", value: "+54%", tag: "Frictionless UX" },
    deliverables: [
      "High-Converting Landing Page UI",
      "Behavioral User Heatmap Tracking",
      "A/B & Multivariate Split Testing",
      "Frictionless Form & Checkout UX",
    ],
    accent: "#fbbf24",
    colorName: "amber",
    activeClass: "border-amber-400/70 bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-slate-900/90 shadow-[0_0_35px_rgba(251,191,36,0.18)]",
    iconBg: "bg-amber-500/20 border-amber-400/50 text-amber-300",
    badgeBg: "bg-amber-500/15 border-amber-400/40 text-amber-200",
    glowGradient: "rgba(251,191,36,0.15)",
  },
  {
    id: "attribution",
    icon: BarChart2,
    title: "Multi-Touch Attribution & Analytics",
    badge: "100% Transparency",
    description:
      "Custom analytics pipelines tracking exact customer acquisition paths. Live executive dashboards with real-time ROI telemetry—no spreadsheet chaos.",
    stats: { label: "Attribution Transparency", value: "100%", tag: "GA4 Custom Telemetry" },
    deliverables: [
      "Custom GA4 & Event Tracking Setup",
      "Multi-Touch Customer Journey Mapping",
      "Real-Time Executive ROI Dashboards",
      "Automated Lead Nurture Telemetry",
    ],
    accent: "#38bdf8",
    colorName: "cyan",
    activeClass: "border-cyan-400/70 bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-slate-900/90 shadow-[0_0_35px_rgba(56,189,248,0.18)]",
    iconBg: "bg-cyan-500/20 border-cyan-400/50 text-cyan-300",
    badgeBg: "bg-cyan-500/15 border-cyan-400/40 text-cyan-200",
    glowGradient: "rgba(56,189,248,0.15)",
  },
];

const growthMetrics = [
  {
    icon: LineChart,
    value: "4.8x",
    label: "Average Traffic Growth",
    trend: "+320% YOY",
    color: "from-emerald-400 to-teal-500",
    iconBg: "bg-emerald-500/15 text-emerald-300 border-emerald-400/30",
    badgeColor: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    borderColor: "hover:border-emerald-400/50",
  },
  {
    icon: DollarSign,
    value: "3.8x",
    label: "Return On Ad Spend",
    trend: "Verified ROAS",
    color: "from-purple-400 to-indigo-500",
    iconBg: "bg-purple-500/15 text-purple-300 border-purple-400/30",
    badgeColor: "bg-purple-500/10 text-purple-300 border-purple-500/30",
    borderColor: "hover:border-purple-400/50",
  },
  {
    icon: MousePointerClick,
    value: "54%",
    label: "Conversion Lift",
    trend: "Frictionless UI",
    color: "from-amber-400 to-orange-500",
    iconBg: "bg-amber-500/15 text-amber-300 border-amber-400/30",
    badgeColor: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    borderColor: "hover:border-amber-400/50",
  },
  {
    icon: Users,
    value: "< 24h",
    label: "Lead Automation Response",
    trend: "Real-Time Sync",
    color: "from-cyan-400 to-blue-500",
    iconBg: "bg-cyan-500/15 text-cyan-300 border-cyan-400/30",
    badgeColor: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
    borderColor: "hover:border-cyan-400/50",
  },
];

export function DigitalMarketing() {
  const [activePillarId, setActivePillarId] = useState("seo");
  const activePillar = marketingPillars.find((p) => p.id === activePillarId) || marketingPillars[0];

  return (
    <section id="marketing" className="atlas-section relative bg-transparent border-t border-[rgba(0,225,255,0.08)] overflow-hidden">
      {/* Background ambient radial lights with multi-hue spectrum */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,245,184,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(167,139,250,0.06)_0%,transparent_70%)] pointer-events-none" />

      <Container>
        <SectionHeading
          label="02.5 / DIGITAL MARKETING & GROWTH"
          title="Data-Driven Marketing. Engineered for Growth."
          description="We combine technical performance with precision acquisition strategies. Turn your digital web presence into an automated customer growth engine."
        />

        {/* Live Performance Telemetry Strip with Rich Colors */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {growthMetrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              className={`p-6 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-slate-800/90 ${metric.borderColor} transition-all duration-300 relative overflow-hidden group shadow-[0_12px_30px_rgba(0,0,0,0.4)]`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              {/* Top Card Gradient Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${metric.color}`} />

              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${metric.iconBg}`}>
                  <metric.icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border ${metric.badgeColor}`}>
                  {metric.trend}
                </span>
              </div>
              <div className="font-display text-3xl font-bold text-white tracking-tight">{metric.value}</div>
              <p className="mt-1 font-mono text-xs text-slate-300 uppercase tracking-wider">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Growth Strategy Workspace */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pillar Selector Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {marketingPillars.map((pillar) => {
              const isActive = pillar.id === activePillarId;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`p-5 rounded-2xl text-left transition-all duration-300 border flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? pillar.activeClass
                      : "bg-slate-900/60 backdrop-blur-md border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                        isActive ? pillar.iconBg : "bg-slate-950/80 border-slate-800 text-slate-400"
                      }`}
                    >
                      <pillar.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-white transition-colors">
                        {pillar.title}
                      </h4>
                      <span className={`text-[11px] font-mono uppercase tracking-wider ${isActive ? "text-white/80" : "text-slate-500"}`}>
                        {pillar.badge}
                      </span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className={`w-5 h-5 transition-transform ${
                      isActive ? "text-white translate-x-1 -translate-y-1" : "text-slate-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Active Pillar Interactive Deep Dive Display */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 rounded-2xl bg-gradient-to-b from-slate-900/95 to-slate-950/95 backdrop-blur-2xl border border-slate-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden"
              >
                {/* Dynamic Radial Ambient Glow based on active pillar */}
                <div
                  className="absolute top-0 right-0 w-72 h-72 rounded-full pointer-events-none blur-[90px]"
                  style={{ backgroundColor: activePillar.glowGradient }}
                />

                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6 relative z-10">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" style={{ color: activePillar.accent }} />
                    <span className="font-mono text-xs uppercase tracking-widest font-semibold" style={{ color: activePillar.accent }}>
                      {activePillar.badge} STRATEGY
                    </span>
                  </div>
                  <span className={`text-xs font-mono px-3 py-1 rounded-full border ${activePillar.badgeBg}`}>
                    {activePillar.stats.tag}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight relative z-10">
                  {activePillar.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed relative z-10">
                  {activePillar.description}
                </p>

                {/* Key Deliverables Grid with Vibrant Highlights */}
                <div className="mt-6 pt-6 border-t border-slate-800 relative z-10">
                  <h5 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-4 font-semibold">
                    ENGINEERED DELIVERABLES
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {activePillar.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: activePillar.accent }} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Output Card */}
                <div className="mt-8 p-5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between relative z-10">
                  <div>
                    <span className="font-mono text-[11px] text-slate-400 uppercase tracking-wider font-medium">
                      EXPECTED IMPACT
                    </span>
                    <div className="font-display text-lg sm:text-xl font-bold mt-0.5" style={{ color: activePillar.accent }}>
                      {activePillar.stats.label}
                    </div>
                  </div>
                  <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                    {activePillar.stats.value}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Growth Call-To-Action Banner with Vibrant Colors */}
        <motion.div
          className="mt-12 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-purple-950/40 backdrop-blur-xl border border-cyan-500/25 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-2xl relative z-10">
            <span className="font-mono text-xs uppercase tracking-widest text-emerald-400 flex items-center gap-2 font-semibold">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              SCALE YOUR MARKET PRESENCE
            </span>
            <h4 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to accelerate your customer acquisition?
            </h4>
            <p className="mt-2 text-sm sm:text-base text-slate-300">
              Get a custom growth marketing blueprint tailored to your industry, target audience, and business goals.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0 relative z-10">
            <Button href="#contact">
              Launch Growth Campaign <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
