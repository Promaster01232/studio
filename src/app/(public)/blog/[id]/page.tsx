
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
  BrainCircuit
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const comparisonData = [
  { feature: "Focus", ns: "Only Indian law", gpt: "Global knowledge", status: "ns" },
  { feature: "Accuracy (India-specific)", ns: "✅ More focused", gpt: "⚠️ Generalized", status: "ns" },
  { feature: "Legal document drafting", ns: "✅ Yes (complaints, notices)", gpt: "⚠️ Basic drafting", status: "ns" },
  { feature: "Step-by-step legal help", ns: "✅ Practical guidance", gpt: "⚠️ Conceptual help", status: "ns" },
  { feature: "Latest law updates", ns: "⚠️ Limited (depends on system)", gpt: "⚠️ Not guaranteed", status: "both" },
  { feature: "Ease for beginners", ns: "✅ Very easy", gpt: "✅ Easy", status: "both" },
  { feature: "Depth of explanation", ns: "❌ Limited", gpt: "✅ Very detailed", status: "gpt" },
];

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const heroImage = PlaceHolderImages.find(img => img.id === 'blog-vs-gpt-hero');
  const nodeImage = PlaceHolderImages.find(img => img.id === 'ai-judicial-node');

  if (id !== "1") {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-32 px-4 sm:px-6 text-left selection:bg-primary/20">
      {/* Navigation Node */}
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center pt-10"
      >
        <Link 
          href="/blog" 
          className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to registry</span>
        </Link>
      </motion.div>

      {/* Hero Header */}
      <section className="space-y-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              Statutory audit
            </Badge>
          </div>
          
          <h1 className="text-4xl sm:text-8xl font-black tracking-tighter leading-[0.9] text-foreground font-headline">
            Nyaya Sahayak <span className="text-primary">vs</span> ChatGPT
          </h1>
          
          <p className="text-lg sm:text-2xl text-muted-foreground font-medium max-w-3xl leading-relaxed">
            A forensic comparison between specialized Indian legal intelligence and generalized global AI models.
          </p>
        </motion.div>

        {heroImage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-3xl border border-border/10"
          >
            <Image 
              src={heroImage.imageUrl} 
              alt={heroImage.description} 
              fill 
              className="object-cover" 
              data-ai-hint={heroImage.imageHint}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
          </motion.div>
        )}
      </section>

      {/* Main Analysis Terminal */}
      <div className="grid gap-16">
        {/* Definition Nodes */}
        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-primary/10 bg-primary/[0.02] rounded-[2.5rem] overflow-hidden shadow-xl group hover:border-primary/30 transition-all duration-500">
              <CardContent className="p-10 space-y-8 text-left">
                <div className="p-5 rounded-2xl bg-primary/10 text-primary w-fit shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Scale className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight text-foreground uppercase">What is Nyaya Sahayak?</h3>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    Nyaya Sahayak is an AI-based legal aid tool for India designed to give <span className="text-primary font-bold">“legal first-aid”</span> to common citizens. It is specifically engineered for practical help and local context.
                  </p>
                </div>
                <ul className="space-y-4 pt-2">
                  {["Understanding legal rights", "Drafting complaints / notices", "Guidance on where to file cases"].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-xs font-black text-foreground/80 uppercase tracking-widest">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-border/10 bg-muted/20 rounded-[2.5rem] overflow-hidden shadow-xl group hover:border-border/30 transition-all duration-500">
              <CardContent className="p-10 space-y-8 text-left">
                <div className="p-5 rounded-2xl bg-muted text-muted-foreground w-fit shadow-lg group-hover:scale-110 transition-transform duration-500">
                  <Bot className="h-8 w-8" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-black tracking-tight text-foreground uppercase">What is ChatGPT?</h3>
                  <p className="text-base text-muted-foreground leading-relaxed font-medium">
                    ChatGPT is a general AI model with global knowledge. While it can explain legal concepts, it is not officially connected to specialized Indian statutory databases.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
                  <p className="text-[10px] font-black text-destructive uppercase tracking-[0.3em] flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4" /> Limitation node
                  </p>
                  <p className="text-xs font-bold text-muted-foreground leading-relaxed">May not always be updated with the latest Indian laws or specific local procedures.</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Comparison Matrix Table */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="space-y-10"
        >
          <div className="flex items-center gap-4">
            <div className="h-1.5 w-12 bg-primary rounded-full" />
            <h2 className="text-2xl font-black uppercase tracking-tighter">Comparison matrix</h2>
          </div>
          
          <Card className="border-border/10 shadow-3xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow className="hover:bg-transparent border-border/10">
                  <TableHead className="h-16 font-black text-[10px] uppercase tracking-[0.3em] pl-10 text-muted-foreground">Audit feature</TableHead>
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
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          <Card className="rounded-[3rem] border-primary/10 bg-primary/5 p-10 space-y-8 text-left group hover:border-primary/30 transition-all duration-500">
            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-4 text-primary">
              <Zap className="h-6 w-6" />
              Use Nyaya Sahayak when
            </h3>
            <ul className="space-y-6">
              {[
                "You want practical legal help in India",
                "Filing complaint / FIR / notice",
                "Understanding procedures step-by-step"
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
              Use ChatGPT when
            </h3>
            <ul className="space-y-6">
              {[
                "You want detailed explanation of concepts",
                "Comparing laws or global case understanding",
                "Studying law or academic research"
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-4">
                  <BrainCircuit className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-base font-bold text-muted-foreground leading-relaxed">{text}</p>
                </li>
              ))}
            </ul>
          </Card>
        </motion.section>

        {/* Conclusion Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <Card className="border-none shadow-3xl bg-[#1a1a1a] text-white rounded-[4rem] overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
            
            {nodeImage && (
              <div className="absolute inset-0 opacity-10 grayscale group-hover:grayscale-0 transition-all duration-1000">
                <Image src={nodeImage.imageUrl} alt="AI Neural" fill className="object-cover" />
              </div>
            )}

            <CardContent className="p-12 sm:p-24 relative z-10 text-center space-y-10">
              <div className="flex flex-col items-center gap-6">
                <div className="bg-primary/20 p-6 rounded-3xl border border-primary/20 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                  <TrendingUp className="h-12 w-12 text-primary" />
                </div>
                <Badge variant="outline" className="border-primary/40 text-primary font-black text-[10px] uppercase tracking-[0.5em] px-8 py-2 rounded-full">Optimal strategy</Badge>
              </div>
              <div className="space-y-6 max-w-2xl mx-auto">
                <h2 className="text-4xl sm:text-7xl font-black tracking-tighter leading-tight uppercase">Use Both <span className="text-primary">Together</span></h2>
                <p className="text-xl sm:text-2xl text-white/60 font-medium leading-relaxed">
                  The most powerful forensic approach involves utilizing the synergy between both analytical terminals.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-10 pt-6">
                <div className="text-center space-y-2">
                  <p className="text-primary font-black text-2xl sm:text-3xl tracking-tight uppercase">Nyaya Sahayak</p>
                  <p className="text-xs font-black uppercase text-white/40 tracking-[0.3em]">“What to do”</p>
                </div>
                <ArrowRight className="h-10 w-10 text-white/20 hidden sm:block animate-pulse" />
                <div className="text-center space-y-2">
                  <p className="text-white font-black text-2xl sm:text-3xl tracking-tight uppercase">ChatGPT</p>
                  <p className="text-xs font-black uppercase text-white/40 tracking-[0.3em]">“Why & Deeper Insight”</p>
                </div>
              </div>
            </CardContent>
            <div className="h-3 w-full bg-gradient-to-r from-primary via-accent to-blue-400"></div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
