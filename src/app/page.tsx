"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  ArrowRight, 
  ShieldCheck, 
  Mic,
  FileText,
  Search,
  Globe,
  Activity,
  ChevronRight,
  Lock,
  Cpu
} from "lucide-react";
import { Logo } from "@/components/logo";
import { PublicHeader } from "@/components/public-header";
import { motion } from "framer-motion";
import { Footer } from "@/components/footer";

const featureNodes = [
  { icon: Mic, title: "Voice Summary", desc: "Instantly convert your story into a clear legal roadmap.", href: "/dashboard/narrate" },
  { icon: Search, title: "Document Scan", desc: "Identify risks and deadlines in your legal papers automatically.", href: "/dashboard/document-intelligence" },
  { icon: FileText, title: "Quick Drafting", desc: "Generate professional legal notices and bonds in seconds.", href: "/dashboard/document-generator" },
  { icon: Globe, title: "Expert Connect", desc: "Find and book consultations with verified legal professionals.", href: "/dashboard/lawyer-connect" },
];

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-left">
      <PublicHeader />
      
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="px-6 pt-20 pb-32 max-w-5xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-4 py-1 rounded-full text-xs font-medium border-border">
                <span className="text-primary mr-2">●</span> Simple AI Legal Help
              </Badge>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
              Legal help made <br /> <span className="text-primary">simple & modern.</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Nyaya Sahayak uses smart AI to help you understand your case, scan documents, and connect with legal experts instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button asChild size="lg" className="h-14 px-10 rounded-full font-bold text-base shadow-lg shadow-primary/10">
                <Link href="/dashboard">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="lg" asChild className="h-14 px-8 rounded-full font-bold text-base">
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* FEATURES GRID */}
        <section className="px-6 py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featureNodes.map((node, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={node.href} className="group block p-8 rounded-3xl bg-background border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                    <div className="p-3 rounded-2xl bg-primary/5 text-primary w-fit mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                      <node.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{node.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{node.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="px-6 py-24 max-w-7xl mx-auto text-center border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 opacity-60">
            <div className="flex flex-col items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              <span className="text-sm font-bold uppercase tracking-widest">Secure Data</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-sm font-bold uppercase tracking-widest">Verified Pro</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-sm font-bold uppercase tracking-widest">Live Status</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Cpu className="h-6 w-6 text-primary" />
              <span className="text-sm font-bold uppercase tracking-widest">Smart Core</span>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}