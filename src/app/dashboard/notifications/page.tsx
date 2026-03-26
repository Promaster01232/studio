
"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Mail, Heart, ShieldAlert, CheckCircle2, Clock, ArrowRight, Trash2, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useAuth, useFirestore } from "@/firebase";
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationNode {
    id: string;
    type: 'like' | 'admin_message' | 'system';
    title: string;
    description: string;
    isRead: boolean;
    createdAt: any;
    link?: string;
}

export default function NotificationsPage() {
  const auth = useAuth();
  const firestore = useFirestore();
  const [notifications, setNotifications] = useState<NotificationNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const notifRef = collection(firestore, "notifications");
    const q = query(
        notifRef, 
        where("userId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationNode));
        setNotifications(list);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, firestore]);

  const markAsRead = async (id: string) => {
      await updateDoc(doc(firestore, "notifications", id), { isRead: true });
  };

  const deleteNotif = async (id: string) => {
      await deleteDoc(doc(firestore, "notifications", id));
  };

  const markAllRead = async () => {
      const batch = writeBatch(firestore);
      notifications.filter(n => !n.isRead).forEach(n => {
          batch.update(doc(firestore, "notifications", n.id), { isRead: true });
      });
      await batch.commit();
  };

  const clearRegistry = async () => {
      if (!confirm("Clear Registry: This will permanently erase all notification nodes.")) return;
      const batch = writeBatch(firestore);
      notifications.forEach(n => {
          batch.delete(doc(firestore, "notifications", n.id));
      });
      await batch.commit();
  };

  const getIcon = (type: string) => {
      switch(type) {
          case 'like': return Heart;
          case 'admin_message': return Mail;
          default: return Bell;
      }
  };

  const getStatusColor = (type: string) => {
      switch(type) {
          case 'like': return "bg-red-500";
          case 'admin_message': return "bg-blue-500";
          default: return "bg-primary";
      }
  };

  if (loading) {
      return (
          <div className="flex h-[60vh] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary opacity-20" />
          </div>
      );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-10 max-w-4xl mx-auto pb-20 px-2 sm:px-0 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-primary/5 pb-8">
        <PageHeader
            title="Institutional Alerts"
            description="Registry of statutory updates, community engagement, and administrative transmissions."
        />
        <div className="flex items-center gap-2">
            {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllRead} className="h-9 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest text-primary hover:bg-primary/5">
                    Clear Badge
                </Button>
            )}
            <Button variant="ghost" size="sm" onClick={clearRegistry} className="h-9 px-4 rounded-xl font-black text-[9px] uppercase tracking-widest text-destructive hover:bg-destructive/5">
                Purge Registry
            </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
            {notifications.map((notif, idx) => {
                const Icon = getIcon(notif.type);
                const color = getStatusColor(notif.type);
                
                return (
                    <motion.div 
                        key={notif.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ delay: idx * 0.05 }}
                    >
                        <Card 
                            className={cn(
                                "overflow-hidden glass transition-all border-primary/5 rounded-[1.5rem] group relative",
                                !notif.isRead && "bg-primary/5 border-primary/20 shadow-xl shadow-primary/5"
                            )}
                            onClick={() => !notif.isRead && markAsRead(notif.id)}
                        >
                            {!notif.isRead && (
                                <div className={cn("absolute left-0 top-0 bottom-0 w-1", color)}></div>
                            )}
                            <CardContent className="p-5 sm:p-6 flex gap-5 items-start">
                                <div className={cn(
                                    "p-3 rounded-2xl shrink-0 transition-transform group-hover:scale-110",
                                    !notif.isRead ? `${color} text-white shadow-lg` : "bg-muted text-muted-foreground"
                                )}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="flex-1 space-y-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-sm sm:text-base tracking-tight truncate">{notif.title}</h3>
                                            {!notif.isRead && (
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-muted-foreground text-[9px] font-black uppercase tracking-widest shrink-0">
                                            <Clock className="h-3 w-3" />
                                            {notif.createdAt ? formatDistanceToNow(notif.createdAt.toDate(), { addSuffix: true }) : 'Syncing...'}
                                        </div>
                                    </div>
                                    <p className="text-xs sm:text-sm text-muted-foreground font-medium leading-relaxed">
                                        {notif.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between pt-4">
                                        {notif.link ? (
                                            <Button variant="ghost" className="h-8 px-3 rounded-lg font-black text-[9px] uppercase tracking-widest gap-2 hover:bg-primary/10 hover:text-primary transition-all" asChild>
                                                <Link href={notif.link}>
                                                    Initialize Node <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </Button>
                                        ) : (
                                            <div className="h-8"></div>
                                        )}
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                                            className="h-8 w-8 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5 active:scale-90 transition-all"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </AnimatePresence>
      </div>

      {notifications.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center opacity-40 flex flex-col items-center gap-6">
          <div className="p-8 rounded-[2.5rem] bg-muted/50 border-2 border-dashed border-primary/10">
            <Bell className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <p className="font-black text-2xl tracking-tighter uppercase">Registry Clear</p>
            <p className="text-xs text-muted-foreground font-medium italic">"No institutional alerts are currently active for this node."</p>
          </div>
        </motion.div>
      )}

      <div className="pt-16 border-t border-primary/5 text-center opacity-30">
          <p className="text-[8px] font-black uppercase tracking-[0.6em] text-muted-foreground">NYAYASAHAYAK.IN // SECURE REGISTRY NODE</p>
      </div>
    </div>
  );
}
