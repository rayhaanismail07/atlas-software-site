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
  Gauge,
  LineChart,
  Users,
  DollarSign,
  MousePointerClick,
  Share2,
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
    accent: "#00E1FF",
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
    accent: "#0077FF",
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
    accent: "#00E1FF",
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
    accent: "#C0C0C8",
  },
];

const growthMetrics = [
  { icon: LineChart, value: "4.8x", label: "Average Traffic Growth", trend: "+320% YOY" },
  { icon: DollarSign, value: "3.8x", label: "Return On Ad Spend", trend: "Verified ROAS" },
  { icon: MousePointerClick, value: "54%", label: "Conversion Lift", trend: "Frictionless UI" },
  { icon: Users, value: "< 24h", label: "Lead Automation Response", trend: "Real-Time Sync" },
];

export function DigitalMarketing() {
  const [activePillarId, setActivePillarId] = useState("seo");
  const activePillar = marketingPillars.find((p) => p.id === activePillarId) || marketingPillars[0];

  return (
    <section id="marketing" className="atlas-section relative bg-transparent border-t border-[rgba(0,225,255,0.08)] overflow-hidden">
      {/* Background ambient radial light */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(0,225,255,0.06)_0%,transparent_70%)] pointer-events-none" />

      <Container>
        <SectionHeading
          label="DIGITAL MARKETING & GROWTH ENGINEERING"
          title="Data-Driven Marketing. Engineered for Growth."
          description="We combine technical performance with precision acquisition strategies. Turn your digital web presence into an automated customer growth engine."
        />

        {/* Live Performance Telemetry Strip */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {growthMetrics.map((metric, idx) => (
            <motion.div
              key={metric.label}
              className="p-6 rounded-2xl bg-[#0F1115]/75 backdrop-blur-xl border border-[rgba(0,225,255,0.14)] hover:border-[rgba(0,225,255,0.35)] transition-all duration-300 relative overflow-hidden group shadow-[0_12px_30px_rgba(0,0,0,0.4)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-[#070809]/80 border border-[rgba(0,225,255,0.2)] flex items-center justify-center text-[#00E1FF]">
                  <metric.icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-[#00E1FF] bg-[rgba(0,225,255,0.08)] px-2 py-0.5 rounded border border-[rgba(0,225,255,0.15)]">
                  {metric.trend}
                </span>
              </div>
              <div className="font-display text-3xl font-bold text-white tracking-tight">{metric.value}</div>
              <p className="mt-1 font-mono text-xs text-[#C0C0C8] uppercase tracking-wider">{metric.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Interactive Growth Strategy Workspace */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Pillar Selector Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {marketingPillars.map((pillar) => {
              const isActive = pillar.id === activePillarId;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => setActivePillarId(pillar.id)}
                  className={`p-5 rounded-2xl text-left transition-all duration-300 border flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? "bg-[#0F1115]/90 backdrop-blur-xl border-[#00E1FF] shadow-[0_0_30px_rgba(0,225,255,0.15)]"
                      : "bg-[#0F1115]/50 backdrop-blur-md border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,225,255,0.25)] hover:bg-[#0F1115]/70"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                        isActive ? "bg-[#00E1FF] text-black" : "bg-[#070809] text-[#00E1FF] border border-[rgba(0,225,255,0.15)]"
                      }`}
                    >
                      <pillar.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-bold text-white group-hover:text-[#00E1FF] transition-colors">
                        {pillar.title}
                      </h4>
                      <span className="text-[11px] font-mono text-[#7C8795] uppercase tracking-wider">{pillar.badge}</span>
                    </div>
                  </div>
                  <ArrowUpRight
                    className={`w-5 h-5 transition-transform ${
                      isActive ? "text-[#00E1FF] translate-x-1 -translate-y-1" : "text-[#7C8795]"
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
                className="p-8 rounded-2xl bg-[#0F1115]/80 backdrop-blur-xl border border-[rgba(0,225,255,0.2)] shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(0,225,255,0.1)_0%,transparent_70%)] pointer-events-none" />

                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00E1FF]" />
                    <span className="font-mono text-xs text-[#00E1FF] uppercase tracking-widest">
                      {activePillar.badge} STRATEGY
                    </span>
                  </div>
                  <span className="text-xs font-mono text-white bg-[rgba(0,225,255,0.1)] border border-[rgba(0,225,255,0.2)] px-3 py-1 rounded-full">
                    {activePillar.stats.tag}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold text-white tracking-tight">{activePillar.title}</h3>
                <p className="mt-3 text-sm text-[#C0C0C8] leading-relaxed">{activePillar.description}</p>

                {/* Key Deliverables Grid */}
                <div className="mt-6 pt-6 border-t border-[rgba(255,255,255,0.08)]">
                  <h5 className="font-mono text-xs text-[#7C8795] uppercase tracking-wider mb-4">
                    ENGINEERED DELIVERABLES
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activePillar.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-xs text-white">
                        <CheckCircle2 className="w-4 h-4 text-[#00E1FF] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Output Card */}
                <div className="mt-8 p-4 rounded-xl bg-[#070809]/90 border border-[rgba(0,225,255,0.15)] flex items-center justify-between">
                  <div>
                    <span className="font-mono text-[11px] text-[#7C8795] uppercase tracking-wider">EXPECTED IMPACT</span>
                    <div className="font-display text-xl font-bold text-[#00E1FF]">{activePillar.stats.label}</div>
                  </div>
                  <div className="font-display text-3xl font-bold text-white">{activePillar.stats.value}</div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Growth Call-To-Action Banner */}
        <motion.div
          className="mt-12 p-8 sm:p-10 rounded-2xl bg-[#0F1115]/75 backdrop-blur-xl border border-[rgba(0,225,255,0.2)] flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-widest text-[#00E1FF] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00E1FF]" />
              SCALE YOUR MARKET PRESENCE
            </span>
            <h4 className="mt-2 font-display text-2xl font-bold text-white tracking-tight">
              Ready to accelerate your customer acquisition?
            </h4>
            <p className="mt-2 text-sm text-[#C0C0C8]">
              Get a custom growth marketing blueprint tailored to your industry, target audience, and business goals.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <Button href="#contact">
              Launch Growth Campaign <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
