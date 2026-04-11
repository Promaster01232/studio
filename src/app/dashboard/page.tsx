
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Zap,
  Sparkles,
  Paperclip,
  SlidersHorizontal,
  Clock,
  Mic,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth, useFirestore } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardHomePage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(firestore, "users", auth.currentUser.uid);
      getDoc(userRef).then(doc => {
        if (doc.exists()) {
          setUserProfile(doc.data());
        }
      });
    }
  }, [auth, firestore]);

  const suggestions = [
    "What are tenant rights in India?",
    "How to file a consumer complaint?",
    "Explain Domestic Violence Act",
    "What is bail process in India?"
  ];

  return (
    <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[calc(100vh-160px)] py-12 px-4 sm:px-6 text-center font-body">
      
      {/* CENTRAL ICON */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="mb-8"
      >
        <div className="p-4 rounded-full bg-primary/10 border border-primary/20 shadow-[0_0_40px_rgba(153,75,0,0.15)]">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
      </motion.div>

      {/* GREETING TERMINAL */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-4 mb-10"
      >
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
          Hello, how can I help you today?
        </h1>
        <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
          Ask me about Indian law, case citations, or legal guidance
        </p>
      </motion.div>

      {/* SUGGESTION PILLS */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-16"
      >
        {suggestions.map((text, i) => (
          <Button 
            key={i} 
            variant="outline" 
            className="rounded-full bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white font-bold text-xs h-10 px-6 transition-all"
          >
            {text}
          </Button>
        ))}
      </motion.div>

      {/* CHAT INPUT HUB */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-3xl"
      >
        <Card className="bg-[#161b22] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-6 space-y-4 text-left">
            <Textarea 
              placeholder="Ask NyayGuru Legal AI..." 
              className="bg-transparent border-none focus-visible:ring-0 text-white text-lg placeholder:text-gray-600 min-h-[140px] resize-none p-0 custom-scrollbar"
            />
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-4 text-gray-500">
                <button className="hover:text-primary transition-all active:scale-90">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="hover:text-primary transition-all active:scale-90">
                  <SlidersHorizontal className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-tighter">10/10</span>
                </div>
                <div className="flex items-center gap-1.5 group cursor-pointer hover:text-gray-300 transition-colors">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Saved</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="text-gray-500 hover:text-primary transition-all active:scale-90">
                  <Mic className="h-5 w-5" />
                </button>
                <button className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 active:scale-95 transition-all hover:bg-primary/90">
                  <Send className="h-5 w-5 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

    </div>
  );
}
