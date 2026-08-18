"use client";

import { motion } from "motion/react";
import {
  TrendingUp,
  Search,
  Target,
  BarChart2,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  Share2,
  Mail,
  PieChart,
} from "lucide-react";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const marketingPillars = [
  {
    icon: Search,
    title: "Technical SEO & Search Engineering",
    description:
      "Algorithmic search optimization, lightning-fast Core Web Vitals, structured schema data, and semantic keyword strategy to dominate organic rankings.",
    tags: ["SEO Audit", "Core Web Vitals", "Schema Markup", "Keyword Strategy"],
    highlight: "Top 1% PageSpeed & Organic Reach",
  },
  {
    icon: Target,
    title: "Performance Paid Acquisition",
    description:
      "Hyper-targeted ad campaigns on Google Ads, Meta (Instagram & Facebook), and LinkedIn with real-time budget optimization and retargeting funnels.",
    tags: ["Google Ads", "Meta Ads", "Retargeting", "ROAS Tuning"],
    highlight: "3.5x Average Campaign ROAS",
  },
  {
    icon: Zap,
    title: "Conversion Rate Optimization (CRO)",
    description:
      "Transform passive visitors into high-value leads and clients. Frictionless landing page design, A/B split testing, and interactive behavioral analytics.",
    tags: ["Landing Pages", "A/B Testing", "Heatmaps", "Funnel Optimization"],
    highlight: "+45% Higher Conversion Rates",
  },
  {
    icon: BarChart2,
    title: "Multi-Touch Attribution & Analytics",
    description:
      "Custom analytics dashboards that track exact customer acquisition paths. Live ROI telemetry across all campaign channels without spreadsheet guesswork.",
    tags: ["GA4 Custom Setup", "ROI Telemetry", "Attribution Modeling", "Executive Dashboards"],
    highlight: "100% Transparent ROI Tracking",
  },
];

const marketingStats = [
  { value: "4.8x", label: "Average Traffic Growth" },
  { value: "3.5x", label: "Return On Ad Spend (ROAS)" },
  { value: "< 24h", label: "Lead Response Automation" },
  { value: "100%", label: "Data Attribution Transparency" },
];

export function DigitalMarketing() {
  return (
    <section id="marketing" className="atlas-section relative bg-[#070809] border-t border-[rgba(0,225,255,0.1)] overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(0,225,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(0,119,255,0.05)_0%,transparent_70%)] pointer-events-none" />

      <Container>
        <SectionHeading
          label="DIGITAL MARKETING & GROWTH ENGINEERING"
          title="Engineered marketing that drives revenue."
          description="We unite technical performance with data-driven growth strategies. Turn your digital presence into a continuous client acquisition engine."
        />

        {/* Growth Statistics Strip */}
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {marketingStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              className="p-6 rounded-2xl bg-[#0F1115] border border-[rgba(0,225,255,0.12)] relative overflow-hidden group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-[radial-gradient(circle,rgba(0,225,255,0.15)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-1">
                <span className="text-[#00E1FF]">{stat.value}</span>
              </div>
              <p className="mt-2 font-mono text-xs text-[#C0C0C8] uppercase tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Services Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {marketingPillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              className="p-8 rounded-2xl bg-[#0F1115] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,225,255,0.3)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00E1FF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#070809] border border-[rgba(0,225,255,0.2)] flex items-center justify-center text-[#00E1FF] group-hover:scale-110 transition-transform">
                    <pillar.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-mono text-[#00E1FF] bg-[rgba(0,225,255,0.06)] border border-[rgba(0,225,255,0.2)] px-3 py-1 rounded-full uppercase tracking-wider">
                    {pillar.highlight}
                  </span>
                </div>

                <h3 className="font-display text-xl font-bold text-white tracking-wide group-hover:text-[#00E1FF] transition-colors">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-sm text-[#C0C0C8] leading-relaxed">{pillar.description}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                <div className="flex flex-wrap gap-2">
                  {pillar.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono text-[#7C8795] bg-[#070809] px-2.5 py-1 rounded border border-[rgba(255,255,255,0.06)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action Banner inside section */}
        <motion.div
          className="mt-12 p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-[#0F1115] via-[#141820] to-[#0F1115] border border-[rgba(0,225,255,0.2)] flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden"
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
