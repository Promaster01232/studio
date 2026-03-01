"use client";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Newspaper, Info, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Hardcoded notifications cleared as per user request
const notifications: any[] = [];

export default function NotificationsPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <PageHeader
        title="Notifications"
        description="Stay updated with the latest news, legal alerts, and platform improvements."
      />

      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className={`overflow-hidden transition-all hover:shadow-md border-primary/5 ${notification.isNew ? 'bg-primary/5 border-primary/20 shadow-sm' : ''}`}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex gap-4 items-start">
                <div className={`p-3 rounded-xl shrink-0 ${notification.isNew ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground'}`}>
                  <notification.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base tracking-tight">{notification.title}</h3>
                      {notification.isNew && (
                        <Badge variant="default" className="h-5 text-[10px] font-bold px-2">New</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] font-medium shrink-0">
                      <Clock className="h-3 w-3" />
                      {notification.time}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                    {notification.description}
                  </p>
                  
                  {notification.link && (
                    <Link 
                      href={notification.link} 
                      className="inline-flex items-center text-xs font-bold text-primary hover:underline pt-2 gap-1 group"
                    >
                      View Details
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <Card className="border-dashed border-2 bg-transparent py-20">
          <CardContent className="flex flex-col items-center justify-center text-center gap-4">
            <div className="bg-muted p-4 rounded-full">
              <Bell className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg">No Notifications</h3>
              <p className="text-sm text-muted-foreground max-w-[250px]">You're all caught up! Check back later for news and updates.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
