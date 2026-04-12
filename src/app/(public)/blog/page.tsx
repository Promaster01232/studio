
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Share2, 
  MessageCircle, 
  Twitter, 
  Bookmark, 
  Newspaper, 
  ChevronRight 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const categories = ["All", "Legal guides", "Legal tech", "Nyaya Sahayak updates"];

const posts = [
  {
    id: 1,
    title: "Nyaya Sahayak vs. ChatGPT: Which AI is better for Indian laws?",
    excerpt: "Explore the comparison chart of Nyaya Sahayak & ChatGPT for legal help in India. Discover their features, strengths, and the winner in this detailed guide.",
    date: "12/04/2026",
    readTime: "3 min read",
    category: "Nyaya Sahayak updates",
    author: "Nyaya Sahayak Team",
    image: "https://picsum.photos/seed/legalai/800/500",
    imageHint: "artificial intelligence"
  }
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleShare = (post: typeof posts[0], platform: 'whatsapp' | 'twitter' | 'copy') => {
    const shareText = `Read this report on Nyaya Sahayak: "${post.title}"`;
    const shareUrl = `${window.location.origin}/blog/${post.id}`;
    
    if (platform === 'whatsapp') {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
    } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
    } else if (platform === 'copy') {
        navigator.clipboard.writeText(shareUrl);
        toast({ title: "Link copied", description: "Report path saved to registry clipboard." });
    }
  };

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
          
          <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-none text-foreground">
            Nyaya Sahayak <span className="text-primary">blog</span>
          </h1>
          
          <p className="text-sm sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Stay informed with the latest legal news, guides, and insights from India's leading AI legal assistant.
          </p>
        </motion.div>

        {/* Search ingress */}
        <div className="max-w-xl mx-auto relative group">
          <div className="absolute inset-0 bg-muted/50 rounded-2xl border border-border/10 pointer-events-none group-focus-within:border-primary/40 transition-colors" />
          <div className="flex items-center gap-4 p-2 relative z-10">
            <Search className="ml-4 h-5 w-5 text-muted-foreground/40" />
            <Input 
              placeholder="Search articles..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none focus-visible:ring-0 text-foreground font-medium placeholder:text-muted-foreground/20" 
            />
          </div>
        </div>
      </section>

      {/* Filter section */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-8 border-b border-border/10 pb-8">
        <div className="flex flex-wrap justify-center gap-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "text-xs font-black uppercase tracking-widest transition-all",
                activeCategory === cat ? "text-primary border-b-2 border-primary pb-2" : "text-muted-foreground hover:text-foreground pb-2"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Posts registry */}
      <section className="space-y-12">
        <AnimatePresence mode="popLayout">
          {filteredPosts.length > 0 ? (
            <div className="flex justify-center">
              {filteredPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="max-w-md w-full"
                >
                  <Card className="bg-card border-border/10 rounded-[2rem] overflow-hidden hover:border-primary/20 transition-all duration-500 group text-left h-full flex flex-col shadow-2xl">
                    <div className="relative overflow-hidden aspect-[16/10]">
                      <Image 
                        src={post.image} 
                        alt={post.title} 
                        fill 
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        data-ai-hint={post.imageHint}
                      />
                    </div>
                    
                    <CardContent className="p-8 flex flex-col flex-grow space-y-6">
                      <div className="space-y-4 flex-grow">
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded-lg">
                          {post.category}
                        </Badge>
                        
                        <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
                          {post.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-border/10">
                        <div className="flex items-center justify-between gap-4">
                          <Button variant="ghost" asChild className="p-0 h-auto font-black text-[10px] uppercase tracking-widest text-primary gap-2 hover:bg-transparent">
                            <Link href={`/blog/${post.id}`}>
                              Read full report <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </Button>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-muted/50 border border-border/10 hover:bg-primary hover:text-primary-foreground transition-all">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 shadow-2xl glass border-primary/10">
                              <DropdownMenuItem onClick={() => handleShare(post, 'whatsapp')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                <div className="bg-green-500/10 p-1.5 rounded-md text-green-600">
                                  <MessageCircle className="h-3.5 w-3.5" />
                                </div>
                                WhatsApp
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare(post, 'twitter')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                <div className="bg-blue-500/10 p-1.5 rounded-md text-blue-500">
                                  <Twitter className="h-3.5 w-3.5" />
                                </div>
                                Twitter (X)
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleShare(post, 'copy')} className="rounded-lg font-bold text-xs h-10 px-3 cursor-pointer gap-3 text-left">
                                <div className="bg-primary/10 p-1.5 rounded-md text-primary">
                                  <Bookmark className="h-3.5 w-3.5" />
                                </div>
                                Copy report link
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
    </div>
  );
}
