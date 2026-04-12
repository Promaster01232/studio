
"use client";

import { use, useMemo } from "react";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ArrowLeft, 
  Scale, 
  AlertTriangle, 
  Bot, 
  Zap, 
  Globe,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  BrainCircuit,
  Activity,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const comparisonData = [
  { feature: "Primary focus", ns: "Indian statutory law", gpt: "Global general knowledge", status: "ns" },
  { feature: "BNS compliance", ns: "100% Synchronized", gpt: "Partial / Generalized", status: "ns" },
  { feature: "Instrument drafting", ns: "High-fidelity notices/bonds", gpt: "Basic structural templates", status: "ns" },
  { feature: "Procedural roadmaps", ns: "Step-by-step judicial paths", gpt: "Conceptual guidance", status: "ns" },
  { feature: "Case status tracking", ns: "Real-time eCourts sync", gpt: "Not supported", status: "ns" },
  { feature: "Beginner accessibility", ns: "High (Layman friendly)", gpt: "High (General ease)", status: "both" },
  { feature: "Deep academic depth", ns: "Focused forensic data", gpt: "Extensive theoretical detail", status: "gpt" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const heroImage = PlaceHolderImages.find(img => img.id === 'blog-vs-gpt-hero');
  const nodeImage = PlaceHolderImages.find(img => img.id === 'ai-judicial-node');

  if (id !== "1") {
    notFound();
  }

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="max-w-5xl mx-auto space-y-16 pb-32 px-4 sm:px-6 text-left selection:bg-primary/20"
    >
      {/* Navigation Ingress */}
      <motion.div variants={itemVariants} className="flex items-center pt-10">
        <Link 
          href="/blog" 
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group uppercase tracking-widest"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to registry</span>
        </Link>
      </motion.div>

      {/* Hero Header Node */}
      <section className="space-y-10">
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Statutory audit // 12/04/2026
            </Badge>
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tighter leading-tight text-foreground font-headline uppercase">
            Nyaya Sahayak <span className="text-primary">vs</span> ChatGPT
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground font-medium max-w-3xl leading-relaxed">
            A forensic audit comparing specialized Indian legal intelligence against generalized global AI models.
          </p>
        </motion.div>

        {heroImage && (
          <motion.div 
            variants={itemVariants}
            className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-3xl border border-primary/10 group"
          >
            <Image 
              src={heroImage.imageUrl} 
              alt={heroImage.description} 
              fill 
              className="object-cover transition-transform duration-[20s] group-hover:scale-110" 
              data-ai-hint={heroImage.imageHint}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
          </motion.div>
        )}
      </section>

      {/* Core Analysis Matrix */}
      <div className="grid gap-16">
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div variants={itemVariants}>
            <Card className="h-full border-primary/10 bg-primary/[0.02] rounded-[2.5rem] overflow-hidden shadow-xl group hover:border-primary/30 transition-all duration-500">
              <CardContent className="p-10 space-y-8 text-left">
                <div className="p-5 rounded-2xl bg-primary/10 text-primary w-fit shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Scale className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight text-foreground uppercase">The specialized node</h3>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Nyaya Sahayak is engineered specifically for the Indian Judicial System. It functions as a legal first-aid terminal, providing precise statutory identifiers and procedural roadmaps.
                  </p>
                </div>
                <ul className="space-y-4 pt-2">
                  {["BNS statutory mapping", "Verified advocate registry", "Local procedural audits"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-xs font-black text-foreground/80 uppercase tracking-widest">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="h-full border-border/10 bg-muted/20 rounded-[2.5rem] overflow-hidden shadow-xl group hover:border-border/30 transition-all duration-500">
              <CardContent className="p-10 space-y-8 text-left">
                <div className="p-5 rounded-2xl bg-muted text-muted-foreground w-fit shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Bot className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight text-foreground uppercase">The generalized node</h3>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    ChatGPT is a large-scale neural network with a global knowledge base. While highly capable of explaining general legal theory, it lacks specialized synchronization with local Indian court complexes.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" /> Limitation node
                  </p>
                  <p className="text-xs font-bold text-muted-foreground leading-relaxed">May not be updated with the latest BNS amendments or specific regional procedures.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Audit Table Section */}
        <motion.section variants={itemVariants} className="space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-12 bg-primary rounded-full" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Comparison matrix</h2>
          </div>
          
          <Card className="border-border/10 shadow-3xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/10">
                  <TableHead className="h-16 font-black text-[10px] uppercase tracking-[0.3em] pl-10 text-muted-foreground">Forensic feature</TableHead>
                  <TableHead className="h-16 font-black text-[10px] uppercase tracking-[0.3em] text-primary">Nyaya sahayak</TableHead>
                  <TableHead className="h-16 font-black text-[10px] uppercase tracking-[0.3em] text-muted-foreground">ChatGPT</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonData.map((row, i) => (
                  <TableRow key={i} className="hover:bg-primary/[0.02] border-border/5 transition-colors">
                    <TableCell className="py-8 pl-10 font-bold text-sm text-foreground/70 uppercase tracking-tight">{row.feature}</TableCell>
                    <TableCell className="py-8">
                      <div className={cn(
                        "text-sm font-black tracking-tight flex items-center gap-2",
                        row.status === 'ns' || row.status === 'both' ? "text-foreground" : "text-muted-foreground opacity-40"
                      )}>
                        {row.ns}
                      </div>
                    </TableCell>
                    <TableCell className="py-8">
                      <div className={cn(
                        "text-sm font-black tracking-tight flex items-center gap-2",
                        row.status === 'gpt' || row.status === 'both' ? "text-foreground" : "text-muted-foreground opacity-40"
                      )}>
                        {row.gpt}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </motion.section>

        {/* Verdict Nodes */}
        <motion.section variants={itemVariants} className="grid md:grid-cols-2 gap-8">
          <Card className="rounded-[3rem] border-primary/10 bg-primary/5 p-10 space-y-8 text-left group hover:border-primary/30 transition-all duration-500">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-primary">
              <Zap className="h-6 w-6" />
              Optimal for Bharat
            </h3>
            <ul className="space-y-6">
              {[
                "Direct practical legal assistance in India",
                "Filing of complaints, FIRs, and notices",
                "Precise BNS section identification"
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-base font-bold text-foreground/80 leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="rounded-[3rem] border-border/10 bg-muted/20 p-10 space-y-8 text-left group hover:border-border/30 transition-all duration-500">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-muted-foreground">
              <Globe className="h-6 w-6" />
              Optimal for Research
            </h3>
            <ul className="space-y-6">
              {[
                "Global comparative law analysis",
                "In-depth theoretical explanations",
                "Academic legal study and drafting"
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <BrainCircuit className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-base font-bold text-muted-foreground leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </Card>
        </motion.section>

        {/* Institutional Synergy Hub */}
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-3xl bg-[#0a0a0a] text-white rounded-[4rem] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {nodeImage && (
              <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-1000">
                <Image src={nodeImage.imageUrl} alt="Neural Node" fill className="object-cover" />
              </div>
            )}

            <CardContent className="p-12 sm:p-24 relative z-10 text-center space-y-10">
              <div className="flex flex-col items-center gap-6">
                <div className="bg-primary/20 p-6 rounded-3xl border border-primary/20 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                  <TrendingUp className="h-12 w-12 text-primary" />
                </div>
                <Badge variant="outline" className="border-primary/40 text-primary font-black text-[10px] uppercase tracking-[0.5em] px-8 py-2 rounded-full">Synergy protocol</Badge>
              </div>
              <div className="space-y-6 max-w-2xl mx-auto">
                <h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-tight uppercase">Utilize both <span className="text-primary">Together</span></h2>
                <p className="text-xl sm:text-2xl text-white/60 font-medium leading-relaxed">
                  The most powerful approach involves utilizing the specialized statutory precision of Nyaya Sahayak alongside the theoretical depth of ChatGPT.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-6">
                <div className="text-center space-y-2">
                  <p className="text-primary font-black text-2xl sm:text-3xl tracking-tight uppercase">Nyaya Sahayak</p>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Statutory roadmap</p>
                </div>
                <ArrowRight className="h-10 w-10 text-white/20 hidden sm:block animate-pulse" />
                <div className="text-center space-y-2">
                  <p className="text-white font-black text-2xl sm:text-3xl tracking-tight uppercase">ChatGPT</p>
                  <p className="text-[10px] font-black uppercase text-white/40 tracking-[0.3em]">Theoretical depth</p>
                </div>
              </div>
            </CardContent>
            <div className="h-3 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
          </Card>
        </motion.div>
      </div>

      <div className="text-center pt-16 opacity-30">
          <div className="flex items-center justify-center gap-6 mb-4">
              <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Authenticated Registry</span>
              </div>
              <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Procedural Success</span>
              </div>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-muted-foreground">NYAYASAHAYAK.IN // KNOWLEDGE NODE // 2026</p>
      </div>
    </motion.div>
  );
}
