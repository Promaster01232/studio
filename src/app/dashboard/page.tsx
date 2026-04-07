"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Mic,
  Search,
  FileText,
  FileSignature,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Clock,
  ChevronRight,
  Gavel,
  Activity,
  Heart,
  Newspaper,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth, useFirestore } from "@/firebase";
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Post {
    id: string;
    authorUid: string;
    authorName: string;
    authorAvatar?: string;
    createdAt: Timestamp;
    title: string;
    content: string;
    likes: number;
    postType?: string;
    isAnonymous?: boolean;
}

const tools = [
    { icon: Mic, title: "Voice Summary", href: "/dashboard/narrate", color: "text-blue-500", bg: "bg-blue-500/5" },
    { icon: Search, title: "Document Scan", href: "/dashboard/document-intelligence", color: "text-indigo-500", bg: "bg-indigo-500/5" },
    { icon: FileText, title: "Write Drafts", href: "/dashboard/document-generator", color: "text-sky-500", bg: "bg-sky-500/5" },
    { icon: FileSignature, title: "Create Bonds", href: "/dashboard/bond-generator", color: "text-cyan-500", bg: "bg-cyan-500/5" },
];

export default function DashboardHomePage() {
  const firestore = useFirestore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const postsCol = collection(firestore, "posts");
    const q = query(postsCol, orderBy("createdAt", "desc"), limit(3));
    
    const unsub = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
        setPosts(list);
        setLoading(false);
    }, () => setLoading(false));
    
    return () => unsub();
  }, [firestore]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8 px-4 text-left">
      {/* WELCOME SECTION */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Home</h1>
        <p className="text-muted-foreground font-medium">Access your legal tools and track case progress.</p>
      </section>

      {/* CORE TOOLS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tools.map((tool, i) => (
          <Link key={i} href={tool.href} className="group block">
            <Card className="h-full border-border hover:border-primary/30 transition-all rounded-2xl hover:shadow-lg">
              <CardContent className="p-6">
                <div className={cn("p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform", tool.bg, tool.color)}>
                  <tool.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold mb-1">{tool.title}</h3>
                <div className="flex items-center text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  Open Tool <ArrowRight className="ml-1.5 h-3 w-3" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* MAIN FEED */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-primary" /> Community Feed
            </h2>
            <Button variant="ghost" size="sm" asChild className="text-xs font-bold">
              <Link href="/dashboard/research-analytics">View All</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary/40" /></div>
            ) : posts.map((post) => (
              <Card key={post.id} className="border-border hover:border-primary/20 transition-all rounded-2xl group cursor-pointer" asChild>
                <Link href={`/dashboard/research-analytics`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg border">
                          <AvatarFallback className="text-[10px] font-bold bg-muted">{post.isAnonymous ? 'A' : post.authorName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-left">
                          <p className="text-xs font-bold">{post.isAnonymous ? 'Anonymous' : post.authorName}</p>
                          <p className="text-[10px] text-muted-foreground">{post.createdAt ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true }) : 'Just now'}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-bold uppercase">{post.postType || 'Idea'}</Badge>
                    </div>
                    <h3 className="text-base font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{post.content}</p>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="space-y-8">
          {/* PREMIUM BANNER */}
          <Card className="bg-primary text-primary-foreground rounded-2xl overflow-hidden border-none shadow-xl shadow-primary/10">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Go Premium</h3>
                <p className="text-sm opacity-80 font-medium">Unlock unlimited AI reports and elite forensic tools.</p>
              </div>
              <Button variant="secondary" className="w-full font-bold rounded-xl h-11" asChild>
                <Link href="/dashboard/billing">View Plans</Link>
              </Button>
            </CardContent>
          </Card>

          {/* SYSTEM STATUS */}
          <Card className="border-border bg-muted/20 rounded-2xl">
            <CardHeader className="p-6 pb-2 border-b">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Network Status</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-2"><Activity className="h-3 w-3 text-green-500" /> AI Core</span>
                <span className="text-green-500">Operational</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-2"><Clock className="h-3 w-3 text-blue-500" /> Latency</span>
                <span>42ms</span>
              </div>
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="flex items-center gap-2"><ShieldCheck className="h-3 w-3 text-indigo-500" /> Encryption</span>
                <span>AES-256</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}