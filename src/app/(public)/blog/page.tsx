
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Grid, 
  List, 
  Calendar, 
  Clock, 
  ArrowRight,
  Sparkles,
  Newspaper,
  BookOpen,
  Zap,
  ShieldCheck
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

const categories = ["All", "Legal guides", "Legal tech", "Nyaya Sahayak updates"];

const posts = [
  {
    id: 1,
    title: "Understanding the Bharatiya Nyaya Sanhita (BNS) 2023",
    excerpt: "A forensic breakdown of the major shifts from the IPC 1860 to the new BNS framework and how it affects the citizen.",
    date: "June 15, 2025",
    readTime: "8 min read",
    category: "Legal guides",
    image: "https://picsum.photos/seed/blog1/800/500",
    imageHint: "legal gavel",
    featured: true
  },
  {
    id: 2,
    title: "The role of AI in procedural justice",
    excerpt: "How neural forensic engines are democratizing legal information and providing personalized roadmaps for 1.4 billion people.",
    date: "June 10, 2025",
    readTime: "5 min read",
    category: "Legal tech",
    image: "https://picsum.photos/seed/blog2/800/500",
    imageHint: "artificial intelligence"
  },
  {
    id: 3,
    title: "Data privacy under the DPDP act 2023",
    excerpt: "Protecting citizen data sovereignty in the digital age: a guide to your new statutory rights in Bharat.",
    date: "June 02, 2025",
    readTime: "6 min read",
    category: "Nyaya Sahayak updates",
    image: "https://picsum.photos/seed/blog3/800/500",
    imageHint: "data security"
  }
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewType, setViewType] = useState<'grid' | 'list'>('list');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-32 px-4 sm:px-6 text-center">
      {/* Header section */}
      <section className="space-y-8 pt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            Legal insights & updates
          </Badge>
          
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-none text-white">
            Nyaya Sahayak <span className="text-primary">blog</span>
          </h1>
          
          <p className="text-sm sm:text-lg text-white/40 font-medium max-w-2xl mx-auto leading-relaxed">
            Stay informed with the latest legal news, guides, and insights from India's leading AI legal assistant.
          </p>
        </motion.div>

        {/* Search ingress */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10 pointer-events-none group-focus-within:border-primary/40 transition-colors" />
          <div className="flex items-center gap-4 p-2 relative z-10">
            <Search className="ml-4 h-5 w-5 text-white/20" />
            <Input 
              placeholder="Search articles by title or content..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus-visible:ring-0 text-white font-medium placeholder:text-white/20" 
            />
          </div>
        </div>
      </section>

      {/* Filter and View Switcher section */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-8 border-b border-white/5 pb-8">
        <div className="flex flex-wrap justify-center sm:justify-start gap-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "text-xs font-black uppercase tracking-widest transition-all",
                activeCategory === cat ? "text-primary border-b-2 border-primary pb-2" : "text-white/40 hover:text-white pb-2"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setViewType('grid')}
            className={cn("h-8 w-8 rounded-lg", viewType === 'grid' ? "bg-primary text-primary-foreground shadow-lg" : "text-white/40")}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setViewType('list')}
            className={cn("h-8 w-8 rounded-lg", viewType === 'list' ? "bg-primary text-primary-foreground shadow-lg" : "text-white/40")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Posts registry */}
      <section className="space-y-12">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            <div className={cn(
              "grid gap-8",
              viewType === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/blog/${post.id}`}>
                    <Card className={cn(
                      "bg-[#161b22] border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/20 transition-all duration-500 group text-left",
                      viewType === 'list' && "md:flex items-center"
                    )}>
                      <div className={cn(
                        "relative overflow-hidden",
                        viewType === 'list' ? "md:w-2/5 aspect-[16/10]" : "aspect-[16/9]"
                      )}>
                        <Image 
                          src={post.image} 
                          alt={post.title} 
                          fill 
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          data-ai-hint={post.imageHint}
                        />
                        <div className="absolute top-6 left-6 flex gap-2">
                          <Badge className="bg-primary text-primary-foreground font-black text-[8px] uppercase px-3 py-1 rounded-lg">
                            {post.category}
                          </Badge>
                          {post.featured && (
                            <Badge className="bg-white/10 backdrop-blur-md text-white font-black text-[8px] uppercase px-3 py-1 rounded-lg border border-white/10">
                              Latest
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <CardContent className={cn(
                        "p-8 sm:p-10 space-y-6",
                        viewType === 'list' && "md:w-3/5"
                      )}>
                        <div className="flex items-center gap-4 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {post.date}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {post.readTime}</span>
                        </div>
                        
                        <div className="space-y-3">
                          <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-primary transition-colors leading-tight tracking-tight">
                            {post.title}
                          </h3>
                          <p className="text-sm text-white/40 font-medium leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                          <Button variant="ghost" className="p-0 h-auto font-black text-[10px] uppercase tracking-widest text-primary gap-2 hover:bg-transparent">
                            Read full report <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 flex flex-col items-center gap-6 opacity-20"
            >
              <Newspaper className="h-16 w-16" />
              <p className="text-sm font-black uppercase tracking-[0.4em]">No matching transmissions found</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <div className="pt-12 text-center opacity-20">
        <p className="text-[10px] font-bold text-white uppercase tracking-widest">Nyayasahayak.in // Transmission hub // 2025</p>
      </div>
    </div>
  );
}
