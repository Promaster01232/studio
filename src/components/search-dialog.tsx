
"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Search, FileText, Gavel, Library } from "lucide-react";
import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const suggestions = [
    { name: "Legal Knowledge Hub", type: "Resource", icon: Library, href: "/dashboard/learn" },
    { name: "My Tracked Cases", type: "Tool", icon: Gavel, href: "/dashboard/my-cases" },
    { name: "Generate Legal Notice", type: "Action", icon: FileText, href: "/dashboard/document-generator" },
    { name: "Document Intelligence", type: "AI Tool", icon: FileText, href: "/dashboard/document-intelligence" },
];

export function SearchDialog({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search
          </DialogTitle>
          <DialogDescription>
              Search across cases, documents, guides and tools.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tools and resources..." className="pl-10" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2 px-1">Quick Access</h3>
          <div className="flex flex-col space-y-1">
              {suggestions.map((suggestion) => (
                  <button
                      key={suggestion.href}
                      onClick={() => runCommand(suggestion.href)}
                      className="flex items-center p-2 rounded-md hover:bg-accent text-sm text-left w-full"
                  >
                      <suggestion.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{suggestion.name}</span>
                  </button>
              ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
